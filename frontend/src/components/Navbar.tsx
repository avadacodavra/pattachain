
'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Home, PlusCircle, ArrowRightLeft, LayoutDashboard, Menu, Moon, SunMedium, X } from 'lucide-react';
import { ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { mounted, theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'bg-background/90 backdrop-blur-xl border-b border-border py-3 shadow-[0_10px_30px_-18px_rgba(10,37,64,0.45)]' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">
              P
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-foreground">
              PattaChain
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-card/70 p-1 rounded-full border border-border/70 backdrop-blur-sm shadow-sm">
            <NavLink href="/" active={pathname === '/'} icon={<Home size={16} />}>Home</NavLink>
            <NavLink href="/register" active={pathname === '/register'} icon={<PlusCircle size={16} />}>Register</NavLink>
            <NavLink href="/transfer" active={pathname === '/transfer'} icon={<ArrowRightLeft size={16} />}>Transfer</NavLink>
            <NavLink href="/dashboard" active={pathname === '/dashboard'} icon={<LayoutDashboard size={16} />}>Dashboard</NavLink>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={mounted && theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="hidden sm:inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/80 text-foreground shadow-sm transition-colors hover:bg-accent"
            >
              {mounted && theme === 'dark' ? <SunMedium size={18} /> : <Moon size={18} />}
            </button>
            <ConnectButton 
              showBalance={false}
              accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'full',
              }}
              chainStatus="icon"
            />
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-muted-foreground hover:bg-accent rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border shadow-xl p-4 flex flex-col gap-2">
             <button
               type="button"
               onClick={toggleTheme}
               className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-accent font-medium"
             >
               {mounted && theme === 'dark' ? <SunMedium size={18} /> : <Moon size={18} />}
               {mounted && theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
             </button>
             <MobileNavLink href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</MobileNavLink>
             <MobileNavLink href="/register" onClick={() => setIsMobileMenuOpen(false)}>Register Property</MobileNavLink>
             <MobileNavLink href="/transfer" onClick={() => setIsMobileMenuOpen(false)}>Transfer Ownership</MobileNavLink>
             <MobileNavLink href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</MobileNavLink>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, active, icon, children }: { href: string; active?: boolean; icon: ReactNode; children: ReactNode }) {
  return (
    <Link 
      href={href}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
        active 
          ? 'bg-background text-primary shadow-sm' 
          : 'text-muted-foreground hover:text-foreground hover:bg-background/70'
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: ReactNode; onClick: () => void }) {
    return (
        <Link href={href} onClick={onClick} className="block px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground font-medium">
            {children}
        </Link>
    )
}
