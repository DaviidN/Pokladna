import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Product, BundleWithItems } from '../types';

type CatalogState = {
  products: Product[];
  bundles: BundleWithItems[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchBundles: () => Promise<void>;
  addBundle: (name: string, items: { productId: string }[]) => Promise<boolean>;
  addProduct: (name: string, czkCents: number, eurCents: number) => Promise<boolean>;
};

export const useCatalogStore = create<CatalogState>((set, get) => ({
  products: [],
  bundles: [],
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
  fetchBundles: async () => {
    set({ loading:true, error: null});
    const { data, error } = await supabase
    .from('bundles')
    .select('*, bundle_items(product_id)').order('name');
    if (error) {
      set({ error: error.message, loading: false });
    } else {
      set({ bundles: data || [], loading: false });
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
  addBundle: async (name, items) => {
    set({ error: null });
    const { data, error } = await supabase
      .from('bundles')
      .insert({ name })
      .select('id')
      .single();

    if (error || !data) {
      set({ error: error.message });
      return false;
    }

    const { error: itemsError } = await supabase
      .from('bundle_items')
      .insert(items.map(({ productId }) => ({
        bundle_id: data.id,
        product_id: productId,
      })));

    if (itemsError) {
      set({ error: itemsError.message });
      return false;
    }

    await get().fetchBundles();
    return true;
  },
}));