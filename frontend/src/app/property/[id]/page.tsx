'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Loader2, MapPin, Ruler, User, Clock, ShieldCheck, FileText, ArrowUpRight } from 'lucide-react';
import { getLandByTokenId, type LandDetailsResponse } from '@/lib/api';
import { NETWORK } from '@/lib/config';

export default function PropertyDetails() {
  const params = useParams();
  const { id } = params;
  const [property, setProperty] = React.useState<LandDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (!id) {
      return;
    }

    let cancelled = false;

    const loadProperty = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await getLandByTokenId(String(id));
        if (!cancelled) {
          setProperty(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load property');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadProperty();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-3xl mx-auto pt-28 pb-12 px-4 text-center">
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">Property unavailable</h1>
        <p className="text-muted-foreground">{error || 'No property data found for this token.'}</p>
      </div>
    );
  }

  const registrationDate = property.blockchain.registrationDate
    ? new Date(property.blockchain.registrationDate).toLocaleString()
    : 'Unknown';
  const deedUrl = `https://gateway.pinata.cloud/ipfs/${property.database.ipfsDocumentHash}`;
  const txUrl = property.database.transactionHash
    ? `${NETWORK.blockExplorer}/tx/${property.database.transactionHash}`
    : '#';
  const shortOwner = `${property.database.owner.slice(0, 6)}...${property.database.owner.slice(-4)}`;

  return (
    <div className="max-w-7xl mx-auto pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-secondary shadow-2xl group flex items-center justify-center">
            <div className="font-medium text-muted-foreground">Property Image (Token #{id})</div>
            <div className="absolute top-4 right-4 rounded-full bg-background/90 px-3 py-1 text-xs font-bold text-foreground shadow-sm backdrop-blur">
              Token ID: #{id}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
            <h1 className="mb-6 text-3xl font-display font-bold text-foreground">{property.database.location}</h1>

            <div className="mb-8 flex flex-wrap gap-6 border-b border-border pb-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-primary">
                <MapPin className="h-5 w-5" />
                <span className="font-semibold">{property.database.location}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-accent-foreground">
                <Ruler className="h-5 w-5" />
                <span className="font-semibold">{property.database.area} sqft</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-[hsl(var(--secondary-foreground))]">
                <ShieldCheck className="h-5 w-5" />
                <span className="font-semibold">{property.blockchain.isActive ? 'Verified Title' : 'Inactive'}</span>
              </div>
            </div>

            <h3 className="mb-3 text-lg font-display font-bold text-foreground">Property Summary</h3>
            <p className="mb-8 leading-relaxed text-muted-foreground">
              This property record is synchronized between the PattaChain backend database and the Polygon Amoy smart contracts.
              The registered ULPIN is {property.database.ulpin}, and the deed document is stored on IPFS for tamper-evident verification.
            </p>

            <h3 className="mb-4 flex items-center gap-2 text-lg font-display font-bold text-foreground">
              <Clock className="h-5 w-5 text-primary" />
              Registration Details
            </h3>
            <div className="space-y-4">
              <DetailRow label="ULPIN" value={property.database.ulpin} />
              <DetailRow label="On-chain Area" value={`${property.blockchain.area} sqft`} />
              <DetailRow label="Registered At" value={registrationDate} />
              <DetailRow label="Document Hash" value={property.database.ipfsDocumentHash} />
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-1">
          <div className="card sticky top-24">
            <h3 className="mb-6 text-xl font-display font-bold text-foreground">Ownership Status</h3>

            <div className="mb-6 flex items-center gap-4 rounded-xl border border-primary/15 bg-primary/10 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[hsl(var(--chart-3))] text-white shadow-md">
                <User className="h-6 w-6" />
              </div>
              <div className="overflow-hidden">
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-primary">Current Owner</p>
                <p className="truncate font-mono text-sm font-bold text-foreground">{shortOwner}</p>
              </div>
            </div>

            <div className="mb-8 space-y-4">
              <div className="flex items-center justify-between border-b border-border py-2">
                <span className="text-muted-foreground">Token ID</span>
                <span className="text-lg font-bold text-foreground">#{property.database.tokenId}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border py-2">
                <span className="text-muted-foreground">Blockchain Status</span>
                <span className="font-medium text-foreground">{property.blockchain.isActive ? 'Active' : 'Inactive'}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/transfer" className="w-full btn-primary inline-flex justify-center">Initiate Transfer</Link>
              <a href={deedUrl} target="_blank" rel="noreferrer" className="w-full btn-secondary flex items-center justify-center gap-2">
                <FileText className="h-4 w-4" /> View Deed Document
              </a>
              <a href={txUrl} target="_blank" rel="noreferrer" className="w-full btn-secondary flex items-center justify-center gap-2">
                <ArrowUpRight className="h-4 w-4" /> View Registration TX
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/45 sm:flex-row">
      <div className="font-semibold text-foreground">{label}</div>
      <div className="mt-2 text-sm font-medium text-muted-foreground sm:mt-0 sm:text-right">{value}</div>
    </div>
  );
}
