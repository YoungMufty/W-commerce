const prisma = require('./backend/src/utils/prismaClient');
const messagingService = require('./backend/src/services/messagingService');

async function test() {
  try {
    const messages = await prisma.message.findMany({
      where: {
        orderId: '670b1391-e798-4d94-8cff-3ca20256f47a'
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
      take: 2
    });

    console.log('Found messages count:', messages.length);
    for (const msg of messages) {
      const normalized = messagingService.normalizeMessage(msg);
      console.log('--- Message ID:', msg.id);
      console.log('Content:', msg.content);
      console.log('OrderPreview:', JSON.stringify(normalized.orderPreview, null, 2));
    }
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
