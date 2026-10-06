import type { Database } from './lib/database.types';
import type { Currency } from './lib/money';

export type Product   = Database['public']['Tables']['products']['Row'];
export type Bundle    = Database['public']['Tables']['bundles']['Row'];
export type Sale      = Database['public']['Tables']['sales']['Row'];
export type SaleItem  = Database['public']['Tables']['sale_items']['Row'];

export type SaleItemInsert = Database['public']['Tables']['sale_items']['Insert'];
export type SaleItemRow = Omit<SaleItemInsert, 'sale_id'>;
export type SaleWithItems = Omit<Sale, 'currency'> & { 
  currency: Currency;
  sale_items: SaleItem[] 
};

export type BundleWithItems = Bundle & {
  bundle_items: { product_id: string }[];
};