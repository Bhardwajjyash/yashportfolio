import { create } from 'zustand'

export const useStore = create((set) => ({
  // Preloader state
  isLoading: true,
  progress: 0,
  setLoading: (loading) => set({ isLoading: loading }),
  setProgress: (progress) => set({ progress }),
  
  // Performance scaling flag (for mobile/low-end GPUs)
  isLowPerformance: false,
  setLowPerformance: (isLow) => set({ isLowPerformance: isLow }),

  // UI state
  audioEnabled: false,
  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
}))