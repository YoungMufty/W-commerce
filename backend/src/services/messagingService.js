const prisma = require('../utils/prismaClient');
const logger = require('../utils/logger');

function safeJsonParse(value) {
    if (!value) return {};
    try {
        return JSON.parse(value);
    } catch {
        return {};
    }
}

function toISO(value) {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

class MessagingService {
    async resolveUser({ receiverId, recipient, receiverName }) {
        if (receiverId) {
            return prisma.user.findUnique({
                where: { id: String(receiverId) },
                select: { id: true, fullName: true, email: true, role: true }
            });
        }

        const lookup = String(recipient || receiverName || '').trim();
        if (!lookup) return null;

        const directUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { fullName: lookup },
                    { email: lookup }
                ]
            },
            select: { id: true, fullName: true, email: true, role: true }
        });

        if (directUser) return directUser;

        const store = await prisma.store.findFirst({
            where: { storeName: lookup },
            include: {
                user: {
                    select: { id: true, fullName: true, email: true, role: true }
                }
            }
        });

        return store?.user || null;
    }

    async resolveConversation(senderId, receiverId, contextId = null) {
        const existing = await prisma.conversation.findFirst({
            where: {
                type: 'DIRECT',
                participants: {
                    some: { userId: senderId }
                },
                AND: [
                    {
                        participants: {
                            some: { userId: receiverId }
                        }
                    }
                ]
            },
            orderBy: { updatedAt: 'desc' }
        });

        if (existing) {
            if (contextId && !existing.contextId) {
                await prisma.conversation.update({
                    where: { id: existing.id },
                    data: { contextId }
                });
            }
            return existing;
        }

        const participantsData = senderId === receiverId 
            ? [{ userId: senderId }]
            : [{ userId: senderId }, { userId: receiverId }];

        return prisma.conversation.create({
            data: {
                type: 'DIRECT',
                contextId,
                participants: {
                    create: participantsData
                }
            }
        });
    }

    async updateSellerResponseMetrics(sender, conversationId, sentAt) {
        if (!sender || sender.role !== 'SELLER') {
            return null;
        }

        const lastBuyerMessage = await prisma.message.findFirst({
            where: {
                conversationId,
                createdAt: { lt: sentAt },
                sender: { role: 'BUYER' },
                isSystemMessage: false
            },
            orderBy: { createdAt: 'desc' }
        });

        if (!lastBuyerMessage) {
            return null;
        }

        const diffMinutes = Math.max(1, Math.round((sentAt.getTime() - new Date(lastBuyerMessage.createdAt).getTime()) / (1000 * 60)));
        const store = await prisma.store.findUnique({ where: { sellerId: sender.id } });
        if (store) {
            const currentAvg = Number(store.avgResponseMinutes || 45);
            const blended = Math.max(1, Math.round((currentAvg * 0.7) + (diffMinutes * 0.3)));
            await prisma.store.update({
                where: { sellerId: sender.id },
                data: { avgResponseMinutes: blended }
            });
        }

        return diffMinutes;
    }

    async createNotification(userId, title, body, linkUrl = '/messages.html') {
        try {
            await prisma.notification.create({
                data: {
                    userId,
                    title,
                    body,
                    type: 'INFO',
                    linkUrl
                }
            });
        } catch (error) {
            logger.warn(`Message notification failed: ${error.message}`);
        }
    }

    async sendMessage(payload, options = {}) {
        const {
            senderId,
            receiverId,
            recipient,
            receiverName,
            content,
            text,
            productId = null,
            orderId = null,
            quotedMsg = null,
            productContext = null,
            orderContext = null,
            isSystemMessage = false,
            isAutoReply = false
        } = payload;

        const body = String(content || text || '').trim();
        if (!senderId || (!receiverId && !recipient && !receiverName) || !body) {
            throw new Error('Sender, recipient, and message content are required.');
        }

        const [sender, receiver] = await Promise.all([
            prisma.user.findUnique({
                where: { id: String(senderId) },
                select: { id: true, fullName: true, role: true }
            }),
            this.resolveUser({ receiverId, recipient, receiverName })
        ]);

        if (!sender) throw new Error('Sender not found');
        if (!receiver) throw new Error('Recipient not found');

        const conversation = await this.resolveConversation(sender.id, receiver.id, orderId || productId || null);
        const now = new Date();
        const responseTimeMinutes = await this.updateSellerResponseMetrics(sender, conversation.id, now);
        const metadata = JSON.stringify({
            quotedMsg: quotedMsg || null,
            productContext: productContext || null,
            orderContext: orderContext || null
        });

        const message = await prisma.message.create({
            data: {
                conversationId: conversation.id,
                senderId: sender.id,
                recipientId: receiver.id,
                productId: productId || null,
                orderId: orderId || null,
                content: body,
                metadata,
                isSystemMessage,
                isAutoReply,
                responseTimeMinutes: responseTimeMinutes || null
            },
            include: {
                sender: { select: { id: true, fullName: true, role: true } },
                recipient: { select: { id: true, fullName: true, role: true } },
                product: {
                    select: {
                        id: true,
                        title: true,
                        images: {
                            where: { isPrimary: true },
                            select: { url: true },
                            take: 1
                        }
                    }
                },
                order: {
                    select: {
                        id: true,
                        status: true,
                        totalAmount: true,
                        currency: true,
                        items: {
                            include: {
                                product: {
                                    include: {
                                        images: {
                                            select: { url: true, isPrimary: true }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        await prisma.conversation.update({
            where: { id: conversation.id },
            data: {
                contextId: orderId || productId || conversation.contextId || null
            }
        });

        await prisma.conversationParticipant.updateMany({
            where: {
                conversationId: conversation.id,
                userId: sender.id
            },
            data: {
                lastReadAt: now
            }
        });

        await this.createNotification(
            receiver.id,
            isAutoReply ? 'Automatic reply sent' : `New message from ${sender.fullName}`,
            body.slice(0, 120),
            `/messages.html?recipientId=${sender.id}`
        );

        const normalized = this.normalizeMessage(message);
        const output = {
            conversationId: conversation.id,
            message: normalized,
            autoReply: null
        };

        if (!isAutoReply && !options.skipAutoReply && sender.role === 'BUYER' && receiver.role === 'SELLER' && options.recipientOnline === false) {
            const recentAutoReply = await prisma.message.findFirst({
                where: {
                    conversationId: conversation.id,
                    senderId: receiver.id,
                    recipientId: sender.id,
                    isAutoReply: true,
                    createdAt: { gte: new Date(Date.now() - (30 * 60 * 1000)) }
                }
            });

            if (!recentAutoReply) {
                const autoReplyPayload = await this.sendMessage({
                    senderId: receiver.id,
                    receiverId: sender.id,
                    content: 'Thanks for your message. We will respond soon.',
                    productId,
                    orderId,
                    productContext,
                    isSystemMessage: true,
                    isAutoReply: true
                }, { recipientOnline: true });
                output.autoReply = autoReplyPayload.message;
            }
        }

        return output;
    }

    normalizeMessage(message) {
        const metadata = safeJsonParse(message.metadata);
        let orderPreview = metadata?.orderContext || null;

        if (message.order) {
            const firstItem = message.order.items?.[0];
            const firstProduct = firstItem?.product;
            const primaryImage = firstProduct?.images?.find(img => img.isPrimary)?.url || firstProduct?.images?.[0]?.url || null;

            const hex = message.order.id ? message.order.id.replace(/[^A-Za-z0-9]/g, '').slice(-8).toUpperCase() : '';
            const generatedOrderNum = hex ? `#W-DOM-${hex}` : (message.order.id ? `#${message.order.id.slice(0, 8)}` : null);

            orderPreview = {
                id: message.order.id,
                orderNumber: orderPreview?.orderNumber || generatedOrderNum,
                status: message.order.status || 'PAID',
                totalAmount: message.order.totalAmount,
                currency: message.order.currency || 'NGN',
                productTitle: firstProduct?.title || orderPreview?.productTitle || null,
                productImage: primaryImage || orderPreview?.productImage || null,
                quantity: firstItem?.quantity || orderPreview?.quantity || 1,
                priceAtTime: firstItem?.priceAtTime || orderPreview?.productPrice || null,
                items: (message.order.items || []).map(it => ({
                    id: it.id,
                    productId: it.productId,
                    title: it.product?.title,
                    image: it.product?.images?.find(img => img.isPrimary)?.url || it.product?.images?.[0]?.url || null,
                    quantity: it.quantity,
                    priceAtTime: it.priceAtTime
                }))
            };
        } else if (orderPreview) {
            if (!orderPreview.id && message.orderId) {
                orderPreview.id = message.orderId;
            }
        } else if (message.orderId) {
            const hex = message.orderId.replace(/[^A-Za-z0-9]/g, '').slice(-8).toUpperCase();
            orderPreview = {
                id: message.orderId,
                orderNumber: hex ? `#W-DOM-${hex}` : `#${message.orderId.slice(0, 8)}`,
                status: 'PAID'
            };
        }

        // Also check if content has Order Inquiry pattern:
        // e.g. 📦 **[Order Inquiry: #W-DOM-0256F47A (#670b1391)]**
        if (!orderPreview && typeof message.content === 'string') {
            const match = message.content.match(/\[Order Inquiry:\s*#?([A-Za-z0-9_-]+)(?:\s*\((#?[A-Za-z0-9_-]+)\))?\]/i);
            if (match) {
                const orderNum = match[1];
                const rawId = match[2] ? match[2].replace(/^#/, '') : (message.orderId || null);
                orderPreview = {
                    id: rawId || orderNum,
                    orderNumber: orderNum.startsWith('#') ? orderNum : `#${orderNum}`,
                    status: 'INQUIRY'
                };
            }
        }

        return {
            id: message.id,
            conversationId: message.conversationId,
            senderId: message.senderId,
            senderName: message.sender?.fullName || 'User',
            receiverId: message.recipientId,
            receiverName: message.recipient?.fullName || 'User',
            content: message.content,
            text: message.content,
            sender: message.sender?.fullName || 'User',
            recipient: message.recipient?.fullName || 'User',
            createdAt: toISO(message.createdAt),
            timestamp: toISO(message.createdAt),
            quotedMsg: metadata.quotedMsg || null,
            productContext: metadata.productContext || null,
            orderId: message.orderId || orderPreview?.id || null,
            productPreview: message.product ? {
                id: message.product.id,
                title: message.product.title,
                image: message.product.images?.[0]?.url || null
            } : null,
            orderPreview,
            isSystemMessage: Boolean(message.isSystemMessage),
            isAutoReply: Boolean(message.isAutoReply),
            responseTimeMinutes: message.responseTimeMinutes || null
        };
    }

    async getConversations(userId, limit = 30) {
        const memberships = await prisma.conversationParticipant.findMany({
            where: { userId },
            include: {
                conversation: {
                    include: {
                        participants: {
                            include: {
                                user: {
                                    select: { id: true, fullName: true, avatarUrl: true, role: true }
                                }
                            }
                        },
                        messages: {
                            include: {
                                product: {
                                    select: {
                                        title: true
                                    }
                                }
                            },
                            orderBy: { createdAt: 'desc' },
                            take: 1
                        }
                    }
                }
            },
            take: limit
        });

        const conversations = [];
        for (const membership of memberships) {
            const conversation = membership.conversation;
            const otherParticipant = conversation.participants.find((participant) => participant.userId !== userId) || conversation.participants[0];
            if (!otherParticipant) continue;

            const lastMessage = conversation.messages[0];
            const unreadCount = await prisma.message.count({
                where: {
                    conversationId: conversation.id,
                    senderId: { not: userId },
                    createdAt: { gt: membership.lastReadAt }
                }
            });

            conversations.push({
                conversationId: conversation.id,
                otherUser: {
                    id: otherParticipant.user.id,
                    fullName: otherParticipant.user.fullName,
                    avatarUrl: otherParticipant.user.avatarUrl,
                    role: otherParticipant.user.role
                },
                lastMessage: lastMessage ? {
                    content: lastMessage.content,
                    createdAt: toISO(lastMessage.createdAt)
                } : null,
                lastMessageText: lastMessage?.content || '',
                unreadCount,
                with: otherParticipant.user.fullName,
                withId: otherParticipant.user.id,
                productContext: lastMessage?.product?.title || null,
                timestamp: toISO(lastMessage?.createdAt)
            });
        }

        return conversations.sort((left, right) => {
            const leftTime = new Date(left.timestamp || left.lastMessage?.createdAt || 0).getTime();
            const rightTime = new Date(right.timestamp || right.lastMessage?.createdAt || 0).getTime();
            return rightTime - leftTime;
        });
    }

    async findConversationIdsForUsers(userId, otherUserId) {
        const memberships = await prisma.conversationParticipant.findMany({
            where: { userId },
            select: { conversationId: true }
        });
        const conversationIds = memberships.map((item) => item.conversationId);
        if (conversationIds.length === 0) return [];

        const sharedMemberships = await prisma.conversationParticipant.findMany({
            where: {
                userId: otherUserId,
                conversationId: { in: conversationIds }
            },
            select: { conversationId: true }
        });

        return sharedMemberships.map((item) => item.conversationId);
    }

    async getHistory(userId, options = {}) {
        let otherUserId = options.otherUserId || null;
        if (!otherUserId && (options.recipient || options.receiverName)) {
            const resolved = await this.resolveUser({
                recipient: options.recipient,
                receiverName: options.receiverName
            });
            otherUserId = resolved?.id || null;
        }

        if (!otherUserId) {
            return [];
        }

        const conversationIds = await this.findConversationIdsForUsers(userId, otherUserId);
        if (conversationIds.length === 0) {
            return [];
        }

        const messages = await prisma.message.findMany({
            where: {
                conversationId: { in: conversationIds }
            },
            include: {
                sender: { select: { id: true, fullName: true, role: true } },
                recipient: { select: { id: true, fullName: true, role: true } },
                product: {
                    select: {
                        id: true,
                        title: true,
                        images: {
                            where: { isPrimary: true },
                            select: { url: true },
                            take: 1
                        }
                    }
                },
                order: {
                    select: {
                        id: true,
                        status: true,
                        totalAmount: true,
                        currency: true,
                        items: {
                            include: {
                                product: {
                                    include: {
                                        images: {
                                            select: { url: true, isPrimary: true }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        return messages.map((message) => this.normalizeMessage(message));
    }

    async markAsRead(userId, options = {}) {
        let otherUserId = options.otherUserId || null;
        if (!otherUserId && options.recipient) {
            const resolved = await this.resolveUser({ recipient: options.recipient });
            otherUserId = resolved?.id || null;
        }
        if (!otherUserId) return;

        const conversationIds = await this.findConversationIdsForUsers(userId, otherUserId);
        if (conversationIds.length === 0) return;

        await prisma.conversationParticipant.updateMany({
            where: {
                conversationId: { in: conversationIds },
                userId
            },
            data: {
                lastReadAt: new Date()
            }
        });
    }

    async getRecentMessages(userId, limit = 3) {
        const conversations = await this.getConversations(userId, limit);
        return conversations.slice(0, limit).map((conversation) => ({
            senderId: conversation.otherUser.id,
            senderName: conversation.otherUser.fullName,
            preview: conversation.lastMessage?.content || '',
            content: conversation.lastMessage?.content || '',
            unread: conversation.unreadCount > 0,
            timestamp: conversation.lastMessage?.createdAt || conversation.timestamp,
            isSupport: conversation.otherUser.role === 'ADMIN'
        }));
    }

    async getQuickReplies(sellerId) {
        const templates = await prisma.quickReplyTemplate.findMany({
            where: {
                sellerId,
                isActive: true
            },
            orderBy: [
                { usageCount: 'desc' },
                { updatedAt: 'desc' }
            ]
        });

        if (templates.length > 0) {
            return templates;
        }

        return [
            { id: 'default-shipping', title: 'Shipping Update', content: 'Thanks for checking in. Your order is being prepared and I will share the next shipping update shortly.', category: 'shipping', isDefault: true },
            { id: 'default-stock', title: 'Availability', content: 'Yes, this item is currently available. I can confirm pricing and delivery details for you right away.', category: 'general', isDefault: true },
            { id: 'default-thanks', title: 'Thank You', content: 'Thanks for reaching out. I appreciate your interest and will help you with the next step.', category: 'thanks', isDefault: true }
        ];
    }

    async saveQuickReply(sellerId, { title, content, category = 'general' }) {
        return prisma.quickReplyTemplate.create({
            data: {
                sellerId,
                title: String(title || '').trim(),
                content: String(content || '').trim(),
                category: String(category || 'general').trim().toLowerCase()
            }
        });
    }

    async recordQuickReplyUsage(templateId) {
        if (!templateId || String(templateId).startsWith('default-')) {
            return;
        }

        try {
            await prisma.quickReplyTemplate.update({
                where: { id: templateId },
                data: {
                    usageCount: { increment: 1 }
                }
            });
        } catch (error) {
            logger.warn(`Quick reply usage tracking failed: ${error.message}`);
        }
    }
}

module.exports = new MessagingService();
