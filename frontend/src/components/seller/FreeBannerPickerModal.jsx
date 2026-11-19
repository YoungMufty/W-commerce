import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Search, Check, ExternalLink, Sparkles, Image as ImageIcon, 
  Upload, Eye, Globe, ChevronRight, CheckCircle2, RefreshCw, Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import { BANNER_CATEGORIES, FREE_BANNERS, EXTERNAL_BANNER_SITES } from '../../config/freeBanners';

export default function FreeBannerPickerModal({
  isOpen,
  onClose,
  onSelectBanner,
  currentCategory = 'food',
  storeName = 'My Store',
  storeLogo = '',
  tagline = 'Fast delivery & quality products',
  activeBannerUrl = ''
}) {
  const [selectedCategory, setSelectedCategory] = useState(() => {
    // Match current category ID or default to food
    const found = BANNER_CATEGORIES.find(c => c.id.toLowerCase() === (currentCategory || '').toLowerCase());
    return found ? found.id : 'food';
  });

  const [activeTag, setActiveTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewBanner, setPreviewBanner] = useState(null);
  const [customUrl, setCustomUrl] = useState('');
  const [activeTab, setActiveTab] = useState('curated'); // 'curated' | 'external' | 'custom'

  // Update category when prop changes if modal re-opens
  React.useEffect(() => {
    if (currentCategory) {
      const found = BANNER_CATEGORIES.find(c => c.id.toLowerCase() === currentCategory.toLowerCase());
      if (found) setSelectedCategory(found.id);
    }
  }, [currentCategory, isOpen]);

  // Current Category Object
  const currentCatObj = useMemo(() => {
    return BANNER_CATEGORIES.find(c => c.id === selectedCategory) || BANNER_CATEGORIES[0];
  }, [selectedCategory]);

  // Filtered Banners
  const filteredBanners = useMemo(() => {
    return FREE_BANNERS.filter(banner => {
      // Category filter (if not 'all')
      const matchesCategory = selectedCategory === 'all' || banner.category.toLowerCase() === selectedCategory.toLowerCase();
      
      // Tag filter
      const matchesTag = activeTag === 'All' || (banner.tags && banner.tags.some(t => t.toLowerCase() === activeTag.toLowerCase()));

      // Search Query filter
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || 
        banner.title.toLowerCase().includes(query) || 
        banner.category.toLowerCase().includes(query) ||
        (banner.tags && banner.tags.some(t => t.toLowerCase().includes(query)));

      return matchesCategory && matchesTag && matchesSearch;
    });
  }, [selectedCategory, activeTag, searchQuery]);

  if (!isOpen) return null;

  const handleApply = (url, bannerInfo) => {
    onSelectBanner(url, bannerInfo);
    toast.success('Store banner updated successfully!');
    onClose();
  };

  const handleApplyCustomUrl = () => {
    if (!customUrl.trim()) {
      toast.error('Please enter a valid image URL');
      return;
    }
    handleApply(customUrl.trim(), { title: 'Custom Free Banner', category: selectedCategory });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-6xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white z-10"
        >
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-slate-800 bg-slate-900/95 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-black">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">Free Store Banners</h2>
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    100% Free Stock
                  </span>
                </div>
                <p className="text-xs md:text-sm text-slate-400">
                  Pick high-resolution banners curated for your store category or import from top free banner sites
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              {/* Tab Selector */}
              <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700">
                <button
                  onClick={() => setActiveTab('curated')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'curated' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Category Banners
                </button>
                <button
                  onClick={() => setActiveTab('external')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'external' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Free Banner Sites
                </button>
                <button
                  onClick={() => setActiveTab('custom')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'custom' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Import URL
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Subheader / Category Selector bar */}
          {activeTab === 'curated' && (
            <div className="border-b border-slate-800 bg-slate-900/60 p-3 md:px-6 shrink-0 space-y-3">
              {/* Category Pills Slider */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700">
                <button
                  onClick={() => { setSelectedCategory('all'); setActiveTag('All'); }}
                  className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-white text-slate-900 shadow-md font-extrabold'
                      : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  <span>✨</span> All Categories
                </button>

                {BANNER_CATEGORIES.map(cat => {
                  const isSelected = selectedCategory === cat.id;
                  const isCurrentStoreCategory = (currentCategory || '').toLowerCase() === cat.id.toLowerCase();
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); setActiveTag('All'); }}
                      className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isSelected 
                          ? 'bg-orange-500 text-white font-bold shadow-md shadow-orange-500/20' 
                          : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                      }`}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.name}</span>
                      {isCurrentStoreCategory && (
                        <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.2 rounded-full font-bold ml-1">
                          Store
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Sub-tags and Search Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                {/* Tag Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {currentCatObj.tags?.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(tag)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-colors ${
                        activeTag === tag
                          ? 'bg-slate-200 text-slate-900'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div className="relative min-w-[240px]">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={`Search ${currentCatObj.name} banners...`}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-950/60">
            {/* TAB 1: CURATED CATEGORY BANNERS */}
            {activeTab === 'curated' && (
              <div className="space-y-6">
                {/* Active Category Header Banner Info */}
                <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-xl p-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{currentCatObj.emoji}</span>
                    <div>
                      <span className="text-sm font-bold text-white block">
                        {currentCatObj.name} Banners
                      </span>
                      <span className="text-xs text-slate-400">
                        {filteredBanners.length} banners found — formatted for store headers (1200 x 450 px)
                      </span>
                    </div>
                  </div>

                  {/* Freepik & External Link shortcut */}
                  <a
                    href={`https://www.freepik.com/free-photos-vectors/${currentCatObj.id}-banner`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <span>Browse more on Freepik</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                {/* Banners Grid */}
                {filteredBanners.length === 0 ? (
                  <div className="py-16 text-center text-slate-500 space-y-3">
                    <ImageIcon size={44} className="mx-auto text-slate-600 opacity-60" />
                    <p className="text-sm font-medium">No banners found matching your criteria</p>
                    <button 
                      onClick={() => { setActiveTag('All'); setSearchQuery(''); }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                    {filteredBanners.map(banner => {
                      const isCurrentlyActive = activeBannerUrl === banner.url;
                      return (
                        <div
                          key={banner.id}
                          className={`group relative bg-slate-900 rounded-2xl overflow-hidden border transition-all duration-200 ${
                            isCurrentlyActive 
                              ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500' 
                              : 'border-slate-800 hover:border-slate-700 hover:shadow-xl hover:shadow-black/40'
                          }`}
                        >
                          {/* Banner Image Preview Aspect Ratio 2.66:1 */}
                          <div className="relative aspect-[2.66/1] w-full overflow-hidden bg-slate-950">
                            <img
                              src={banner.url}
                              alt={banner.alt || banner.title}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

                            {/* Badge */}
                            {banner.badge && (
                              <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                {banner.badge}
                              </div>
                            )}

                            {/* Active Checkmark */}
                            {isCurrentlyActive && (
                              <div className="absolute top-2.5 right-2.5 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                <CheckCircle2 size={13} /> Active Banner
                              </div>
                            )}

                            {/* Quick Hover Action overlay */}
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                              <button
                                onClick={() => setPreviewBanner(banner)}
                                className="px-3 py-2 bg-slate-800/90 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg"
                              >
                                <Eye size={14} /> Preview Store
                              </button>

                              <button
                                onClick={() => handleApply(banner.url, banner)}
                                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-lg shadow-orange-600/30 scale-100 hover:scale-105"
                              >
                                <Check size={14} /> Select as Banner
                              </button>

                              <a
                                href={banner.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs transition-colors"
                                title="Open full resolution in new tab"
                              >
                                <Download size={14} />
                              </a>
                            </div>
                          </div>

                          {/* Banner Card Details */}
                          <div className="p-3.5 flex items-center justify-between gap-3 bg-slate-900/90">
                            <div>
                              <h3 className="font-bold text-sm text-slate-100 line-clamp-1">{banner.title}</h3>
                              <div className="flex items-center gap-1.5 mt-1">
                                {banner.tags?.map(t => (
                                  <span key={t} className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded font-medium">
                                    {t}
                                  </span>
                                ))}
                                <span className="text-[10px] text-slate-500">• 1200x450 HD</span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleApply(banner.url, banner)}
                              className="shrink-0 px-3 py-1.5 bg-orange-600/20 hover:bg-orange-600 text-orange-400 hover:text-white border border-orange-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                            >
                              <Check size={13} /> Select
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: EXTERNAL FREE BANNER SITES */}
            {activeTab === 'external' && (
              <div className="space-y-6 max-w-4xl mx-auto py-2">
                <div className="bg-gradient-to-r from-orange-950/40 via-slate-900 to-amber-950/40 border border-orange-500/30 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
                      <Globe size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">
                        Find Banners on Free Stock Sites for "{currentCatObj.name}"
                      </h3>
                      <p className="text-sm text-slate-300 mb-4">
                        Search millions of high-resolution, free banners and vectors on premier stock photography platforms. Click any site below to browse banners filtered specifically for your store category, copy your favorite image address, and paste it back into your store!
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {EXTERNAL_BANNER_SITES.map(site => (
                          <a
                            key={site.name}
                            href={site.getUrl(currentCatObj.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-orange-500/50 rounded-xl transition-all group"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-white group-hover:text-orange-400 transition-colors">
                                  {site.name}
                                </span>
                                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                                  {site.badge}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{site.desc}</p>
                            </div>
                            <ExternalLink size={16} className="text-slate-500 group-hover:text-orange-400 transition-colors shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Paste Box */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-400" /> Found a banner you love? Paste the URL below:
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customUrl}
                      onChange={e => setCustomUrl(e.target.value)}
                      placeholder="Paste image URL (e.g. https://images.unsplash.com/... or https://img.freepik.com/...)"
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                    <button
                      onClick={handleApplyCustomUrl}
                      className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-sm transition-colors flex items-center gap-1.5"
                    >
                      <Check size={16} /> Use Banner
                    </button>
                  </div>
                  {customUrl && (
                    <div className="relative aspect-[2.66/1] max-w-md rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                      <img src={customUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: CUSTOM IMPORT URL */}
            {activeTab === 'custom' && (
              <div className="max-w-2xl mx-auto py-6 space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white">Import Banner via Direct URL</h3>
                  <p className="text-xs text-slate-400">
                    Paste any public image address from Freepik, Unsplash, Pexels, or your cloud storage to set it as your store banner.
                  </p>

                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-slate-300">Banner Image URL</label>
                    <input
                      type="url"
                      value={customUrl}
                      onChange={e => setCustomUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {customUrl && (
                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-semibold text-slate-400">Live Preview:</label>
                      <div className="relative aspect-[2.66/1] w-full rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                        <img 
                          src={customUrl} 
                          alt="Custom banner preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => toast.error('Unable to load image from this URL. Make sure it is a direct image link.')}
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      onClick={() => setCustomUrl('')}
                      className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleApplyCustomUrl}
                      disabled={!customUrl.trim()}
                      className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition flex items-center gap-1.5"
                    >
                      <Check size={16} /> Apply as Store Banner
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Category: <strong>{currentCatObj.name}</strong></span>
              <span className="text-slate-600">|</span>
              <span>All images are 100% royalty-free for commercial use</span>
            </div>

            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition"
            >
              Close
            </button>
          </div>
        </motion.div>

        {/* ── INTERACTIVE STOREFRONT PREVIEW MODAL ─────────────── */}
        {previewBanner && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye size={18} className="text-orange-400" />
                  <span className="font-bold text-white text-sm">Storefront Header Preview</span>
                </div>
                <button
                  onClick={() => setPreviewBanner(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Realistic Store Mockup */}
              <div className="p-6 bg-slate-950">
                <div className="border border-slate-800 rounded-2xl overflow-hidden bg-white shadow-xl">
                  {/* Banner Header */}
                  <div className="relative h-48 md:h-56 w-full overflow-hidden bg-slate-900">
                    <img
                      src={previewBanner.url}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Store Identity on Banner */}
                    <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white p-1 border-2 border-white shadow-xl overflow-hidden shrink-0">
                          {storeLogo ? (
                            <img src={storeLogo} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-black text-xl rounded-xl">
                              {storeName?.[0] || 'S'}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-black text-white drop-shadow-md">{storeName}</h3>
                            <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">✓ Verified</span>
                          </div>
                          <p className="text-xs text-slate-200 drop-shadow line-clamp-1">{tagline}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mock Navigation Tabs */}
                  <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                    <div className="flex gap-4 font-bold">
                      <span className="text-black border-b-2 border-black pb-1">Products</span>
                      <span>Reviews (4.9★)</span>
                      <span>About Store</span>
                      <span>Contact</span>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full">Open Now</span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  {previewBanner.title}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewBanner(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
                  >
                    Back to Gallery
                  </button>
                  <button
                    onClick={() => {
                      const url = previewBanner.url;
                      setPreviewBanner(null);
                      handleApply(url, previewBanner);
                    }}
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-orange-600/30"
                  >
                    <Check size={14} /> Use This Banner
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}
