import type { Currency } from "../lib/money";
import { create } from "zustand";

type CartState = {
  currency: Currency;
  items: Record<string, number>;   
  bundles: Record<string, number>; 
  addProduct: (id: string) => void;
  addBundle: (id: string) => void;
  decrement: (id: string, kind: 'product' | 'bundle') => void;
  clear: () => void;
  setCurrency: (c: Currency) => void;
};

export const useCartStore = create<CartState>((set) => ({
  currency: 'CZK',
  items: {},
  bundles: {},
  addProduct: (id) => set((state) => {
    const currentCount = state.items[id] || 0;
    return { items: { ...state.items, [id]: currentCount + 1 } };
  }),
  addBundle: (id) => set((state) => {
    const currentCount = state.bundles[id] || 0;
    return { bundles: { ...state.bundles, [id]: currentCount + 1 } };
  }),
  decrement: (id, kind) => set((state) => {
    const bag = kind === 'product' ? state.items : state.bundles;
    const next = (bag[id] || 0) - 1;
    const updated = { ...bag };
    if (next <= 0) delete updated[id];
    else updated[id] = next;
    return kind === 'product' ? { items: updated } : { bundles: updated };
  }),
  clear: () => set({ items: {}, bundles: {} }),
  setCurrency: (currency) => set({ currency, items: {}, bundles: {} }),
}));
