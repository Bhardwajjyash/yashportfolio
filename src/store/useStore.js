import { create } from 'zustand'

export const useStore = create((set) => ({
  isLoading: true,
  progress: 0,
  setLoading: (loading) => set({ isLoading: loading }),
  setProgress: (progress) => set({ progress }),
  isLowPerformance: false,
  setLowPerformance: (isLow) => set({ isLowPerformance: isLow }),
  audioEnabled: false,
  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
}))