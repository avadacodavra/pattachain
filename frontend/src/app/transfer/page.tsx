'use client';

import * as React from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { Loader2, CheckCircle, Clock, ArrowRightLeft, User, Building, AlertCircle, Landmark } from 'lucide-react';
import { getLandsByOwner, type LandRecord } from '@/lib/api';
import { CONTRACTS } from '@/utils/contracts';

export default function TransferProperty() {
  const { isConnected, address } = useAccount();
  const [selectedProperty, setSelectedProperty] = React.useState('');
  const [buyerAddress, setBuyerAddress] = React.useState('');
  const [salePrice, setSalePrice] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [transferStatus, setTransferStatus] = React.useState<'idle' | 'pending' | 'completed'>('idle');
  const [mounted, setMounted] = React.useState(false);
  const [properties, setProperties] = React.useState<LandRecord[]>([]);
  const [requestId, setRequestId] = React.useState<number | null>(null);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!isConnected || !address) {
      setProperties([]);
      return;
    }

    let cancelled = false;

    const loadProperties = async () => {
      try {
        const lands = await getLandsByOwner(address);
        if (!cancelled) {
          setProperties(lands);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(error instanceof Error ? error.message : 'Failed to load your properties');
        }
      }
    };

    void loadProperties();

    return () => {
      cancelled = true;
    };
  }, [address, isConnected]);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty || !buyerAddress || !salePrice) return;

    const ethereum = (window as Window & { ethereum?: ethers.Eip1193Provider }).ethereum;
    if (!ethereum) {
      toast.error('Wallet provider not found');
      return;
    }

    setIsLoading(true);

    try {
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const taxEscrow = new ethers.Contract(CONTRACTS.TaxEscrow.address, CONTRACTS.TaxEscrow.abi, signer);
      const parsedSalePrice = ethers.parseEther(salePrice);
      const taxAmount = await taxEscrow.calculateTax(parsedSalePrice);
      const tx = await taxEscrow.initiateTransfer(Number(selectedProperty), buyerAddress, parsedSalePrice, {
        value: taxAmount,
      });

      toast.loading('Waiting for blockchain confirmation...', { id: 'transfer' });
      const receipt = await tx.wait();

      const event = receipt.logs
        .map((log: ethers.Log | ethers.EventLog) => {
          try {
            return taxEscrow.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .find((parsed: ethers.LogDescription | null) => parsed?.name === 'TransferRequested');

      setRequestId(event ? Number(event.args.requestId) : null);
      setTransferStatus('pending');
      toast.success('Transfer request created successfully', { id: 'transfer' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Transfer failed', { id: 'transfer' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-card rounded-xl shadow-sm border border-border mb-4">
            <ArrowRightLeft className="text-primary w-8 h-8" />
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-3">Transfer Ownership</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">Initiate a secure, multi-signature property transfer. Requires approval from Seller, Buyer, and Registrar.</p>
        </div>

        {!isConnected ? (
          <div className="card text-center py-12">
            <h3 className="font-bold text-lg text-foreground">Wallet Not Connected</h3>
            <p className="text-muted-foreground mb-6">Please connect your wallet to access transfer features.</p>
            <div className="text-sm text-primary font-medium">Connect via the top-right button</div>
          </div>
        ) : (
          <div className="card shadow-2xl shadow-primary/10">
            {transferStatus === 'idle' ? (
              <form onSubmit={handleTransfer} className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-foreground">Select Property</label>
                    <span className="text-xs text-primary font-medium">{properties.length} loaded</span>
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Building size={18} />
                    </div>
                    <select
                      className="input-field pl-12 cursor-pointer bg-secondary/35"
                      value={selectedProperty}
                      onChange={(e) => setSelectedProperty(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select a property to transfer</option>
                      {properties.map((property) => (
                        <option key={property.tokenId} value={property.tokenId}>
                          {property.location} (Token #{property.tokenId})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold text-foreground">Buyer Wallet Address</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      className="input-field pl-12 font-mono text-sm"
                      placeholder="0x..."
                      value={buyerAddress}
                      onChange={(e) => setBuyerAddress(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground pl-1 flex items-center gap-1">
                    <AlertCircle size={12} /> Double check the address. Transfers are irreversible.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold text-foreground">Sale Price (POL)</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Landmark size={18} />
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="0.0001"
                      className="input-field pl-12 font-mono text-sm"
                      placeholder="0.0"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <button type="submit" className="w-full btn-primary h-12 text-base" disabled={isLoading || properties.length === 0}>
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin h-5 w-5" /> Initiating...
                      </span>
                    ) : 'Initiate Transfer Request'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-4">
                <div className="bg-primary/10 border border-primary/30 rounded-2xl p-6 text-center mb-8">
                  <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-primary">
                    <Clock className="w-8 h-8 animate-pulse" />
                  </div>
                  <h3 className="font-bold text-xl text-foreground mb-2">Request Pending</h3>
                  <p className="text-muted-foreground text-sm">Transfer request initiated successfully.<br />Waiting for multi-signature approvals.</p>
                  {requestId !== null && <p className="text-primary text-sm font-semibold mt-3">Request ID #{requestId}</p>}
                </div>

                <div className="space-y-3">
                  <ApprovalStep role="Seller (You)" status="signed" />
                  <ApprovalStep role="Buyer Agreement" status="pending" />
                  <ApprovalStep role="Registrar Verification" status="pending" />
                </div>

                <button
                  className="w-full mt-8 text-muted-foreground hover:text-foreground text-sm font-medium underline"
                  onClick={() => setTransferStatus('idle')}
                >
                  Start Another Transfer
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ApprovalStep({ role, status }: { role: string; status: 'signed' | 'pending' }) {
  const isSigned = status === 'signed';
  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border ${isSigned ? 'bg-secondary/50 border-secondary' : 'bg-card border-border'}`}>
      <div className="flex items-center gap-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isSigned ? 'bg-[hsl(var(--secondary-foreground))] border-[hsl(var(--secondary-foreground))] text-white' : 'bg-background border-border text-muted-foreground'}`}>
          {isSigned ? <CheckCircle size={16} /> : <Clock size={16} />}
        </div>
        <span className={`font-semibold ${isSigned ? 'text-[hsl(var(--secondary-foreground))]' : 'text-muted-foreground'}`}>{role}</span>
      </div>
      <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${isSigned ? 'bg-secondary text-[hsl(var(--secondary-foreground))]' : 'bg-muted text-muted-foreground'}`}>
        {status}
      </span>
    </div>
  );
}
