import { useState, useEffect } from 'react';
import { ProductList } from './components/ProductList';
import { BundleList } from './components/BundleList';
import { useCatalogStore } from './store/catalogStore';
import { useCartStore } from './store/cartStore';
import type { Currency } from './lib/money';
import { Cart } from './components/Cart';

function App() {
  const products = useCatalogStore(s => s.products);
  const bundles = useCatalogStore(s => s.bundles);
  const loading = useCatalogStore(s => s.loading);
  const error = useCatalogStore(s => s.error);
  const fetchProducts = useCatalogStore(s => s.fetchProducts);
  const fetchBundles = useCatalogStore(s => s.fetchBundles);

  const [currency, setCurrency] = useState<Currency>('CZK');
  const addProduct = useCartStore(s => s.addProduct);
  const addBundle = useCartStore(s => s.addBundle);

  useEffect(() => {
    fetchProducts();
    fetchBundles();
  }, [fetchProducts, fetchBundles]);

  if (loading) return <p>Načítám…</p>;
  if (error) return <p>Chyba: {error}</p>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-3xl font-bold">Pokladna</h1>
      <div className='flex items-center gap-3 py-4'>
        <label>
          Měna:
          <button className='border border-line bg-paper px-2 py-1 mx-3 rounded-md hover: cursor-pointer' 
                  onClick={() => setCurrency(currency === 'CZK' ? 'EUR' : 'CZK')
                  }>
            {currency}
          </button>
        </label>
      </div>
       <div className="grid items-start gap-5 md:grid-cols-[1fr_340px]">
        <div>
          <BundleList bundlesWithItems={bundles} currency={currency} onSelectBundle={addBundle} />
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