import { useEffect } from 'react';
import { Link, Route, Switch, useLocation } from 'wouter';
import { SalePage } from './pages/SalePage';
import { HistoryPage } from './pages/HistoryPage';
import { useCatalogStore } from './store/catalogStore';
import { LoginModal } from './components/LoginModal';
import { useAuthStore } from './store/authStore';

const TABS = [
  { href: '/', label: 'Prodej' },
  { href: '/prehled', label: 'Přehled' },
];


function App() {
  const fetchProducts = useCatalogStore(s => s.fetchProducts);
  const init = useAuthStore(s => s.init);
  const fetchBundles = useCatalogStore(s => s.fetchBundles);
  const session = useAuthStore(s => s.session);

  useEffect(() => { init(); }, [init]);

  useEffect(() => {
     if (session) {
        fetchProducts();
        fetchBundles();
     }
  }, [session, fetchProducts, fetchBundles]);

  const [location] = useLocation();

/*   if (authLoading) return <p className="p-6 text-muted">Načítám…</p>; */
  if (!session) return <LoginModal />;

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
      {!session && 
        <LoginModal/>
      }
      <Switch>
        <Route path="/" component={SalePage} />
        <Route path="/prehled" component={HistoryPage} />
        <Route>Stránka nenalezena</Route>
      </Switch>
    </div>
  );
}

export default App;