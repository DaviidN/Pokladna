import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';

type CatalogState = {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (name: string, czkCents: number, eurCents: number) => Promise<boolean>;
};

export const useCatalogStore = create<CatalogState>((set, get) => ({
  products: [],
  loading: false,
  error: null,
  
  fetchProducts: async () => {
    set({ loading:true, error: null});
    const { data, error } = await supabase
      .from('products')
      .select('*').order('name');
    if (error) {
      set({ error: error.message, loading: false });
    } else {
      set({ products: data || [], loading: false });
    }
  },
  addProduct: async (name, czkCents, eurCents) => {
    set({ error: null });
    const { error } = await supabase
      .from('products')
      .insert({ name, price_czk_cents: czkCents, price_eur_cents: eurCents });

    if (error) {
      set({ error: error.message });
      return false;
    }

    await get().fetchProducts();
    return true;
  },
}));