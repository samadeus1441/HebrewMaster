'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError(loginError.message);
        setLoading(false);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('Connection error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-900" dir="ltr">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-black text-slate-900 mb-6 text-center tracking-tighter">
          HEBREW MASTER
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full p-3 border border-slate-200 rounded-xl outline-none text-slate-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full p-3 border border-slate-200 rounded-xl outline-none text-slate-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
          <button 
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}