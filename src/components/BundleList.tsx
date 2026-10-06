import React from "react";
import { type Currency, formatMoney } from "../lib/money";
import type { BundleWithItems } from "../types";
import { Tile } from "./Tile";
import { useCartStore } from "../store/cartStore";

export const BundleList: React.FC<{ 
    bundlesWithItems: BundleWithItems[], 
    currency: Currency,
    onSelectBundle: (id: string) => void
  }> = ({ bundlesWithItems, currency, onSelectBundle }) => {

  const bundles = useCartStore(s => s.bundles);

  if (!bundlesWithItems.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
      {bundlesWithItems.map((bundle) => (
        <Tile
          key={bundle.id}
          variant="bundle"
          qty={bundles[bundle.id] || 0}
          onClick={() => onSelectBundle(bundle.id)}
        >
          <span className="font-semibold leading-tight">{bundle.name}</span>
          <span className="mt-auto font-mono text-sm text-muted">
            {formatMoney(
              currency === 'CZK' ? bundle.price_czk_cents : bundle.price_eur_cents,
              currency
            )}
          </span>
        </Tile>
      ))}
    </div>
  );
};
