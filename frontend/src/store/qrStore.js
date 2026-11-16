import { create } from 'zustand';

export const useQRStore = create((set, get) => ({
  // Scanner Modal State
  isScannerOpen: false,
  customScanCallback: null,

  openScanner: (customCallback = null) => {
    set({
      isScannerOpen: true,
      customScanCallback: typeof customCallback === 'function' ? customCallback : null
    });
  },

  closeScanner: () => {
    set({
      isScannerOpen: false,
      customScanCallback: null
    });
  },

  // Share Modal State
  isShareOpen: false,
  sharePayload: null,

  /**
   * openShare({
   *   type: 'product' | 'store' | 'order' | 'receipt' | 'transaction',
   *   id: string,
   *   slug?: string,
   *   title: string,
   *   subtitle?: string,
   *   amount?: number | string,
   *   currency?: string,
   *   storeName?: string,
   *   status?: string,
   *   imageUrl?: string,
   *   url?: string,
   *   metadata?: object
   * })
   */
  openShare: (payload) => {
    set({
      isShareOpen: true,
      sharePayload: payload
    });
  },

  closeShare: () => {
    set({
      isShareOpen: false,
      sharePayload: null
    });
  }
}));
