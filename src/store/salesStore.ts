import { supabase } from '../lib/supabase';
import { create }from 'zustand';
import type { Currency } from '../lib/money';
import type { SaleItemRow, SaleWithItems } from '../types';

type SalesState = {
    error: string | null;
    loading: boolean;
    sales: SaleWithItems[];
    recordSale: (
        rows: SaleItemRow[],
        total: number,
        currency: Currency,
        eventDate: string
    ) => Promise<boolean>;
    fetchSales: () => Promise<void>;
};

export const useSalesStore = create<SalesState>((set) => ({
    error: null,
    loading: false,
    sales: [],

    recordSale: async (rows, total, currency, eventDate) => {
        set({ error: null });

        const { data: sale, error } = await supabase
            .from('sales')
            .insert({ total_cents: total, currency, event_date: eventDate })
            .select()
            .single();

        if (error) { set({ error: error.message }); return false; }

        const { error: itemsError } = await supabase
            .from('sale_items')
            .insert(rows.map(r => ({ ...r, sale_id: sale.id })));

        if (itemsError) { set({ error: itemsError.message }); return false; }

        return true;
    },
    fetchSales: async () => {
        set({ loading: true, error: null });
        const { data, error } = await supabase
            .from('sales')
            .select('*, sale_items(*)')
            .order('created_at', { ascending: false });
        
        if (error) { set({ error: error.message, loading: false }); return; }
        set({ sales: data, loading: false });
    },

}));