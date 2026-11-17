const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const rateLimiter = require('../middleware/rateLimiter');
const { rateLimiters } = rateLimiter;
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/inputValidation');
const honeypot = require('../middleware/honeypot');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { getJwtSecret } = require('../utils/jwtSecret');
const authController = require('../controllers/authController');

// Rate limiter for resend verification (3 per hour)
const resendLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: { error: 'Too many verification requests. Please try again in an hour.' }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Too many requests from this IP, please try again after 15 minutes.' }
});

// Login: 5 attempts per 15 mins with progressive delay
router.post('/login', honeypot, validate('login', 'body'), authLimiter, authController.login);
router.post('/social-login', rateLimiters.login, authController.socialLogin);

// Signup: 10 accounts per hour per IP
router.post('/signup', honeypot, validate('signup', 'body'), rateLimiters.signup, authController.signup);
// Alias: /register → /signup (common alternative endpoint name)
router.post('/register', honeypot, validate('signup', 'body'), authLimiter, authController.signup);

// Email verification (no rate limit needed - single use tokens)
// router.get('/verify', authController.verifyEmail);
router.post('/verify-otp', authLimiter, authController.verifyOTP);

// Resend verification email: 3 per hour
router.post('/resend-verification', resendLimiter, authController.resendVerification);

// Forgot password: 3 attempts per hour with progressive delay
router.post('/forgot-password', rateLimiters.forgotPassword, authController.forgotPassword);

// Password reset (token-protected, no additional rate limit)
router.post('/reset-password', authController.resetPassword);

// Get current user session (protected by HttpOnly cookie)
router.get('/me', protect, authController.getMe);
router.post('/set-role', protect, authController.setRole);
router.put('/update-password', protect, authController.updatePassword);
router.post('/verify-bvn', protect, authController.verifyBvn);

// Logout (no rate limit needed)
router.post('/logout', authController.logout);

// Sessions
router.get('/sessions', protect, authController.getSessions);
router.delete('/sessions/:sessionId', protect, authController.revokeSession);

// ============================================
// Social Login Routes (Google/Apple)
// ============================================

const { isGoogleOAuthConfigured } = require('../services/passport');

// Safe helper to check if Google OAuth strategy is ready to serve requests
const isGoogleStrategyReady = () => {
    try {
        if (!isGoogleOAuthConfigured()) return false;
        const passport = require('passport');
        const hasStrategy = Boolean(
            (passport._strategies && passport._strategies.google) ||
            (typeof passport._strategy === 'function' && passport._strategy('google'))
        );
        return hasStrategy;
    } catch (e) {
        return false;
    }
};

// Google OAuth routes - uses Passport.js when configured
router.get('/google', (req, res, next) => {
    const frontendUrl = (process.env.FRONTEND_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://w-commerce-1yqf-nine.vercel.app')).replace(/\/+$/, '');

    // Bulletproof guard: check if Google OAuth credentials and strategy are ready
    if (!isGoogleStrategyReady()) {
        logger.warn('Google OAuth requested but strategy or credentials are not configured.');
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.status(200).json({
                success: false,
                message: 'Google OAuth is not configured on this environment.'
            });
        }
        return res.redirect(`${frontendUrl}/login?error=oauth_not_configured`);
    }

    try {
        const passport = require('passport');

        // Store state in base64 URL-safe parameter so it survives across serverless cold starts & multiple instances
        const statePayload = {
            role: req.query.role || 'BUYER',
            returnUrl: req.query.returnUrl || '/'
        };
        const stateStr = Buffer.from(JSON.stringify(statePayload)).toString('base64url');

        // Store return URL & role in session if session store is active
        if (req.session) {
            req.session.returnUrl = req.query.returnUrl;
            req.session.selectedRole = req.query.role;
        }

        // Trigger Google OAuth flow safely - intercept errors rather than letting next(err) crash with 500
        passport.authenticate('google', {
            scope: ['profile', 'email'],
            prompt: 'select_account', // Always show account picker
            state: stateStr
        })(req, res, (err) => {
            if (err) {
                logger.error(`Google OAuth initiation error: ${err.message}`);
                if (req.headers.accept && req.headers.accept.includes('application/json')) {
                    return res.status(200).json({
                        success: false,
                        message: 'Google OAuth is not configured on this environment.'
                    });
                }
                return res.redirect(`${frontendUrl}/login?error=oauth_not_configured`);
            }
            next();
        });

    } catch (err) {
        logger.error(`Google OAuth initiation catch error: ${err.message}`);
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.status(200).json({
                success: false,
                message: 'Google OAuth is not configured on this environment.'
            });
        }
        return res.redirect(`${frontendUrl}/login?error=oauth_not_configured`);
    }
});

router.get('/google/callback',
    (req, res, next) => {
        const frontendUrl = (process.env.FRONTEND_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://w-commerce-1yqf-nine.vercel.app')).replace(/\/+$/, '');

        // Bulletproof guard: check if Google strategy is configured before attempting callback
        if (!isGoogleStrategyReady()) {
            logger.warn('Google OAuth callback attempted but Google is not configured.');
            if (req.headers.accept && req.headers.accept.includes('application/json')) {
                return res.status(200).json({
                    success: false,
                    message: 'Google OAuth is not configured on this environment.'
                });
            }
            return res.redirect(`${frontendUrl}/login?error=oauth_not_configured`);
        }

        try {
            const passport = require('passport');

            passport.authenticate('google', { session: false }, (err, user, info) => {
                if (err) {
                    logger.error(`Google authenticate error: ${err.message}`);
                    return res.redirect(`${frontendUrl}/login?error=google_callback_failed`);
                }
                if (!user) {
                    logger.warn('Google authenticate returned no user');
                    return res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
                }
                req.user = user;
                next();
            })(req, res, (err) => {
                if (err) {
                    logger.error(`Google authenticate callback dispatch error: ${err.message}`);
                    return res.redirect(`${frontendUrl}/login?error=google_callback_failed`);
                }
                next();
            });
        } catch (err) {
            logger.error(`Google callback catch error: ${err.message}`);
            return res.redirect(`${frontendUrl}/login?error=google_callback_failed`);
        }
    },
    async (req, res) => {
        const frontendUrl = (process.env.FRONTEND_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://w-commerce-1yqf-nine.vercel.app')).replace(/\/+$/, '');
        try {
            let user = req.user;
            if (!user) {
                return res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
            }

            // Extract role & returnUrl from state payload (or session fallback)
            let stateData = {};
            if (req.query.state) {
                try {
                    stateData = JSON.parse(Buffer.from(req.query.state, 'base64url').toString('utf8'));
                } catch (e) {
                    logger.warn(`Could not parse Google OAuth state: ${e.message}`);
                }
            }
            const requestedRole = stateData.role || req.session?.selectedRole || 'BUYER';
            let returnPath = stateData.returnUrl || req.session?.returnUrl || '/';

            // If user role was PENDING, assign requested role
            if (user.role === 'PENDING' && requestedRole && requestedRole !== 'PENDING') {
                try {
                    const prisma = require('../utils/prismaClient');
                    user = await prisma.user.update({
                        where: { id: user.id },
                        data: { role: requestedRole }
                    });
                } catch (roleErr) {
                    logger.warn(`Failed to update pending user role: ${roleErr.message}`);
                }
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user.id, role: user.role, email: user.email },
                getJwtSecret(),
                { expiresIn: '30d' }
            );

            // Record session safely
            try {
                const prisma = require('../utils/prismaClient');
                if (prisma.userSession) {
                    prisma.userSession.create({
                        data: {
                            userId: user.id,
                            token: token,
                            userAgent: req.headers['user-agent'] || null,
                            ipAddress: req.ip || req.connection?.remoteAddress || null,
                            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                        }
                    }).catch(err => logger.error(`Google OAuth session creation error: ${err.message}`));
                }
            } catch (sessErr) {
                logger.warn(`Session recording failed: ${sessErr.message}`);
            }

            // Set httpOnly cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production' && !req.hostname.includes('localhost') && !req.hostname.includes('127.0.0.1'),
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            });

            // Ensure returnPath starts with / and doesn't contain a domain or protocol to avoid open redirect vulnerabilities
            if (!returnPath.startsWith('/') || returnPath.startsWith('//')) {
                returnPath = '/';
            }
            const returnUrl = frontendUrl + returnPath;

            logger.info(`User logged in via Google OAuth: ${user.email} (role: ${user.role})`);
            return res.redirect(returnUrl);

        } catch (err) {
            logger.error(`Google OAuth token generation error: ${err.message}`);
            return res.redirect(`${frontendUrl}/login?error=token_generation_failed`);
        }
    }
);

// Apple Sign In
router.post('/apple', rateLimiters.login, authController.appleLogin);

// SECURITY: This endpoint previously issued a login token for any email without
// verifying a code or password (account takeover). There is no server-side TOTP/OTP
// secret store for login 2FA yet, so it must not issue sessions. Passkey (WebAuthn)
// login is the supported second-factor flow. Re-enable only with real code verification.
router.post('/verify-2fa', rateLimiters.login, (req, res) => {
    res.status(501).json({
        success: false,
        message: 'Two-factor code login is not enabled. Please sign in with your password or a passkey.'
    });
});

module.exports = router;
