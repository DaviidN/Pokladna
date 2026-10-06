import { useEffect } from "react";
import SalesList from "../components/SalesList";
import { useSalesStore } from "../store/salesStore";
import { formatMoney, type Currency } from "../lib/money";

export const HistoryPage = () => {
    const fetchSales = useSalesStore(s => s.fetchSales);
    const sales = useSalesStore(s => s.sales);

    const agg: Record<string, { name: string; qty: number; inBundle: number }> = {};

    sales.forEach(sale =>
    sale.sale_items.forEach(item => {
        const a = (agg[item.product_id] ??= { name: item.product_name, qty: 0, inBundle: 0 });
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
    
    return (
        <div className="flex flex-row gap-5">
            <SalesList/>
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
                <div className="text-xs text-muted">Tržba {cur}</div>
                    <div className="font-mono text-xl font-bold">
                        {formatMoney(cents, cur as Currency)}
                    </div>
                </div>
            ))}
            </div>
        </div>

    )
};