import React from "react";
import { type Currency, formatMoney } from "../lib/money";
import type { Product } from "../types";

export const ProductList: React.FC<{ 
    products: Product[], 
    currency: Currency,
    onSelectProduct: (id: string) => void
    }> = ({ products, currency, onSelectProduct }) => {
  if (!products.length) {
    return <p className="text-muted text-sm py-6">Katalog je zatím prázdný.</p>;
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
      {products.map((product) => (
        <button
          key={product.id}
          className="flex min-h-19.5 flex-col gap-1.5 rounded-[10px] border border-line
                     bg-surface p-3 text-left transition-colors
                     hover:border-line-strong active:scale-[0.985] cursor-pointer"
          onClick={() => onSelectProduct(product.id)}
        >
          <span className="font-semibold leading-tight">{product.name}</span>
          <span className="mt-auto font-mono text-sm text-muted">
            {formatMoney(
              currency === 'CZK' ? product.price_czk_cents : product.price_eur_cents,
              currency
            )}
          </span>
        </button>
      ))}
    </div>
  );
};
