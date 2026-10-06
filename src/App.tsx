import { useEffect } from 'react';
import { Link, Route, Switch, useLocation } from 'wouter';
import { SalePage } from './pages/SalePage';
import { HistoryPage } from './pages/HistoryPage';
import { useCatalogStore } from './store/catalogStore';

const TABS = [
  { href: '/', label: 'Prodej' },
  { href: '/prehled', label: 'Přehled' },
];


function App() {
  const fetchProducts = useCatalogStore(s => s.fetchProducts);
  const fetchBundles = useCatalogStore(s => s.fetchBundles);
  
  useEffect(() => {
    fetchProducts();
    fetchBundles();
  }, [fetchProducts, fetchBundles]);
  const [location] = useLocation();

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <header className="mb-5 flex items-baseline gap-4">
        <h1 className="text-xl font-bold tracking-tight">
          Pokladna <span className="font-medium text-muted">— prodej her</span>
        </h1>
        <nav className="ml-auto flex gap-1">
          {TABS.map(t => (
            <Link
              key={t.href}
              href={t.href}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-medium ${
                location === t.href
                  ? 'bg-surface text-ink shadow-sm'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </header>

      <Switch>
        <Route path="/" component={SalePage} />
        <Route path="/prehled" component={HistoryPage} />
        <Route>Stránka nenalezena</Route>
      </Switch>
    </div>
  );
}

export default App;