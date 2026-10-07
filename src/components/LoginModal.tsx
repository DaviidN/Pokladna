import { useState } from "react";
import { useAuthStore } from "../store/authStore";

export const LoginModal = () => {
  const signIn = useAuthStore(s => s.signIn);
  const error = useAuthStore(s => s.error);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    await signIn(email, password);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper p-4">
      <div className="w-full max-w-xs rounded-xl border border-line bg-surface p-6">
        <h1 className="text-lg font-bold tracking-tight">
          Pokladna <span className="font-medium text-muted">— prodej her</span>
        </h1>
        <p className="mt-1 mb-5 text-sm text-muted">Přihlas se pro pokračování.</p>

        <div className="flex flex-col gap-2.5">
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="E-mail" autoComplete="username"
            className="rounded-lg border border-line bg-paper px-3 py-2"
          />
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="Heslo" autoComplete="current-password"
            className="rounded-lg border border-line bg-paper px-3 py-2"
          />

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            onClick={submit} disabled={loading || !email || !password}
            className="mt-1 rounded-lg bg-accent px-3.5 py-2.5 font-semibold text-accent-ink
                       hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100"
          >
            {loading ? 'Přihlašuji…' : 'Přihlásit'}
          </button>
        </div>
      </div>
    </div>
  );
};