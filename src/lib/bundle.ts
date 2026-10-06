export function allocate(prices: number[], total: number): number[] {
    const sum = prices.reduce((a, b) => a + b, 0);
    const raw: number[] = [];
    const base: number[] = [];
    const rest: number[] = [];
    
    if (sum === 0) {
        const each = Math.floor(total / prices.length);
        const out = prices.map(() => each);
        for (let i = 0; i < total - each * prices.length; i++) out[i]++;
        return out;
    }
            
    for (let i = 0; i < prices.length; i++) {
        raw[i] = prices[i] * total / sum;
        base[i] = Math.floor(raw[i]);
        rest[i] = raw[i] - base[i];
    }
    
    const missing = total - base.reduce((a, b) => a + b, 0);
    const order  = rest
        .map((r, i) => ({ i, r }))
        .sort((a, b) => b.r - a.r)
        .slice(0, missing)
        .map(({ i }) => i);

    return base.map((b, i) => b + (order.includes(i) ? 1 : 0));
}