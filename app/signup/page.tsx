'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signupError) {
        setError(signupError.message);
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred during signup');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900" dir="ltr">
        <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl text-center">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Check your email</h1>
          <p className="text-slate-500 mb-6">We've sent a confirmation link to {email}.</p>
          <Link href="/login" className="text-indigo-600 font-bold hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-slate-900" dir="ltr">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-black text-slate-900 mb-2 text-center tracking-tighter">
          JOIN HEBREW MASTER
        </h1>
        <p className="text-center text-slate-500 mb-6 text-sm">Create your student account</p>
        
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full p-3 border border-slate-200 rounded-xl outline-none text-slate-900 focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full p-3 border border-slate-200 rounded-xl outline-none text-slate-900 focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="At least 6 characters"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-100">
              <p className="text-red-500 text-xs font-bold">{error}</p>
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 font-bold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}