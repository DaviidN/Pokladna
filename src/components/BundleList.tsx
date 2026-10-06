import React from "react";
import { type Currency, formatMoney } from "../lib/money";
import type { BundleWithItems, Product } from "../types";
import { Tile } from "./Tile";
import { useCartStore } from "../store/cartStore";

export const BundleList: React.FC<{ 
    bundlesWithItems: BundleWithItems[], 
    products: Product[],
    currency: Currency,
    onSelectBundle: (id: string) => void
  }> = ({ bundlesWithItems, products, currency, onSelectBundle }) => {

    
  const bundles = useCartStore(s => s.bundles);
  
  if (!bundlesWithItems.length) return null;

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
      {bundlesWithItems.map(bundle => {
        const contents = (bundle.bundle_items ?? [])
          .map(bi => products.find(p => p.id === bi.product_id))
          .filter((p): p is Product => !!p);

       const listPrice = contents.reduce(
          (s, p) => s + (currency === 'CZK' ? p.price_czk_cents : p.price_eur_cents), 0
        );
        const price = currency === 'CZK' ? bundle.price_czk_cents : bundle.price_eur_cents;

      return (
        <Tile
          key={bundle.id}
          variant="bundle"
          qty={bundles[bundle.id] || 0}
          onClick={() => onSelectBundle(bundle.id)}
        >
          <span className="font-semibold leading-tight">{bundle.name}</span>

          <span>{contents.length ? contents.map(c => c.name).join(' + ') : '⚠ prázdný balíček'}</span>
          <span className="mt-auto font-mono text-sm font-semibold text-bundle">
            {formatMoney(price, currency)}{' '}
            <span className="font-normal text-muted line-through">
              {formatMoney(listPrice, currency)}
            </span>
          </span> 
        </Tile>
      );
      })}
    </div>
  );
};
