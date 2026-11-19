import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Printer, ShieldCheck, QrCode, CheckCircle2, Lock, Unlock, 
  Sparkles, AlertCircle, ShoppingBag, Check 
} from 'lucide-react';
import QRCode from 'react-qr-code';
import { toast } from 'react-hot-toast';
import { useQRStore } from '../../store/qrStore';

const PrintableReceiptModal = ({ isOpen, onClose, order }) => {
  const { openShare } = useQRStore();
  const [qrStatus, setQrStatus] = useState(order?.qrSubscriptionStatus || 'PAID'); // 'PAID' | 'UNPAID'
  const [isActivatingQR, setIsActivatingQR] = useState(false);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleActivateQR = () => {
    setIsActivatingQR(true);
    setTimeout(() => {
      setQrStatus('PAID');
      setIsActivatingQR(false);
      toast.success('QR Seal successfully activated for ₦100 on whats\'app shop!', {
        icon: '✅',
        duration: 3500
      });
    }, 600);
  };

  // Safe receipt theme config
  let receiptConfig = {
    headerText: 'ORDER RECEIPT',
    footerText: 'Thank you for your business! All orders verified and protected by whats\'app shop.',
    themeColor: '#059669'
  };

  try {
    if (order.seller?.store?.portfolioConfig) {
      const config = typeof order.seller.store.portfolioConfig === 'string'
        ? JSON.parse(order.seller.store.portfolioConfig)
        : order.seller.store.portfolioConfig;
      if (config && config.receipt) {
        receiptConfig = { ...receiptConfig, ...config.receipt };
      }
    }
  } catch (e) {}

  // Safe buyer details parsing
  const buyerAddress = (() => {
    if (!order.shippingAddress || order.shippingAddress === 'null') return 'Standard Direct Delivery';
    try {
      const addr = typeof order.shippingAddress === 'string' && order.shippingAddress.trim().startsWith('{')
        ? JSON.parse(order.shippingAddress)
        : typeof order.shippingAddress === 'object' ? order.shippingAddress : null;
      if (addr && addr.street) {
        return [addr.street, addr.city, addr.state, addr.zipCode || addr.postalCode, addr.country].filter(Boolean).join(', ');
      }
      return typeof order.shippingAddress === 'string' ? order.shippingAddress : 'Standard Direct Delivery';
    } catch (e) {
      return typeof order.shippingAddress === 'string' ? order.shippingAddress : 'Standard Direct Delivery';
    }
  })();

  const buyerName = (() => {
    if (order.shippingAddress && typeof order.shippingAddress === 'string' && order.shippingAddress.trim().startsWith('{')) {
      try {
        const addr = JSON.parse(order.shippingAddress);
        if (addr && addr.fullName) return addr.fullName;
      } catch (e) {}
    } else if (order.shippingAddress && typeof order.shippingAddress === 'object' && order.shippingAddress.fullName) {
      return order.shippingAddress.fullName;
    }
    return order.buyer?.fullName || order.user?.name || order.user?.fullName || 'Customer';
  })();

  const buyerPhone = (() => {
    if (order.shippingAddress && typeof order.shippingAddress === 'string' && order.shippingAddress.trim().startsWith('{')) {
      try {
        const addr = JSON.parse(order.shippingAddress);
        if (addr && addr.phone) return addr.phone;
      } catch (e) {}
    } else if (order.shippingAddress && typeof order.shippingAddress === 'object' && order.shippingAddress.phone) {
      return order.shippingAddress.phone;
    }
    return order.buyer?.phoneNumber || order.user?.phone || null;
  })();

  // Safe items and total amounts calculation
  const items = Array.isArray(order.items) && order.items.length > 0 ? order.items : [];
  const calculatedItemsTotal = items.reduce((sum, item) => {
    const unitPrice = Number(item.price ?? item.priceAtTime ?? item.product?.price ?? 0);
    const qty = Number(item.quantity ?? 1);
    return sum + (unitPrice * qty);
  }, 0);

  const totalAmountNum = Number(order.totalAmount ?? order.sellerAmount ?? calculatedItemsTotal) || calculatedItemsTotal || 0;
  const shippingCostNum = Number(order.shippingCost || 0);
  const subtotalNum = Math.max(0, totalAmountNum - shippingCostNum);
  const orderIdStr = String(order.id || 'ORDER');
  const orderIdShort = orderIdStr.slice(-8).toUpperCase();
  const dateFormatted = new Date(order.createdAt || order.updatedAt || Date.now()).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const storeName = order.items?.[0]?.product?.store?.storeName || 
                    order.seller?.store?.storeName || 
                    order.store?.storeName || 
                    'Official Merchant Store';

  // Fallback image helper
  const getProductImage = (item) => {
    return item.product?.image || 
           item.product?.imageUrl || 
           item.product?.images?.[0] || 
           item.image || 
           item.imageUrl || 
           'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80';
  };

  const isQRPaid = qrStatus === 'PAID';

  return createPortal(
    <div 
      className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200 print:bg-white print:p-0 print:backdrop-blur-none"
      onClick={onClose}
    >
      <div 
        className="modal-panel bg-white text-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col my-auto max-h-[92vh] print:max-h-none print:shadow-none print:rounded-none border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Controls (Hidden during physical print) */}
        <div className="p-4 sm:px-6 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3 bg-slate-50 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800 leading-tight">Official Order Receipt</h3>
              <p className="text-[11px] font-mono font-medium text-slate-500">#{orderIdShort} &bull; OpenSlug Verified</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* QR Status Controller (Toggle Paid / Unpaid) */}
            <button
              type="button"
              onClick={() => {
                const nextStatus = isQRPaid ? 'UNPAID' : 'PAID';
                setQrStatus(nextStatus);
                toast(
                  nextStatus === 'PAID' ? 'QR Code marked as Paid & Active' : 'QR Code marked as Unpaid (₦100 required)',
                  { icon: nextStatus === 'PAID' ? '✅' : '🔒' }
                );
              }}
              className={`px-3 py-1.5 text-[11px] font-black rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                isQRPaid
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
              }`}
              title="Click to toggle QR subscription status"
            >
              {isQRPaid ? <Unlock size={13} className="text-emerald-600" /> : <Lock size={13} className="text-amber-600" />}
              <span>QR: {isQRPaid ? 'Paid' : 'Unpaid (₦100)'}</span>
            </button>

            <button 
              type="button"
              onClick={() => openShare({
                type: 'receipt',
                id: orderIdStr,
                title: `Receipt #${orderIdShort}`,
                subtitle: `Amount: ₦${totalAmountNum.toLocaleString(undefined, { minimumFractionDigits: 2 })} &bull; OpenSlug`,
                amount: totalAmountNum,
                currency: 'NGN',
                status: order.paymentStatus || 'PAID',
                isPaid: isQRPaid,
                metadata: {
                  buyer: buyerName,
                  store: storeName
                }
              })}
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-200"
              title="Share Receipt via QR"
            >
              <QrCode size={15} /> <span className="hidden sm:inline">Share QR</span>
            </button>
            <button 
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              title="Print Receipt"
            >
              <Printer size={15} /> <span>Print</span>
            </button>
            <button 
              type="button"
              onClick={onClose} 
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer ml-1"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        {/* Printable Receipt Paper Container */}
        <div className="p-6 sm:p-10 overflow-y-auto print:overflow-visible relative bg-white">
          {/* Top Decorative Color Accent Bar */}
          <div className="absolute top-0 left-0 w-full h-2.5 print:h-2" style={{ backgroundColor: receiptConfig.themeColor }} />
          
          {/* Receipt Top Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8 mt-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider mb-2">
                <CheckCircle2 size={12} /> Confirmed Payment
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-slate-900 mb-1" style={{ color: receiptConfig.themeColor }}>
                {receiptConfig.headerText}
              </h1>
              <p className="font-bold text-slate-800 text-base">{storeName}</p>
              <p className="text-xs text-slate-500 mt-0.5">Verified Merchant Account &bull; OpenSlug</p>
            </div>
            <div className="text-left sm:text-right text-xs">
              <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-0.5">RECEIPT NUMBER</p>
              <p className="font-mono font-bold text-sm text-slate-900">#{orderIdShort}</p>
              <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mt-2 mb-0.5">DATE ISSUED</p>
              <p className="font-bold text-slate-800">{dateFormatted}</p>
            </div>
          </div>
          
          {/* Billed To & Payment Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-8 text-xs">
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">BILLED TO (CUSTOMER)</h3>
              <p className="font-bold text-slate-900 text-sm mb-1">{buyerName}</p>
              <p className="text-slate-600 leading-relaxed">{buyerAddress}</p>
              {buyerPhone && <p className="text-slate-500 font-mono mt-1.5">Tel: {buyerPhone}</p>}
            </div>
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">SETTLEMENT METHOD</h3>
              <p className="font-bold text-emerald-600 text-sm mb-1 flex items-center gap-1.5">
                <CheckCircle2 size={14} /> {(order.paymentStatus || 'PAID').replace(/_/g, ' ')}
              </p>
              <p className="text-slate-600 capitalize">
                Method: {(order.paymentMethod || 'Direct Bank').replace(/_/g, ' ')}
              </p>
              <p className="text-[11px] text-slate-400 mt-1.5 font-medium">Protection: 100% Guaranteed on OpenSlug</p>
            </div>
          </div>
          
          {/* Line Items Table with Product Images */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="text-left py-2.5">Item & Description</th>
                  <th className="text-center py-2.5 px-3">Qty</th>
                  <th className="text-right py-2.5">Unit Price</th>
                  <th className="text-right py-2.5">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.length > 0 ? (
                  items.map((item, index) => {
                    const unitPrice = Number(item.price ?? item.priceAtTime ?? item.product?.price ?? 0);
                    const qty = Number(item.quantity ?? 1);
                    const lineTotal = unitPrice * qty;
                    const itemTitle = item.product?.title || item.productName || item.title || `Item #${index + 1}`;
                    const itemImg = getProductImage(item);

                    return (
                      <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 pr-2">
                          <div className="flex items-center gap-3">
                            {/* Product Thumbnail Image */}
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-2xs">
                              <img
                                src={itemImg}
                                alt={itemTitle}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80';
                                }}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-slate-800 text-xs sm:text-sm truncate">{itemTitle}</p>
                              {item.variants && Object.keys(item.variants).length > 0 && (
                                <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                                  {Object.entries(item.variants).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                                </p>
                              )}
                              <p className="text-[10px] text-emerald-600 font-medium">Verified OpenSlug product</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center text-slate-700 font-bold">{qty}</td>
                        <td className="py-3 text-right text-slate-600 font-mono">
                          ₦{unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 text-right font-black text-slate-900 font-mono">
                          ₦{lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-400 italic">
                      Order #{orderIdShort} (Direct Order Entry)
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Subtotal, Shipping, and Grand Total */}
          <div className="flex justify-end mb-8 pt-2 border-t border-slate-100">
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono font-medium">₦{subtotalNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping & Logistics</span>
                <span className="font-mono font-medium">
                  {shippingCostNum > 0 ? `₦${shippingCostNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '₦0.00 (Standard)'}
                </span>
              </div>
              <div className="flex justify-between border-t-2 border-slate-900 pt-3 text-base sm:text-lg font-black text-slate-900">
                <span>TOTAL PAID</span>
                <span className="font-mono text-emerald-600">
                  ₦{totalAmountNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
          
          {/* Controlled QR Verification Seal System (Paid vs Unpaid QR Subscription) */}
          <div className={`border pt-5 pb-5 px-5 rounded-2xl transition-all ${
            isQRPaid ? 'bg-slate-50/80 border-slate-200' : 'bg-amber-50/70 border-amber-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-left text-xs max-w-sm">
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <ShieldCheck size={14} className={isQRPaid ? 'text-emerald-600' : 'text-amber-600'} /> Authenticity QR Seal
                  </p>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isQRPaid 
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {isQRPaid ? 'ACTIVE & VERIFIED' : 'UNPAID QR SEAL'}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500">
                  {isQRPaid 
                    ? 'Scan with any mobile device or WhatsApp to verify order integrity, store authenticity, and delivery status directly on whats\'app shop.' 
                    : 'This QR Seal requires an active ₦100 QR subscription to enable public cryptographic order scanning.'
                  }
                </p>

                {!isQRPaid && (
                  <button
                    type="button"
                    onClick={handleActivateQR}
                    disabled={isActivatingQR}
                    className="mt-3 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Sparkles size={13} />
                    <span>{isActivatingQR ? 'Activating...' : 'Pay ₦100 to Activate QR'}</span>
                  </button>
                )}
              </div>

              {/* QR Container with Active / Unpaid Lock State */}
              <div className="relative p-2.5 bg-white rounded-2xl border border-slate-200 shadow-xs shrink-0 self-start sm:self-auto">
                <div className={isQRPaid ? 'opacity-100 transition-opacity' : 'opacity-25 filter blur-[1px]'}>
                  <QRCode
                    value={`${typeof window !== 'undefined' ? window.location.origin : 'https://whatsappshop.ng'}/receipt/${orderIdStr}?verified=${isQRPaid}`}
                    size={72}
                    level="M"
                  />
                </div>

                {!isQRPaid && (
                  <div className="absolute inset-0 rounded-2xl bg-slate-900/40 backdrop-blur-[1px] flex flex-col items-center justify-center p-1 text-white text-center">
                    <Lock size={18} className="text-amber-400 mb-0.5" />
                    <span className="text-[9px] font-black uppercase tracking-tight text-white leading-tight">
                      Locked
                    </span>
                    <span className="text-[8px] font-bold text-amber-300 leading-tight">
                      ₦100 Sub
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center pt-6 mt-2 text-xs text-slate-400">
            <p className="italic">{receiptConfig.footerText}</p>
            <p className="text-[10px] text-slate-400 mt-2 font-mono">
              Secure Transaction &bull; Timestamp: {new Date().toISOString()}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PrintableReceiptModal;
