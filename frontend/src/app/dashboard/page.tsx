'use client';

import * as React from 'react';
import { useAccount } from 'wagmi';
import { Loader2, Plus, MapPin, Ruler, LayoutDashboard, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { getLandsByOwner, type LandRecord } from '@/lib/api';

export default function Dashboard() {
  const { isConnected, isConnecting, address } = useAccount();
  const [mounted, setMounted] = React.useState(false);
  const [properties, setProperties] = React.useState<LandRecord[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isConnected || !address) {
      setProperties([]);
      return;
    }

    let cancelled = false;

    const loadProperties = async () => {
      setIsLoading(true);
      setError('');

      try {
        const lands = await getLandsByOwner(address);
        if (!cancelled) {
          setProperties(lands);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load properties');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadProperties();

    return () => {
      cancelled = true;
    };
  }, [address, isConnected]);

  if (!mounted) return null;

  if (isConnecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center text-center bg-background">
        <div className="card max-w-md w-full p-8 rounded-2xl shadow-xl">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <LayoutDashboard size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-3 font-display text-foreground">Connect Dashboard</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Connect your wallet to access your property portfolio, track transfers, and manage your land assets securely.
          </p>
          <div className="p-4 bg-primary/10 rounded-xl text-sm text-primary font-medium">
            Use the Connect button in the top right to continue
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold font-display text-foreground">Property Portfolio</h1>
            <p className="text-muted-foreground mt-2">Manage your verified land assets and NFT titles</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-secondary">
              <Search size={18} />
              <span className="hidden sm:inline">Search</span>
            </button>
            <button className="btn-secondary">
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

        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-16 border border-dashed border-border rounded-3xl bg-secondary/30">
            <h3 className="text-lg font-semibold text-foreground mb-2">Unable to load properties</h3>
            <p className="text-muted-foreground max-w-md mx-auto">{error}</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-border rounded-3xl bg-secondary/30">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
              <MapPin size={24} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No properties found</h3>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">You have not registered any land assets yet. Get started by minting your first property NFT.</p>
            <Link href="/register" className="btn-primary inline-flex">
              Register Property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Link href={`/property/${property.tokenId}`} key={property.tokenId} className="block group">
                <div className="card h-full p-0 overflow-hidden hover:border-primary/30 transition-all duration-300">
                  <div className="aspect-[4/3] w-full bg-secondary relative overflow-hidden">
                    <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-background/90 backdrop-blur rounded-full text-xs font-bold text-foreground shadow-sm">
                      Token #{property.tokenId}
                    </div>
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/80 font-medium">
                      Property Image
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">{property.location}</h3>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm text-muted-foreground border-b border-border pb-3">
                        <span className="flex items-center gap-2"><Ruler className="h-4 w-4 text-muted-foreground" /> Area</span>
                        <span className="font-medium text-foreground">{property.area} sq.ft</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> ULPIN</span>
                        <span className="font-medium text-foreground">{property.ulpin}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-0">
                      <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Registration</p>
                        <p className="font-bold text-lg text-foreground">
                          {property.registrationDate ? new Date(property.registrationDate).toLocaleDateString() : 'On-chain'}
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-secondary/70 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all">
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
