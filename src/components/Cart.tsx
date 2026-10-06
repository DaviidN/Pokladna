import { useState } from "react";
import { formatMoney } from "../lib/money";
import { useCartStore } from "../store/cartStore";
import { useCatalogStore } from "../store/catalogStore";
import { useSalesStore } from "../store/salesStore";
import type { SaleItemRow } from "../types";
import type { Currency } from "../lib/money";


export const Cart: React.FC<{ currency: Currency }> = ({ currency }) => {

    const items = useCartStore(s => s.items);
    const products = useCatalogStore(s => s.products);
    const cartBundles = useCartStore(s => s.bundles);
    const bundles = useCatalogStore(s => s.bundles);
    const decrement = useCartStore(s => s.decrement);
    const addProduct = useCartStore(s => s.addProduct);
    const addBundle = useCartStore(s => s.addBundle);
    const recordSale = useSalesStore(s => s.recordSale);
    const saleError = useSalesStore(s => s.error);
    const clear = useCartStore(s => s.clear);
    const [saving, setSaving] = useState(false);
    
    const productLines = Object.entries(items).flatMap(([id, qty]) => {
      const product = products.find(p => p.id === id);
      if (!product) return [];  
      const unit = currency === 'CZK' ? product.price_czk_cents : product.price_eur_cents;
      return { id, name: product.name, qty, unit, sum: unit * qty, type: 'product' as const };
    });
    
    const bundleLines = Object.entries(cartBundles).flatMap(([id, qty]) => {
      const bundle = bundles.find(b => b.id === id);
      if (!bundle) return [];
      const unit = currency === 'CZK' ? bundle.price_czk_cents : bundle.price_eur_cents;
      return { id, name: bundle.name, qty, unit, sum: unit * qty, type: 'bundle' as const };
    });

    const productRows: SaleItemRow[] = Object.entries(items).flatMap(([id, qty]) => {
      const p = products.find(x => x.id === id);
      if (!p) return [];
      const price = currency === 'CZK' ? p.price_czk_cents : p.price_eur_cents;
      return [{
        product_id: p.id,
        product_name: p.name,
        qty,
        unit_price_cents: price,
        list_price_cents: price,
        bundle_id: null,
        bundle_name: null,
      }];
    });

    const bundleRows: SaleItemRow[] = Object.entries(cartBundles).flatMap(([id, qty]) => {
      const b = bundles.find(x => x.id === id);
      if (!b) return [];
      return b.bundle_items.flatMap(bi => {
        const p = products.find(x => x.id === bi.product_id);
        if (!p) return [];
        const list = currency === 'CZK' ? p.price_czk_cents : p.price_eur_cents;
        return [{
          product_id: p.id,
          product_name: p.name,
          qty,
          unit_price_cents: 0,
          list_price_cents: list,
          bundle_id: b.id,
          bundle_name: b.name,
        }];
      });
    });

    const total = [...bundleLines, ...productLines].reduce((acc, line) => acc + line.sum, 0);

    const allLines = [...bundleLines, ...productLines];

    const handleSale = async () => {
      setSaving(true);
      const ok = await recordSale([...productRows, ...bundleRows], total, currency, new Date().toISOString().slice(0, 10));
      setSaving(false);
      if (ok) clear();
    };

    return (
    <div className="flex flex-col rounded-[10px] border border-line bg-surface">
      <h2 className="border-b border-line px-3.5 py-3 text-sm font-semibold">Účtenka</h2>

      <div className="flex-1 overflow-auto py-1.5">
        {!allLines.length && (
          <p className="px-3.5 py-5 text-sm text-muted">Klikni na hru vlevo.</p>
        )}

        {allLines.map(line => (
          <div
            key={`${line.type}-${line.id}`}
            className="flex items-center gap-2.5 px-3.5 py-1.5
                       border-t border-dashed border-line first:border-t-0"
          >
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{line.name}</div>
              <div className="font-mono text-xs text-muted">
                {formatMoney(line.unit, currency)} / ks
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => decrement(line.id, line.type)}
                className="h-6.5 w-6.5 rounded-md border border-line bg-paper
                           leading-none hover:border-line-strong"
              >
                −
              </button>
              <span className="min-w-5 text-center font-mono font-semibold">{line.qty}</span>
              <button
                onClick={() => line.type === 'product' ? addProduct(line.id) : addBundle(line.id)}
                className="h-6.5 w-6.5 rounded-md border border-line bg-paper
                           leading-none hover:border-line-strong"
              >
                +
              </button>
            </div>
            <div className="min-w-18.5 text-right font-mono font-medium">
              {formatMoney(line.sum, currency)}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2.5 border-t border-line px-3.5 py-3">
        <div className="flex items-baseline justify-between">
          <span className="text-[13px] text-muted">Celkem</span>
          <span className="font-mono text-2xl font-bold tracking-tight">
            {formatMoney(total, currency)}
          </span>
        </div>

        <button
          disabled={!allLines.length || saving}
          className="rounded-lg bg-accent px-3.5 py-2.5 font-semibold text-accent-ink
                     hover:brightness-110 cursor-pointer 
                     disabled:opacity-40 disabled:hover:brightness-100"
          onClick={handleSale}
        >
          Zaznamenat prodej
        </button>

        <button
          onClick={clear}
          className="rounded-lg px-2 py-1.5 text-sm text-muted hover:text-ink"
        >
          Vyprázdnit účtenku
        </button>
      </div>
      {saleError && <p className="text-sm text-danger">{saleError}</p>}
    </div>
  );
};
