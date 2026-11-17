import React, { useState } from 'react';
import { 
  AlertCircle, CheckCircle, ArrowLeft, Sparkles, 
  UploadCloud, FileText, Truck, ShieldAlert, CheckCircle2,
  Package, Clock, X
} from 'lucide-react';
import { apiClient as axios } from '@/utils/apiClient';
import toast from 'react-hot-toast';
import { useSellerStore } from '../../../store/sellerStore';

const QUICK_REASONS = [
  'Courier delayed pickup or transit beyond seller control',
  'Buyer received package according to carrier delivery proof',
  'Buyer requested cancellation after fulfillment commenced',
  'System miscalculated late delivery or dispute metric',
  'Other operational or compliance dispute'
];

const AppealDisputeStudio = ({ onSuccess }) => {
  const { disputes, fetchBanningStatus, fetchDisputes } = useSellerStore();
  const [step, setStep] = useState('details'); // 'details' | 'evidence' | 'processing' | 'success'
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [disputeId, setDisputeId] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [evidenceFiles, setEvidenceFiles] = useState([]);

  const handleSelectQuickReason = (selected) => {
    setReason((prev) => {
      if (!prev.trim()) return selected;
      return `${prev}\n- ${selected}`;
    });
  };

  const handleRemoveFile = (indexToRemove) => {
    setEvidenceFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const startProcess = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for your appeal');
      return;
    }

    setStep('processing');
    setIsSubmitting(true);
    setProgress(15);
    setProgressText('Packaging appeal documents...');
    
    setTimeout(() => { setProgress(45); setProgressText('Verifying dispute records & metrics...'); }, 600);
    setTimeout(() => { setProgress(80); setProgressText('Submitting appeal to dispute mediation...'); }, 1200);

    try {
      await axios.post('/api/v1/disputes/appeal', {
        disputeId: disputeId.trim() || undefined,
        reason: reason.trim(),
        notes: notes.trim() || undefined,
        evidenceUrls: evidenceFiles.map(f => f.name)
      }, { withCredentials: true });

      setTimeout(() => {
        setIsSubmitting(false);
        setProgress(100);
        setStep('success');
        toast.success('Appeal submitted successfully');
        fetchBanningStatus?.();
        fetchDisputes?.();
      }, 1800);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit appeal');
      setIsSubmitting(false);
      setStep('evidence');
    }
  };

  return (
    <div className="flex-1 flex flex-col relative w-full h-full max-w-4xl mx-auto py-2">
      
      {/* STEPPER HEADER */}
      {step !== 'processing' && step !== 'success' && (
        <div className="flex justify-center items-center mb-8 pb-6 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 text-xs sm:text-sm font-bold ${step === 'details' ? 'text-[#008cff]' : 'text-emerald-500'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${step === 'details' ? 'bg-[#008cff] shadow-md shadow-blue-500/30' : 'bg-emerald-500'}`}>
                1
              </div>
              <span>Dispute Details</span>
            </div>

            <div className={`w-12 sm:w-20 h-0.5 ${step === 'evidence' ? 'bg-[#008cff]' : 'bg-[var(--border-subtle)]'}`} />

            <div className={`flex items-center gap-2 text-xs sm:text-sm font-bold ${step === 'evidence' ? 'text-[#008cff]' : 'text-[var(--text-muted)]'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 'evidence' ? 'bg-[#008cff] text-white shadow-md shadow-blue-500/30' : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] border border-[var(--border-subtle)]'}`}>
                2
              </div>
              <span>Evidence & Notes</span>
            </div>
          </div>
        </div>
      )}

      {/* 1. DETAILS STEP */}
      {step === 'details' && (
        <div className="animate-in fade-in slide-in-from-right duration-300 flex-1 flex flex-col w-full mx-auto max-w-2xl space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
            <ShieldAlert size={28} className="shrink-0" />
            <div>
              <p className="text-sm font-bold">Dispute & Penalty Defense</p>
              <p className="text-xs text-[var(--text-muted)]">
                Provide clear facts regarding courier dispatch delays, buyer discrepancies, or extenuating fulfillment events.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                Target Dispute / Penalty
              </label>
              {disputes && disputes.length > 0 ? (
                <select
                  value={disputeId}
                  onChange={e => setDisputeId(e.target.value)}
                  className="w-full p-3.5 rounded-xl neu-input text-[var(--text-main)] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[#008cff] text-sm"
                >
                  <option value="">General Courier Delay / Store Penalty (Latest Disputed Order)</option>
                  {disputes.map(d => (
                    <option key={d.id} value={d.id}>
                      Order #{d.orderId?.slice(-8).toUpperCase() || 'GENERAL'} — {d.reason || d.description || d.status}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={disputeId}
                  onChange={e => setDisputeId(e.target.value)}
                  className="w-full p-3.5 rounded-xl neu-input text-[var(--text-main)] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#008cff] text-sm"
                  placeholder="Dispute ID (Optional — leave blank for latest dispute)"
                />
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
                  Reason for Appeal <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-[var(--text-muted)]">Quick presets below</span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {QUICK_REASONS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectQuickReason(preset)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] hover:bg-[#008cff]/10 hover:border-[#008cff]/40 text-[var(--text-muted)] hover:text-[#008cff] border border-[var(--border-subtle)] transition-colors text-left"
                  >
                    + {preset}
                  </button>
                ))}
              </div>

              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full p-4 rounded-xl neu-input text-[var(--text-main)] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#008cff] text-sm font-medium min-h-[140px] resize-y"
                placeholder="Explain why this penalty or dispute should be waived. Mention courier pickup tracking numbers, timestamps, and order details..."
              />
            </div>

            <button
              type="button"
              onClick={() => {
                if (!reason.trim()) {
                  toast.error('Please enter your reason for appeal');
                  return;
                }
                setStep('evidence');
              }}
              disabled={!reason.trim()}
              className="w-full bg-[#008cff] hover:bg-[#0070cc] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue to Evidence</span>
              <Sparkles size={16} />
            </button>
          </div>
        </div>
      )}

      {/* 2. EVIDENCE STEP */}
      {step === 'evidence' && (
        <div className="animate-in fade-in slide-in-from-right duration-300 flex-1 flex flex-col w-full mx-auto max-w-2xl space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={() => setStep('details')}
              className="p-2 hover:bg-[var(--bg-secondary)] rounded-xl transition-colors text-[var(--text-main)] flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Back to Details</span>
            </button>
            <span className="text-xs text-[var(--text-muted)]">Step 2 of 2</span>
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                Supporting Evidence & Proof
              </label>
              <label className="border-2 border-dashed border-[var(--border-subtle)] hover:border-[#008cff] rounded-2xl p-8 flex flex-col items-center justify-center bg-[var(--bg-secondary)] cursor-pointer transition-colors group">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      setEvidenceFiles(prev => [...prev, ...files]);
                    }
                  }}
                />
                <div className="w-12 h-12 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <UploadCloud size={24} className="text-[#008cff]" />
                </div>
                <span className="text-sm font-bold text-[var(--text-main)] mb-1">
                  Click to select proof documents or images
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  Carrier receipts, waybills, CCTV screenshots, chat logs (PNG, JPG, PDF)
                </span>
              </label>

              {evidenceFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-semibold text-[var(--text-muted)]">
                    Attached Files ({evidenceFiles.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {evidenceFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)]"
                      >
                        <FileText size={13} className="text-[#008cff]" />
                        <span className="max-w-[180px] truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          className="hover:text-rose-500 text-[var(--text-muted)] transition-colors p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                Additional Notes / Waybill Numbers (Optional)
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full p-3.5 rounded-xl neu-input text-[var(--text-main)] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#008cff] text-sm resize-y min-h-[90px]"
                placeholder="E.g. Carrier tracking number: GXL-883920. Courier picked up package 2 hours after SLA due to weather."
              />
            </div>
          </div>

          <button
            type="button"
            onClick={startProcess}
            disabled={isSubmitting}
            className="w-full bg-[#008cff] hover:bg-[#0070cc] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 flex justify-center items-center gap-2 text-base cursor-pointer disabled:opacity-50"
          >
            <ShieldAlert size={18} />
            <span>Submit Official Appeal</span>
          </button>
        </div>
      )}

      {/* 3. PROCESSING STEP */}
      {step === 'processing' && (
        <div className="flex flex-col items-center justify-center flex-1 py-16 animate-in fade-in zoom-in duration-300">
          <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-[var(--border-subtle)] rounded-full" />
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="46"
                fill="none"
                stroke="#008cff"
                strokeWidth="5"
                strokeDasharray={`${progress * 2.89}, 300`}
                strokeLinecap="round"
                className="transform -rotate-90 origin-center transition-all duration-300 ease-out"
              />
            </svg>
            <div className="flex flex-col items-center justify-center text-[var(--text-main)]">
              <span className="text-3xl font-black">{progress}%</span>
            </div>
          </div>
          <h3 className="text-xl font-extrabold text-[var(--text-main)] mb-1">
            Submitting Appeal...
          </h3>
          <p className="text-sm text-[var(--text-muted)]">{progressText}</p>
        </div>
      )}

      {/* 4. SUCCESS STEP */}
      {step === 'success' && (
        <div className="flex flex-col items-center justify-center flex-1 py-12 text-center animate-in slide-in-from-bottom duration-300 max-w-md mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 text-emerald-500">
            <CheckCircle2 size={44} />
          </div>
          <h2 className="text-2xl font-extrabold text-[var(--text-main)] mb-2">Appeal Submitted!</h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mb-8">
            Your dispute / penalty appeal has been registered into the mediation queue. Our compliance team will review your courier notes and submitted proof.
          </p>
          <button 
            type="button"
            onClick={() => {
              if (onSuccess) onSuccess();
            }} 
            className="w-full bg-[#008cff] hover:bg-[#0070cc] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 cursor-pointer text-sm"
          >
            Return to Disputes Resolution Center
          </button>
        </div>
      )}

    </div>
  );
};

export default AppealDisputeStudio;
