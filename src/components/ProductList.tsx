import React from "react";
import { type Currency, formatMoney } from "../lib/money";
import type { Product } from "../types";
import { Tile } from "./Tile";
import { useCartStore } from "../store/cartStore";

export const ProductList: React.FC<{ 
    products: Product[], 
    currency: Currency,
    onSelectProduct: (id: string) => void
  }> = ({ products, currency, onSelectProduct }) => {
  
  const items = useCartStore(s => s.items);
  
  if (!products.length) {
    return <p className="text-muted text-sm py-6">Katalog je zatím prázdný.</p>;
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
      {products.map((product) => (
        <Tile
          key={product.id}
          qty={items[product.id] || 0}
          onClick={() => onSelectProduct(product.id)}
        >
          <span className="font-semibold leading-tight">{product.name}</span>
          <span className="mt-auto font-mono text-sm text-muted">
            {formatMoney(
              currency === 'CZK' ? product.price_czk_cents : product.price_eur_cents,
              currency
            )}
          </span>
        </Tile>
      ))}
    </div>
  );
};
