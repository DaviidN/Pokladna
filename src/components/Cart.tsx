import { formatMoney } from "../lib/money";
import { useCartStore } from "../store/cartStore";
import { useCatalogStore } from "../store/catalogStore";
import type { Currency } from "../lib/money";
import React from "react";


export const Cart: React.FC<{ currency: Currency }> = ({ currency }) => {

    const items = useCartStore(s => s.items);
    const products = useCatalogStore(s => s.products);
    const decrement = useCartStore(s => s.decrement);
    const increment = useCartStore(s => s.addProduct);
    const clear = useCartStore(s => s.clear);
    
    const lines = Object.entries(items).map(([id, qty]) => {
      const product = products.find(p => p.id === id);
      if (!product) return null;  
      const unit = currency === 'CZK' ? product.price_czk_cents : product.price_eur_cents;
      return { id, name: product.name, qty, unit, sum: unit * qty };
    }).filter(Boolean);

    return (
    <div className="flex flex-col rounded-[10px] border border-line bg-surface">
      <h2 className="border-b border-line px-3.5 py-3 text-sm font-semibold">Účtenka</h2>

      <div className="flex-1 overflow-auto py-1.5">
        {!lines.length && (
          <p className="px-3.5 py-5 text-sm text-muted">Klikni na hru vlevo.</p>
        )}

        {lines.map(line => (
          <div
            key={line.id}
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
                onClick={() => decrement(line.id, 'product')}
                className="h-6.5 w-6.5 rounded-md border border-line bg-paper
                           leading-none hover:border-line-strong"
              >
                −
              </button>
              <span className="min-w-5 text-center font-mono font-semibold">{line.qty}</span>
              <button
                onClick={() => increment(line.id)}
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
            {formatMoney(lines.reduce((acc, line) => acc + line.sum, 0), currency)}
          </span>
        </div>

        <button
          disabled={!lines.length}
          className="rounded-lg bg-accent px-3.5 py-2.5 font-semibold text-accent-ink
                     hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100"
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
    </div>
  );
};
