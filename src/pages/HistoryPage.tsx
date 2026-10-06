import { useEffect, useState } from "react";
import { SalesList }from "../components/SalesList";
import { useSalesStore } from "../store/salesStore";
import { formatMoney, type Currency } from "../lib/money";

type DayStats = {
  date: string;
  revenue: Record<Currency, number>;
  pieces: number;
  saleCount: number;
};

export const HistoryPage = () => {
    const [showFullDay, setShowFullDay] = useState<string | null>(null);

    const fetchSales = useSalesStore(s => s.fetchSales);
    const loading = useSalesStore(s => s.loading);
    const sales = useSalesStore(s => s.sales);
    
    const byDay = sales.reduce((acc, sale) => {
      const day = (acc[sale.event_date] ??= {
        date: sale.event_date,
        revenue: { CZK: 0, EUR: 0 },
        pieces: 0,
        saleCount: 0,
      });
      day.revenue[sale.currency as Currency] += sale.total_cents;
      day.pieces += sale.sale_items.reduce((s, i) => s + i.qty, 0);
      day.saleCount += 1;
      return acc;
    }, {} as Record<string, DayStats>);
    
    const days = Object.values(byDay).sort((a, b) => b.date.localeCompare(a.date));
    
    const agg: Record<string, { name: string; qty: number; inBundle: number }> = {};

    sales.forEach(sale =>
    sale.sale_items.forEach(item => {
        const key = item.product_id ?? item.product_name;
        const a = (agg[key] ??= { name: item.product_name, qty: 0, inBundle: 0 });
        a.qty += item.qty;
        if (item.bundle_id) a.inBundle += item.qty;
    })
    );
    
    const rows = Object.values(agg).sort((a, b) => b.qty - a.qty);
    
    const revenue = sales.reduce((acc, s) => {
        acc[s.currency] = (acc[s.currency] || 0) + s.total_cents;
        return acc;
    }, {} as Record<Currency, number>);
    
    useEffect(() => {
        fetchSales();
    }, [fetchSales]);

    if (loading) return <p className="text-sm text-muted">Načítám…</p>;
    if (!sales.length) return <p className="text-sm text-muted">Zatím žádné prodeje.</p>;

    return (
        <div className="flex flex-row gap-5">
            <div className="flex flex-col gap-5 flex-1">
                {days.map(day => (
                    <div key={day.date} className="rounded-[10px] border border-line bg-surface p-4">
                        <div className="flex items-baseline justify-between">
                        <h3 className="font-semibold">
                            {new Date(day.date).toLocaleDateString('cs-CZ', {
                            weekday: 'short', day: 'numeric', month: 'long'
                            })}
                        </h3>
                        <span className="text-xs text-muted">
                            <span className="font-mono">{day.saleCount}</span> prodejů ·{' '}
                            <span className="font-mono">{day.pieces}</span> ks
                        </span>
                        </div>

                        <div className="mt-3 flex gap-6">
                        {(['CZK', 'EUR'] as const).map(cur => (
                            <div key={cur} className={day.revenue[cur] === 0 ? 'opacity-40' : ''}>
                            <div className="text-xs text-muted">{cur}</div>
                            <div className="font-mono text-xl font-bold tracking-tight">
                                {formatMoney(day.revenue[cur], cur)}
                            </div>
                            </div>
                        ))}
                        </div>
                        <button
                            onClick={() => setShowFullDay(showFullDay === day.date ? null : day.date)}
                            className="flex w-full items-center gap-2 text-left"
                            aria-expanded={showFullDay === day.date}
                            >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`h-4 w-4 flex-none text-muted transition-transform duration-150 ${
                                showFullDay === day.date ? 'rotate-180' : ''
                                }`}
                            >
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </button>
                        {showFullDay === day.date && <SalesList sales={sales.filter(s => s.event_date === day.date)}/>}
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-5">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-2">
                {rows.map(r => (
                    <div key={r.name} className="rounded-[10px] border border-line bg-surface p-3.5">
                    <div className="truncate text-sm font-medium" title={r.name}>
                        {r.name}
                    </div>

                    <div className="mt-2 flex items-baseline gap-1.5">
                        <span className="font-mono text-2xl font-bold leading-none tracking-tight">
                        {r.qty}
                        </span>
                        <span className="text-xs text-muted">ks</span>
                    </div>

                    {r.inBundle > 0 && (
                        <div className="mt-2 text-xs text-bundle">
                        z toho <span className="font-mono font-semibold">{r.inBundle}</span> v balíčku
                        </div>
                    )}
                    </div>
                ))}
                </div>
            {Object.entries(revenue).map(([cur, cents]) => (
                <div key={cur}>
                <div className="text-xs text-muted">Celková tržba {cur}</div>
                    <div className="font-mono text-xl font-bold">
                        {formatMoney(cents, cur as Currency)}
                    </div>
                </div>
            ))}
            </div>
        </div>

    )
};