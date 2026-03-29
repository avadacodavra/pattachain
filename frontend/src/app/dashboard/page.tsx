
'use client';

import * as React from 'react';
import { useAccount } from 'wagmi';
import { Loader2, Plus, MapPin, Ruler, LayoutDashboard, Search, Filter } from 'lucide-react';
import Link from 'next/link';

// Mock data remains same for now
const mockProperties = [
  {
    id: 1,
    location: "123 Blockchain Ave, Polygon City",
    area: 1200,
    price: "5000 MATIC",
    image: "https://placehold.co/600x400/png?text=Property+1",
    status: "Verified",
  },
  {
    id: 2,
    location: "456 Crypto Lane, Decentraland",
    area: 2500,
    price: "12000 MATIC",
    image: "https://placehold.co/600x400/png?text=Property+2",
    status: "Pending",
  },
];

export default function Dashboard() {
  const { isConnected, isConnecting } = useAccount();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (isConnecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center text-center bg-slate-50">
        <div className="card max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <LayoutDashboard size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-3 font-display text-slate-900">Connect Dashboard</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
               Connect your wallet to access your property portfolio, track transfers, and manage your land assets securely.
            </p>
             {/* The Connect Button is in Navbar, but maybe we can trigger it or just point to it. 
                 Since generic ConnectButton isn't exported easily as a standalone trigger without styling override, 
                 we'll rely on Navbar or user knowledge, or just render a dummy that says "Use Navbar" if needed.
                 For now, keeping it simple as per previous flow. */}
            <div className="p-4 bg-primary/10 rounded-xl text-sm text-primary font-medium">
                ↗ Use the Connect button in the top right to continue
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
              <h1 className="text-3xl font-bold font-display text-slate-900">Property Portfolio</h1>
              <p className="text-slate-500 mt-2">Manage your verified land assets and NFT titles</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="btn-secondary bg-white text-slate-700 border-slate-200">
                <Search size={18} />
                <span className="hidden sm:inline">Search</span>
             </button>
             <button className="btn-secondary bg-white text-slate-700 border-slate-200">
                <Filter size={18} />
                <span className="hidden sm:inline">Filter</span>
             </button>
             <Link href="/register" className="btn-primary">
                <Plus className="h-5 w-5" /> 
                <span className="hidden sm:inline">Register New Land</span>
                <span className="sm:hidden">Add</span>
             </Link>
          </div>
        </div>

        {/* content */}
        {mockProperties.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-slate-300 rounded-3xl bg-slate-50/50">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <MapPin size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No properties found</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">You haven't registered any land assets yet. Get started by minting your first property NFT.</p>
            <Link href="/register" className="btn-primary inline-flex">
              Register Property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockProperties.map((property) => (
              <Link href={`/property/${property.id}`} key={property.id} className="block group">
                <div className="card h-full p-0 overflow-hidden hover:border-primary/30 transition-all duration-300">
                  {/* Image Section */}
                  <div className="aspect-[4/3] w-full bg-slate-200 relative overflow-hidden">
                    {/* Badge */}
                    <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-bold text-slate-700 shadow-sm">
                        Token #{property.id}
                    </div>
                     {/* Overlay on hover */}
                     <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-300" />
                     <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-100 font-medium">
                        Property Image
                     </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-lg text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">{property.location}</h3>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm text-slate-600 border-b border-slate-100 pb-3">
                        <span className="flex items-center gap-2"><Ruler className="h-4 w-4 text-slate-400" /> Area</span>
                        <span className="font-medium text-slate-900">{property.area} sq.ft</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400" /> Location</span>
                        <span className="font-medium text-slate-900">On-Chain</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-0">
                        <div>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Est. Value</p>
                            <p className="font-bold text-lg text-slate-900">{property.price}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
