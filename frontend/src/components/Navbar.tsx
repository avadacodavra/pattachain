
'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Home, PlusCircle, ArrowRightLeft, LayoutDashboard, Menu, X } from 'lucide-react';
import { ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">
              P
            </div>
            <span className={`font-display text-xl font-bold tracking-tight ${isScrolled ? 'text-slate-900' : 'text-slate-900'}`}>
              PattaChain
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/50 backdrop-blur-sm">
            <NavLink href="/" active={pathname === '/'} icon={<Home size={16} />}>Home</NavLink>
            <NavLink href="/register" active={pathname === '/register'} icon={<PlusCircle size={16} />}>Register</NavLink>
            <NavLink href="/transfer" active={pathname === '/transfer'} icon={<ArrowRightLeft size={16} />}>Transfer</NavLink>
            <NavLink href="/dashboard" active={pathname === '/dashboard'} icon={<LayoutDashboard size={16} />}>Dashboard</NavLink>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
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
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-xl p-4 flex flex-col gap-2">
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
          ? 'bg-white text-primary shadow-sm' 
          : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: ReactNode; onClick: () => void }) {
    return (
        <Link href={href} onClick={onClick} className="block px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 font-medium">
            {children}
        </Link>
    )
}
