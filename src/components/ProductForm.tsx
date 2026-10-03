import React from "react";
import { type Currency, formatMoney } from "../lib/money";
import type { Product } from "../types";

export const ProductForm: React.FC<{ products: Product[], currency: Currency }> = ({ products, currency }) => {
    if (!products.length) return <p>Katalog je zatím prázdný.</p>;
  
    return (
      <div>
        <h1>Účtenka</h1>
        {products.map((product) => (
          <div key={product.id}>
            <h2>{product.name}</h2>
            <p>{formatMoney(currency === 'CZK' ? product.price_czk_cents : product.price_eur_cents, currency)}</p>
          </div>
        ))}
      </div>
    );
};
