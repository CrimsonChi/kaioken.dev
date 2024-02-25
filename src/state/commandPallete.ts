import { createStore } from "kaioken"

export const useCommandPallete = createStore(
  { open: false, event: null as Event | null },
  (set) => ({
    setOpen: (open: boolean, event: Event | null = null) =>
      set({ open, event }),
  })
)
