import type { Database } from './lib/database.types';

export type Product   = Database['public']['Tables']['products']['Row'];
export type Bundle    = Database['public']['Tables']['bundles']['Row'];
export type Sale      = Database['public']['Tables']['sales']['Row'];
export type SaleItem  = Database['public']['Tables']['sale_items']['Row'];