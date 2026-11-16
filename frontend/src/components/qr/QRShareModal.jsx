import React, { useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import {
  X, Copy, Check, Share2, Download, Printer, ShieldCheck,
  ShoppingBag, Store, Package, Receipt, Wallet, Sparkles, ExternalLink
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useQRStore } from '../../store/qrStore';
import { QR_TYPES, generateQRPayload } from '../../utils/qrPayloadHelper';

const TYPE_CONFIG = {
  [QR_TYPES.PRODUCT]: {
    label: 'PRODUCT PASS',
    icon: ShoppingBag,
    color: 'from-blue-600 to-indigo-600',
    badgeBg: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    hint: 'Scan with any smartphone camera or W-Commerce scanner to view item details and buy.'
  },
  [QR_TYPES.STORE]: {
    label: 'STOREFRONT PASS',
    icon: Store,
    color: 'from-emerald-600 to-teal-600',
    badgeBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    hint: 'Scan to enter the verified merchant showcase and explore curated collections in a new tab.'
  },
  [QR_TYPES.ORDER]: {
    label: 'ORDER & ESCROW PASS',
    icon: Package,
    color: 'from-amber-500 to-orange-600',
    badgeBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    hint: 'Scan to track delivery milestones, courier handoff, and escrow protection status.'
  },
  [QR_TYPES.RECEIPT]: {
    label: 'OFFICIAL RECEIPT',
    icon: Receipt,
    color: 'from-teal-500 to-cyan-600',
    badgeBg: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
    hint: 'Cryptographically verifiable platform receipt proving 100% completed payment.'
  },
  [QR_TYPES.TRANSACTION]: {
    label: 'TRANSACTION PROOF',
    icon: Wallet,
    color: 'from-purple-600 to-pink-600',
    badgeBg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    hint: 'Scan to verify transaction reference, ledger authenticity, and settlement details.'
  }
};

export default function QRShareModal() {
  const { isShareOpen, sharePayload, closeShare } = useQRStore();
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef(null);

  const payload = useMemo(() => {
    if (!sharePayload) return null;
    return generateQRPayload(sharePayload);
  }, [sharePayload]);

  if (!isShareOpen || !sharePayload || !payload) return null;

  const type = sharePayload.type || QR_TYPES.PRODUCT;
  const config = TYPE_CONFIG[type] || TYPE_CONFIG[QR_TYPES.PRODUCT];
  const Icon = config.icon;

  const handleCopyLink = () => {
    const textToCopy = payload.url;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Clipboard access not supported');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: sharePayload.title || 'W-Commerce Share',
          text: sharePayload.subtitle || 'Scan or click to view on W-Commerce',
          url: payload.url
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadQR = async () => {
    try {
      setIsDownloading(true);
      const svgElement = document.getElementById('wcom-qr-code-svg');
      if (!svgElement) {
        toast.error('Unable to capture QR code');
        return;
      }

      // Convert SVG to high-res PNG via Canvas
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const URLObj = window.URL || window.webkitURL || window;
      const blobURL = URLObj.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = 3; // 3x resolution for super crisp export
        canvas.width = 400 * scale;
        canvas.height = 520 * scale;
        const ctx = canvas.getContext('2d');

        // Draw card background
        ctx.fillStyle = '#0f172a'; // slate-900
        ctx.roundRect ? ctx.roundRect(0, 0, canvas.width, canvas.height, 24 * scale) : ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fill();

        // Header bar
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${18 * scale}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('W-COMMERCE VERIFIED PASS', canvas.width / 2, 45 * scale);

        ctx.font = `${12 * scale}px sans-serif`;
        ctx.fillStyle = '#94a3b8';
        const titleText = (sharePayload.title || 'Official Share').slice(0, 32);
        ctx.fillText(titleText, canvas.width / 2, 70 * scale);

        // QR backing plate
        const qrSize = 260 * scale;
        const qrX = (canvas.width - qrSize) / 2;
        const qrY = 100 * scale;
        ctx.fillStyle = '#ffffff';
        ctx.roundRect ? ctx.roundRect(qrX - 16 * scale, qrY - 16 * scale, qrSize + 32 * scale, qrSize + 32 * scale, 20 * scale) : ctx.fillRect(qrX, qrY, qrSize, qrSize);
        ctx.fill();

        // Draw QR
        ctx.drawImage(image, qrX, qrY, qrSize, qrSize);

        // Subtitle / Amount
        ctx.fillStyle = '#f8fafc';
        ctx.font = `bold ${15 * scale}px sans-serif`;
        if (sharePayload.amount) {
          const formatted = `${sharePayload.currency || '₦'}${Number(sharePayload.amount).toLocaleString()}`;
          ctx.fillText(formatted, canvas.width / 2, 435 * scale);
        } else {
          ctx.fillText(config.label, canvas.width / 2, 435 * scale);
        }

        ctx.fillStyle = '#64748b';
        ctx.font = `${11 * scale}px sans-serif`;
        ctx.fillText('100% Escrow & Authenticity Guaranteed', canvas.width / 2, 475 * scale);

        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `wcommerce-${type}-${sharePayload.id || 'qr'}.png`;
        downloadLink.href = pngUrl;
        downloadLink.click();
        URLObj.revokeObjectURL(blobURL);
        toast.success('QR Code saved to photos / downloads!');
        setIsDownloading(false);
      };
      image.src = blobURL;
    } catch (err) {
      console.error('QR download error:', err);
      toast.error('Failed to download QR image');
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeShare}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 text-white flex flex-col"
          ref={cardRef}
        >
          {/* Top Header Glow Bar */}
          <div className={`h-2.5 w-full bg-gradient-to-r ${config.color}`} />

          {/* Close Button */}
          <button
            onClick={closeShare}
            aria-label="Close QR Modal"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all cursor-pointer z-20"
          >
            <X size={18} />
          </button>

          <div className="p-6 sm:p-7 flex flex-col items-center text-center">
            {/* Type Badge */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase border mb-3 ${config.badgeBg}`}>
              <Icon size={13} />
              <span>{config.label}</span>
            </div>

            {/* Title & Subtitle */}
            <h3 className="text-xl font-black text-white tracking-tight line-clamp-1 max-w-[90%]">
              {sharePayload.title || 'W-Commerce Item'}
            </h3>
            {sharePayload.subtitle && (
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-[85%]">
                {sharePayload.subtitle}
              </p>
            )}

            {/* Price / Amount Pill if present */}
            {sharePayload.amount && (
              <div className="mt-2 text-emerald-400 font-extrabold text-lg flex items-center gap-1">
                <span>{sharePayload.currency === 'USD' ? '$' : '₦'}</span>
                <span>{Number(sharePayload.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            )}

            {/* High-Contrast Crisp QR Canvas Container */}
            <div className="mt-5 mb-4 p-4 sm:p-5 bg-white rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex items-center justify-center relative group">
              <QRCode
                id="wcom-qr-code-svg"
                value={payload.url}
                size={210}
                level="Q"
                bgColor="#ffffff"
                fgColor="#090d16"
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              />

              {/* Brand Center Overlay Pill */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border-2 border-white shadow-xl flex items-center justify-center text-white font-black text-xs">
                  <span className="text-blue-400">W</span>
                </div>
              </div>
            </div>

            {/* Explanatory Prompt */}
            <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
              {config.hint}
            </p>

            {/* Trust Guarantee Note */}
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold mt-2">
              <ShieldCheck size={13} />
              <span>Platform Authenticated & Verified</span>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-3 gap-2 w-full mt-6 pt-5 border-t border-white/10">
              <button
                onClick={handleCopyLink}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition-all active:scale-95 cursor-pointer text-slate-200 hover:text-white"
              >
                {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                <span>{copied ? 'Copied' : 'Copy Link'}</span>
              </button>

              <button
                onClick={handleNativeShare}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition-all active:scale-95 cursor-pointer text-slate-200 hover:text-white"
              >
                <Share2 size={18} />
                <span>Share</span>
              </button>

              <button
                onClick={handleDownloadQR}
                disabled={isDownloading}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition-all active:scale-95 cursor-pointer text-slate-200 hover:text-white disabled:opacity-50"
              >
                <Download size={18} />
                <span>{isDownloading ? 'Saving...' : 'Save QR'}</span>
              </button>
            </div>

            {/* Open Target Directly Link */}
            <a
              href={payload.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              <span>Preview Link Directly</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
