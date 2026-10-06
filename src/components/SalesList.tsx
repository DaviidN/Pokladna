import { useEffect }from "react";
import { useSalesStore } from "../store/salesStore";
import { formatMoney } from "../lib/money";

export const SalesList = () => {
    const sales = useSalesStore(s => s.sales);
    const loading = useSalesStore(s => s.loading);
    const fetchSales = useSalesStore(s => s.fetchSales);

    useEffect(() => { fetchSales(); }, [fetchSales]);

    if (loading) return <p className="text-sm text-muted">Načítám…</p>;
    if (!sales.length) return <p className="text-sm text-muted">Zatím žádné prodeje.</p>;

    return (
        <div className="flex flex-col gap-2">
            {sales.map(sale => (
                <div key={sale.id} className="rounded-lg border border-line bg-surface p-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm">
                            {new Date(sale.event_date).toLocaleDateString('cs-CZ')}
                            {' · '}  
                            <span className="font-mono">
                                {sale.sale_items.reduce((s, i) => s + i.qty, 0)} ks
                            </span>
                        </span>
                        <span className="font-mono font-semibold">
                            {formatMoney(sale.total_cents, sale.currency)}
                        </span>
                    </div>
                    <div className="mt-1.5 text-xs text-muted">
                        {sale.sale_items.map(i => (
                        <div key={i.id} className="flex justify-between py-0.5">
                            <span>
                            {i.product_name} <span className="font-mono">{i.qty}×</span>
                            {i.bundle_name && (
                                <span className="text-bundle"> ({i.bundle_name})</span>
                            )}
                            </span>
                        </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SalesList;
