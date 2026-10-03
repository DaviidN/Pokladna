import { useState, useEffect } from 'react';
import { useCatalogStore } from './store/catalogStore';
import { ProductList } from './components/ProductList';
import { Cart } from './components/Cart';
import { useCartStore } from './store/cartStore';
import type { Currency } from './lib/money';

function App() {
  const products = useCatalogStore(s => s.products);
  const loading = useCatalogStore(s => s.loading);
  const error = useCatalogStore(s => s.error);
  const fetchProducts = useCatalogStore(s => s.fetchProducts);

  const [currency, setCurrency] = useState<Currency>('CZK');
  const addProduct = useCartStore(s => s.addProduct);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) return <p>Načítám…</p>;
  if (error) return <p>Chyba: {error}</p>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-3xl font-bold">Pokladna</h1>
      <div className='flex items-center gap-3 py-4'>
        <label>
          Měna:
          <button className='border border-line bg-paper px-2 py-1 mx-3 rounded-md hover: cursor-pointer' onClick={() => setCurrency(currency === 'CZK' ? 'EUR' : 'CZK')}>
            {currency}
          </button>
        </label>
      </div>
       <div className="grid items-start gap-5 md:grid-cols-[1fr_340px]">
        <div>
          <ProductList products={products} currency={currency} onSelectProduct={addProduct} />
        </div>
        <div className="md:sticky md:top-6">
          <Cart currency={currency} />
        </div>
      </div>
    </div>
  );
}

export default App;