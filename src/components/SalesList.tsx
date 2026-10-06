import { formatMoney } from "../lib/money";
import type { SaleWithItems } from "../types";

export const SalesList = ({ sales }: { sales: SaleWithItems[] }) => {

    return (
        <div className="flex flex-col gap-2">
            {sales.map(sale => (
                <div key={sale.id} className="rounded-lg border border-line bg-surface p-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm">
                            {new Date(sale.created_at).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}
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