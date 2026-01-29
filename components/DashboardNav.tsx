'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { 
  HomeIcon, 
  BookOpenIcon, 
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon 
} from '@heroicons/react/24/outline';
import { useLanguage } from '@/app/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-full shadow-sm">
      <div className="p-6 flex-1">
        <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter">
          HEBREW MASTER
        </h2>
        
        <nav className="space-y-2">
          <NavLink 
            href="/dashboard" 
            label={t('nav.dashboard')}
            icon={HomeIcon} 
            isActive={pathname === '/dashboard'} 
          />
          <NavLink 
            href="/dashboard/vocabulary" 
            label={t('nav.vocabulary')}
            icon={BookOpenIcon} 
            isActive={pathname === '/dashboard/vocabulary'} 
          />
          <NavLink 
            href="/dashboard/settings" 
            label={t('nav.settings')}
            icon={Cog6ToothIcon} 
            isActive={pathname === '/dashboard/settings'} 
          />
        </nav>
      </div>

      {/* Language Switcher */}
      <div className="px-6 py-4">
        <LanguageSwitcher />
      </div>

      {/* Logout Button at the bottom */}
      <div className="p-4 border-t border-slate-50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          <span>{t('nav.logout')}</span>
        </button>
      </div>
    </aside>
  );
}

function NavLink({ href, label, icon: Icon, isActive }: { 
  href: string, 
  label: string, 
  icon: any, 
  isActive: boolean 
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
        isActive 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
}
