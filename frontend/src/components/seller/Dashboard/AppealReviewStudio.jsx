import React, { useState } from 'react';
import { 
  Star, CheckCircle2, ArrowLeft, Sparkles, 
  ShieldAlert, FileText, AlertCircle, MessageSquare
} from 'lucide-react';
import { apiClient as axios } from '@/utils/apiClient';
import toast from 'react-hot-toast';
import { useSellerStore } from '../../../store/sellerStore';

const QUICK_REVIEW_REASONS = [
  'Defamatory or abusive language used in review',
  'Review contains false claims contradicted by courier delivery confirmation',
  'Review is regarding courier delivery issue, not product quality',
  'Competitor sabotage / malicious fake order review',
  'Customer ordered wrong variant despite accurate product specifications'
];

const AppealReviewStudio = ({ onSuccess }) => {
  const { reviews } = useSellerStore();
  const [step, setStep] = useState('details'); // 'details' | 'processing' | 'success'
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewId, setReviewId] = useState('');
  const [reason, setReason] = useState('');

  const handleSelectQuickReason = (selected) => {
    setReason((prev) => {
      if (!prev.trim()) return selected;
      return `${prev}\n- ${selected}`;
    });
  };

  const startProcess = async () => {
    if (!reviewId.trim()) {
      toast.error('Please enter or select a Review ID');
      return;
    }
    if (!reason.trim()) {
      toast.error('Please state your reason for appealing this review');
      return;
    }

    setStep('processing');
    setIsSubmitting(true);
    setProgress(15);
    setProgressText('Locating review records...');
    
    setTimeout(() => { setProgress(50); setProgressText('Verifying customer interaction history...'); }, 600);
    setTimeout(() => { setProgress(80); setProgressText('Submitting appeal to moderation team...'); }, 1200);

    try {
      await axios.post(`/api/v1/reviews/${reviewId.trim()}/appeal`, { reason: reason.trim() }, { withCredentials: true });
      setTimeout(() => {
        setIsSubmitting(false);
        setProgress(100);
        setStep('success');
        toast.success('Review appeal submitted');
      }, 1800);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit appeal');
      setIsSubmitting(false);
      setStep('details');
    }
  };

  // Filter low ratings (1-3 stars) for easy selection
  const lowRatingReviews = (reviews || []).filter(r => (r.rating || 5) <= 3);

  return (
    <div className="flex-1 flex flex-col relative w-full h-full max-w-4xl mx-auto py-2">
      
      {/* 1. DETAILS STEP */}
      {step === 'details' && (
        <div className="animate-in fade-in slide-in-from-right duration-300 flex-1 flex flex-col w-full mx-auto max-w-2xl space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
            <Star size={28} className="shrink-0" />
            <div>
              <p className="text-sm font-bold">Unfair Review Protection</p>
              <p className="text-xs text-[var(--text-muted)]">
                If a customer left an abusive, fraudulent, or mistaken review, submit an appeal for our team to moderate or remove it.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                Target Review
              </label>
              {lowRatingReviews.length > 0 ? (
                <select
                  value={reviewId}
                  onChange={e => setReviewId(e.target.value)}
                  className="w-full p-3.5 rounded-xl neu-input text-[var(--text-main)] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[#008cff] text-sm"
                >
                  <option value="">Select a low-rated review to appeal...</option>
                  {lowRatingReviews.map(r => (
                    <option key={r.id} value={r.id}>
                      ★{r.rating} — "{r.comment?.slice(0, 50) || 'No comment'}" ({r.user?.fullName || 'Anonymous'})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={reviewId}
                  onChange={e => setReviewId(e.target.value)}
                  className="w-full p-3.5 rounded-xl neu-input text-[var(--text-main)] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#008cff] text-sm"
                  placeholder="Enter Review ID (e.g. REV-12345)"
                />
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
                  Grounds for Appeal <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-[var(--text-muted)]">Presets below</span>
              </div>

              {/* Quick presets */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {QUICK_REVIEW_REASONS.map((preset, idx) => (
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
                placeholder="Explain why this review violates platform fairness guidelines or misrepresents fulfillment..."
              />
            </div>

            <button
              type="button"
              onClick={startProcess}
              disabled={isSubmitting || !reviewId.trim() || !reason.trim()}
              className="w-full bg-[#008cff] hover:bg-[#0070cc] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Submit Review Appeal</span>
              <Sparkles size={16} />
            </button>
          </div>
        </div>
      )}

      {/* 2. PROCESSING STEP */}
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

      {/* 3. SUCCESS STEP */}
      {step === 'success' && (
        <div className="flex flex-col items-center justify-center flex-1 py-12 text-center animate-in slide-in-from-bottom duration-300 max-w-md mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 text-emerald-500">
            <CheckCircle2 size={44} />
          </div>
          <h2 className="text-2xl font-extrabold text-[var(--text-main)] mb-2">Review Under Investigation</h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mb-8">
            Your review appeal has been submitted to the moderation desk. If found to violate policy or factually inaccurate, it will be suppressed from your score.
          </p>
          <button 
            type="button"
            onClick={() => {
              if (onSuccess) onSuccess();
            }} 
            className="w-full bg-[#008cff] hover:bg-[#0070cc] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 cursor-pointer text-sm"
          >
            Return to Feedback & Reviews
          </button>
        </div>
      )}

    </div>
  );
};

export default AppealReviewStudio;
