const engagementService = require('../services/engagementService');
const logger = require('../utils/logger');
const prisma = require('../utils/prismaClient'); // Keep for getComments which returns nested structures
const { getFilteredStarterProducts, STARTER_PRODUCTS } = require('../data/starterProducts');
const { getFilteredStarterDrops, CURATED_STARTER_DROPS } = require('../data/starterDrops');

const withDbTimeout = (promise, ms = 2500) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Feed database query timeout')), ms))
  ]);
};

exports.getFeed = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search } = req.query;
    const take = Math.min(Math.max(1, parseInt(limit, 10) || 20), 50);
    const skip = (Math.max(1, parseInt(page, 10) || 1) - 1) * take;

    let products = [];
    let total = 0;

    const normalizedCat = (category || '').toLowerCase().trim();
    const isTrending = normalizedCat === 'trending';
    const isGeneral = !normalizedCat || normalizedCat === 'foryou' || normalizedCat === 'all' || isTrending;

    try {
      const where = { isArchived: false, store: { approvalStatus: 'APPROVED' }, stock: { gt: 0 } };
      const conditions = [];

      if (!isGeneral) {
        conditions.push({
          OR: [
            { category: { contains: normalizedCat, mode: 'insensitive' } },
            { subCategory: { contains: normalizedCat, mode: 'insensitive' } },
            { tags: { contains: normalizedCat, mode: 'insensitive' } }
          ]
        });
      }

      if (search) {
        const searchStr = String(search).toLowerCase().trim();
        conditions.push({
          OR: [
            { title: { contains: searchStr, mode: 'insensitive' } },
            { description: { contains: searchStr, mode: 'insensitive' } },
            { tags: { contains: searchStr, mode: 'insensitive' } }
          ]
        });
      }

      if (conditions.length > 0) {
        where.AND = conditions;
      }

      const orderBy = isTrending
        ? [{ viewCount: 'desc' }, { createdAt: 'desc' }]
        : [{ isAdBoosted: 'desc' }, { viewCount: 'desc' }, { createdAt: 'desc' }];

      [products, total] = await withDbTimeout(
        Promise.all([
          prisma.product.findMany({
            where,
            take,
            skip,
            orderBy,
            include: {
              store: {
                select: {
                  id: true,
                  storeName: true,
                  portfolioSlug: true,
                  isVerified: true
                }
              },
              images: true
            }
          }),
          prisma.product.count({ where })
        ]),
        2500
      );
    } catch (dbErr) {
      logger.warn(`Feed database query warning: ${dbErr.message}`);
    }

    if (!products || products.length === 0) {
      const fallback = getFilteredStarterProducts(req.query);
      products = fallback.products.length > 0 ? fallback.products : getFilteredStarterProducts({ limit: take }).products;
      total = fallback.total || products.length;
    }

    return res.status(200).json({
      success: true,
      count: products.length,
      total,
      products,
      data: products,
      feed: products,
      pagination: {
        page: parseInt(page, 10) || 1,
        pages: Math.ceil(total / take) || 1,
        total
      }
    });
  } catch (error) {
    logger.error(`Get Feed Error: ${error.message}`);
    const fallback = getFilteredStarterProducts(req.query);
    const fallbackProducts = fallback.products.length > 0 ? fallback.products : getFilteredStarterProducts({ limit: 20 }).products;
    return res.status(200).json({
      success: true,
      count: fallbackProducts.length,
      total: fallbackProducts.length,
      products: fallbackProducts,
      data: fallbackProducts,
      feed: fallbackProducts,
      pagination: {
        page: 1,
        pages: 1,
        total: fallbackProducts.length
      }
    });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await prisma.feedComment.findMany({
      where: { postId, parentId: null },
      include: {
        user: { select: { id: true, fullName: true, avatarUrl: true } },
        replies: {
          include: {
            user: { select: { id: true, fullName: true, avatarUrl: true } }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    logger.error('Error fetching feed comments:', error);
    res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
  }
};

exports.postComment = async (req, res) => {
  try {
    const { postId, content, parentId } = req.body;
    const userId = req.user.id;

    if (!postId || !content) {
      return res.status(400).json({ success: false, message: 'Please provide postId and content' });
    }

    const comment = await engagementService.createComment(postId, userId, content, parentId);

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    logger.error(`Error posting feed comment: ${error.message}`);
    if (error.message === 'RATE_LIMIT_EXCEEDED') {
      return res.status(429).json({ success: false, message: 'Too many comments, please slow down.' });
    }
    if (error.message === 'POST_NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    await engagementService.deleteComment(commentId, userId, userRole);

    res.status(200).json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    logger.error(`Error deleting feed comment: ${error.message}`);
    if (error.message === 'COMMENT_NOT_FOUND') return res.status(404).json({ success: false, message: 'Comment not found' });
    if (error.message === 'UNAUTHORIZED') return res.status(403).json({ success: false, message: 'Unauthorized' });
    res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
  }
};

exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    
    const result = await engagementService.like(postId, userId);
    res.status(200).json({ success: true, liked: result.liked });
  } catch (error) {
    if (error.message === 'RATE_LIMIT_EXCEEDED') {
      return res.status(429).json({ success: false, message: 'Rate limit exceeded' });
    }
    res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    
    const result = await engagementService.unlike(postId, userId);
    res.status(200).json({ success: true, liked: result.liked });
  } catch (error) {
    res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
  }
};

exports.getEngagementStats = async (req, res) => {
  try {
    const { postId } = req.params;
    // req.user might be optional if we allow guest viewing, but assuming authenticated for now
    const userId = req.user ? req.user.id : null;

    const stats = await engagementService.getStats(postId, userId);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
  }
};

exports.batchEvents = async (req, res) => {
  try {
    const { events } = req.body;
    const userId = req.user ? req.user.id : null;
    const sessionId = req.headers['x-session-id'] || req.ip;

    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid events payload' });
    }

    const results = [];
    for (const event of events) {
      if (event.action === 'VIEW') {
        results.push(await engagementService.recordView(event.postId, userId, sessionId, event.target));
      } else if (event.action === 'CLICK') {
        results.push(await engagementService.recordClick(event.postId, userId, sessionId, event.target));
      }
    }

    res.status(200).json({ success: true, processed: results.length });
  } catch (error) {
    logger.error(`Error processing batch events: ${error.message}`);
    res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
  }
};

