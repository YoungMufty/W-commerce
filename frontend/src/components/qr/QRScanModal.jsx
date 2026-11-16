import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import {
  X, Camera, Image as ImageIcon, Sparkles, RefreshCw, Zap,
  CheckCircle2, ArrowRight, ExternalLink, ShoppingBag, Store,
  Package, Receipt, Wallet, AlertCircle, Copy, Check
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useQRStore } from '../../store/qrStore';
import { QR_TYPES, parseQRData } from '../../utils/qrPayloadHelper';

const REGION_ID = "wcom-html5-qr-reader";

export default function QRScanModal({ isFullPage = false }) {
  const { isScannerOpen, closeScanner, customScanCallback } = useQRStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'upload' | 'manual'
  const [cameraError, setCameraError] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
  const [torchOn, setTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);
  const [manualInput, setManualInput] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [copiedRaw, setCopiedRaw] = useState(false);

  const html5QrCodeRef = useRef(null);
  const fileInputRef = useRef(null);

  // Stop camera helper
  const stopCamera = useCallback(async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.debug('Error stopping html5QrCode:', err);
      } finally {
        setIsCameraActive(false);
      }
    }
  }, []);

  // Handle successful scan
  const handleDecodedText = useCallback((decodedText) => {
    if (import.meta.env.DEV) console.log('[QRScanModal] Scanned:', decodedText);
    const parsed = parseQRData(decodedText);
    setScannedResult(parsed);

    // Play subtle audio chime or vibration if supported
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([40, 30, 40]);
    }

    // If a custom callback is registered, let it know
    if (customScanCallback) {
      customScanCallback(parsed, decodedText);
    }
  }, [customScanCallback]);

  // Start camera helper
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(REGION_ID);
      }

      const qrCode = html5QrCodeRef.current;
      if (qrCode.isScanning) {
        await qrCode.stop();
      }

      const config = {
        fps: 12,
        qrbox: (viewfinderWidth, viewfinderHeight) => {
          const edge = Math.min(viewfinderWidth, viewfinderHeight) * 0.72;
          return { width: Math.floor(edge), height: Math.floor(edge) };
        },
        aspectRatio: 1.0
      };

      await qrCode.start(
        { facingMode },
        config,
        (decodedText) => {
          handleDecodedText(decodedText);
        },
        (_errorMessage) => {
          // Frame scanner tick without match - ignore
        }
      );

      setIsCameraActive(true);

      // Check torch capability
      try {
        const capabilities = qrCode.getRunningTrackCapabilities();
        if (capabilities && capabilities.torch) {
          setHasTorch(true);
        } else {
          setHasTorch(false);
        }
      } catch (_) {
        setHasTorch(false);
      }
    } catch (err) {
      console.warn('Camera start error:', err);
      setIsCameraActive(false);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission was denied. Please allow camera access in your browser settings or upload a QR image below.'
          : 'Unable to start camera. Please check your camera permissions or upload an image.'
      );
    }
  }, [facingMode, handleDecodedText]);

  // Toggle Torch
  const toggleTorch = async () => {
    if (!html5QrCodeRef.current || !hasTorch) return;
    try {
      const nextTorch = !torchOn;
      await html5QrCodeRef.current.applyVideoConstraints({
        advanced: [{ torch: nextTorch }]
      });
      setTorchOn(nextTorch);
    } catch (err) {
      console.warn('Torch toggle failed:', err);
    }
  };

  // Switch Camera
  const toggleCameraFacing = async () => {
    await stopCamera();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Scan from uploaded file
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    setCameraError(null);

    try {
      let qrEngine = html5QrCodeRef.current;
      if (!qrEngine) {
        qrEngine = new Html5Qrcode(REGION_ID);
        html5QrCodeRef.current = qrEngine;
      }

      if (qrEngine.isScanning) {
        await qrEngine.stop();
        setIsCameraActive(false);
      }

      const decodedText = await qrEngine.scanFile(file, true);
      handleDecodedText(decodedText);
      toast.success('QR Code recognized from image!');
    } catch (err) {
      console.warn('File QR scan failed:', err);
      toast.error('Could not detect a valid QR code in this image. Try another photo or adjust zoom.');
    } finally {
      setIsProcessingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Manual input submit
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    handleDecodedText(manualInput.trim());
  };

  // Action button click on result
  const handleAction = () => {
    if (!scannedResult) return;

    if (customScanCallback) {
      closeScanner();
      return;
    }

    const { type, id, slug, targetUrl } = scannedResult;

    if (type === QR_TYPES.STORE) {
      // Per user requirement: open storefront portfolio in a new tab!
      window.open(targetUrl || `/store/${slug || id}`, '_blank');
      closeScanner();
      return;
    }

    if (targetUrl) {
      if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
        const currentOrigin = window.location.origin;
        if (targetUrl.startsWith(currentOrigin)) {
          const relativePath = targetUrl.replace(currentOrigin, '');
          navigate(relativePath);
        } else {
          window.open(targetUrl, '_blank');
        }
      } else {
        navigate(targetUrl);
      }
    } else {
      switch (type) {
        case QR_TYPES.PRODUCT:
          navigate(`/product/${id}`);
          break;
        case QR_TYPES.ORDER:
          navigate(`/orders/${id}`);
          break;
        case QR_TYPES.RECEIPT:
          navigate(`/orders/${id}?view=receipt`);
          break;
        case QR_TYPES.TRANSACTION:
          navigate(`/wallet/transactions?ref=${encodeURIComponent(id || '')}`);
          break;
        default:
          navigate('/');
      }
    }

    closeScanner();
  };

  // Lifecycle when modal opens/closes or tab changes
  useEffect(() => {
    if ((isScannerOpen || isFullPage) && activeTab === 'camera' && !scannedResult) {
      // Small timeout to allow DOM element #wcom-html5-qr-reader to mount
      const timer = setTimeout(() => {
        startCamera();
      }, 150);
      return () => clearTimeout(timer);
    } else {
      stopCamera();
    }
  }, [isScannerOpen, isFullPage, activeTab, facingMode, scannedResult, startCamera, stopCamera]);

  // Teardown when unmounted
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  if (!isScannerOpen && !isFullPage) return null;

  const getEntityIcon = (type) => {
    switch (type) {
      case QR_TYPES.PRODUCT: return ShoppingBag;
      case QR_TYPES.STORE: return Store;
      case QR_TYPES.ORDER: return Package;
      case QR_TYPES.RECEIPT: return Receipt;
      case QR_TYPES.TRANSACTION: return Wallet;
      default: return ExternalLink;
    }
  };

  const ResultIcon = scannedResult ? getEntityIcon(scannedResult.type) : Sparkles;

  const scannerContent = (
    <div className="relative w-full max-w-lg bg-slate-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 text-white flex flex-col">
      {/* Header Bar */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Camera size={18} />
          </div>
          <div>
            <h3 className="text-base font-black tracking-tight text-white">W-Commerce QR Scanner</h3>
            <p className="text-[10px] text-slate-400">Scan Product, Store, Order, Receipt or Transaction</p>
          </div>
        </div>

        {!isFullPage && (
          <button
            onClick={closeScanner}
            aria-label="Close Scanner"
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 bg-slate-900/40 p-1 text-xs font-bold">
        <button
          onClick={() => { setActiveTab('camera'); setScannedResult(null); }}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'camera' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Camera size={14} />
          <span>Live Camera</span>
        </button>

        <button
          onClick={() => { setActiveTab('upload'); setScannedResult(null); }}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'upload' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ImageIcon size={14} />
          <span>Upload Image</span>
        </button>

        <button
          onClick={() => { setActiveTab('manual'); setScannedResult(null); }}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'manual' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Enter Code / Link</span>
        </button>
      </div>

      {/* Main Viewport Body */}
      <div className="relative min-h-[360px] bg-black flex flex-col items-center justify-center overflow-hidden">
        {/* Scanned Result Card Overlay */}
        <AnimatePresence>
          {scannedResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-xl p-6 flex flex-col items-center justify-between text-center overflow-y-auto"
            >
              <div className="w-full flex justify-end">
                <button
                  onClick={() => setScannedResult(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <RefreshCw size={13} />
                  <span>Scan Another</span>
                </button>
              </div>

              <div className="flex flex-col items-center my-auto max-w-sm">
                {/* Result Type Badge */}
                <div className="w-16 h-16 rounded-3xl bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                  <ResultIcon size={32} />
                </div>

                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500/15 text-blue-400 border border-blue-500/30 mb-2">
                  {scannedResult.badgeText}
                </span>

                <h4 className="text-xl font-black text-white tracking-tight line-clamp-2">
                  {scannedResult.title}
                </h4>

                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {scannedResult.subtitle}
                </p>

                {/* Amount details if present */}
                {scannedResult.amount && (
                  <div className="mt-3 text-lg font-black text-emerald-400">
                    {scannedResult.currency === 'USD' ? '$' : '₦'}
                    {Number(scannedResult.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                )}

                {/* Raw Scanned Link Preview */}
                <div className="mt-4 p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-400 font-mono flex items-center justify-between gap-2 w-full max-w-xs overflow-hidden">
                  <span className="truncate">{scannedResult.targetUrl || scannedResult.rawText}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(scannedResult.targetUrl || scannedResult.rawText);
                      setCopiedRaw(true);
                      toast.success('Link copied!');
                      setTimeout(() => setCopiedRaw(false), 2000);
                    }}
                    className="shrink-0 p-1 rounded hover:bg-white/10 text-slate-300"
                    title="Copy Link"
                  >
                    {copiedRaw ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="w-full flex flex-col gap-2 mt-4">
                <button
                  onClick={handleAction}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-blue-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{scannedResult.primaryActionLabel}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. Camera View */}
        {activeTab === 'camera' && (
          <div className="relative w-full h-[380px] bg-black flex items-center justify-center overflow-hidden">
            {/* The HTML5 QR Code Mount Element */}
            <div
              id={REGION_ID}
              className="w-full h-full object-cover [&_video]:w-full [&_video]:h-full [&_video]:object-cover"
            />

            {/* Custom Neon Targeting Reticle & Scan Laser Animation */}
            {isCameraActive && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* 240px Reticle Box */}
                <div className="w-64 h-64 relative rounded-3xl border-2 border-white/20 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]">
                  {/* Glowing Corner Brackets */}
                  <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-2xl shadow-[0_0_15px_#3b82f6]" />
                  <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-2xl shadow-[0_0_15px_#3b82f6]" />
                  <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-2xl shadow-[0_0_15px_#3b82f6]" />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-2xl shadow-[0_0_15px_#3b82f6]" />

                  {/* Animated Laser Scan Bar */}
                  <div className="absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_20px_#60a5fa] animate-[bounce_2s_infinite]" />
                </div>
              </div>
            )}

            {/* Camera Controls Bar (Facing Switch & Torch) */}
            {isCameraActive && (
              <div className="absolute bottom-4 inset-x-4 flex items-center justify-between pointer-events-auto z-20">
                <button
                  onClick={toggleCameraFacing}
                  className="px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white/90 text-xs font-bold backdrop-blur-md border border-white/20 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                  title="Switch camera"
                >
                  <RefreshCw size={14} />
                  <span>Switch Cam</span>
                </button>

                {hasTorch && (
                  <button
                    onClick={toggleTorch}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                      torchOn
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.6)]'
                        : 'bg-black/60 hover:bg-black/90 text-white/90 border-white/20'
                    }`}
                    title="Toggle flashlight"
                  >
                    <Zap size={14} className={torchOn ? 'fill-current' : ''} />
                    <span>{torchOn ? 'Flash On' : 'Flash'}</span>
                  </button>
                )}
              </div>
            )}

            {/* Camera Error Prompt */}
            {cameraError && (
              <div className="absolute inset-0 bg-slate-950 p-6 flex flex-col items-center justify-center text-center z-30">
                <AlertCircle size={40} className="text-amber-400 mb-3" />
                <h4 className="text-base font-bold text-white mb-2">Camera Access Required</h4>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-5">
                  {cameraError}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all cursor-pointer"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all cursor-pointer"
                  >
                    Upload QR Photo
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Upload Photo View */}
        {activeTab === 'upload' && (
          <div className="p-8 flex flex-col items-center justify-center text-center w-full">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-sm border-2 border-dashed border-white/20 hover:border-blue-500 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-blue-500/5 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 group-hover:bg-blue-500/20 text-slate-400 group-hover:text-blue-400 flex items-center justify-center mb-4 transition-all">
                <ImageIcon size={32} />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                {isProcessingFile ? 'Scanning Image...' : 'Select QR Code Image'}
              </h4>
              <p className="text-xs text-slate-400 max-w-xs">
                Upload a screenshot, saved photo, or receipt with a QR code to decode instantly.
              </p>
            </div>
          </div>
        )}

        {/* 3. Manual Entry View */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualSubmit} className="p-8 flex flex-col items-center justify-center w-full max-w-sm">
            <h4 className="text-sm font-bold text-white mb-1">Enter Code or Link</h4>
            <p className="text-xs text-slate-400 text-center mb-4">
              Paste an order ID, transaction reference, product URL, or store slug.
            </p>

            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="e.g. ORD-12345 or /store/gymshark"
              className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors mb-4"
            />

            <button
              type="submit"
              disabled={!manualInput.trim()}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Resolve Code</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>

      {/* Footer Instructions */}
      <div className="px-5 py-3 border-t border-white/10 bg-slate-900/40 flex items-center justify-between text-[11px] text-slate-400">
        <span>Supports Products, Stores, Orders, Receipts & Proofs</span>
        <span className="font-bold text-emerald-400">Instant Escrow Verified</span>
      </div>
    </div>
  );

  if (isFullPage) {
    return (
      <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        {scannerContent}
      </div>
    );
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeScanner}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-lg"
        >
          {scannerContent}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
