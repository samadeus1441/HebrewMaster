'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { createBrowserClient } from '@supabase/ssr';
import { 
  HomeIcon, 
  LanguageIcon, 
  BookOpenIcon, 
  QueueListIcon, 
  SparklesIcon,
  AcademicCapIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon 
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useState, useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  const [supabase] = useState(() => 
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  // משיכת פרטי המשתמש בזמן הטעינה
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserEmail(user.email ?? null);
    };
    getUser();
  }, [supabase]);

  const links = [
    { name: 'My Path', href: '/dashboard', icon: HomeIcon },
    { name: 'Alphabet', href: '/dashboard/alphabet', icon: LanguageIcon },
    { name: 'Nikud', href: '/dashboard/nikud', icon: AcademicCapIcon },
    { name: 'Vocabulary', href: '/dashboard/vocabulary', icon: BookOpenIcon },
    { name: 'Flashcards', href: '/dashboard/practice', icon: QueueListIcon },
    { name: 'Quiz Mode', href: '/dashboard/quiz', icon: SparklesIcon, special: true },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="flex h-screen bg-slate-50" dir="ltr">
      <Toaster position="top-center" />
      
      {/* כפתור המבורגר למובייל */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-slate-900 text-white rounded-lg shadow-lg"
        >
          {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={clsx(
        "bg-slate-900 text-white flex flex-col shadow-xl transition-all duration-300 z-40",
        {
          "fixed inset-0 w-full": isMobileMenuOpen,
          "hidden md:flex md:w-64 md:static": !isMobileMenuOpen
        }
      )}>
        <div className="p-8">
          <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            HEBREW MASTER
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const LinkIcon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link 
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={clsx(
                  "flex items-center space-x-3 p-3 rounded-2xl transition-all font-medium",
                  {
                    "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 font-bold": isActive,
                    "hover:bg-white/10 text-slate-300": !isActive,
                    "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20": link.special && !isActive
                  }
                )}
              >
                <LinkIcon className="w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* פאנל משתמש בתחתית */}
        <div className="p-6 border-t border-white/5 space-y-4">
          {userEmail && (
            <div className="flex items-center space-x-3 p-2 bg-white/5 rounded-2xl border border-white/5">
              <UserCircleIcon className="w-10 h-10 text-indigo-400 flex-none" />
              <div className="overflow-hidden">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Student</p>
                <p className="text-sm text-slate-200 truncate font-medium">{userEmail}</p>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <Link href="/dashboard/settings" className="flex items-center space-x-3 p-3 rounded-xl text-slate-400 hover:text-white transition-colors">
              <Cog6ToothIcon className="w-5 h-5" />
              <span>Settings</span>
            </Link>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 pt-20 md:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}