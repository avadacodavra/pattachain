
'use client';

import * as React from 'react';
import { useAccount } from 'wagmi';
import { Loader2, CheckCircle, Clock, ArrowRightLeft, User, Building, AlertCircle } from 'lucide-react';

export default function TransferProperty() {
  const { isConnected } = useAccount();
  const [selectedProperty, setSelectedProperty] = React.useState('');
  const [buyerAddress, setBuyerAddress] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [transferStatus, setTransferStatus] = React.useState<'idle' | 'pending' | 'completed'>('idle');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty || !buyerAddress) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setTransferStatus('pending');
    }, 2000);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        
        <div className="text-center mb-10">
           <div className="inline-flex items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-slate-100 mb-4">
              <ArrowRightLeft className="text-primary w-8 h-8" />
           </div>
           <h1 className="font-display text-4xl font-bold text-slate-900 mb-3">Transfer Ownership</h1>
           <p className="text-slate-600 max-w-lg mx-auto">Initiate a secure, multi-signature property transfer. Requires approval from Seller, Buyer, and Registrar.</p>
        </div>

        {!isConnected ? (
          <div className="card text-center py-12">
             <h3 className="font-bold text-lg text-slate-900">Wallet Not Connected</h3>
             <p className="text-slate-500 mb-6">Please connect your wallet to access transfer features.</p>
                <div className="text-sm text-primary font-medium">Connect via top right button ↗</div>
          </div>
        ) : (
          <div className="card shadow-2xl shadow-slate-200/50">
             {transferStatus === 'idle' ? (
                <form onSubmit={handleTransfer} className="space-y-8">
                    {/* Property Selection */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-slate-900">Select Property</label>
                            <span className="text-xs text-primary font-medium cursor-pointer">View Details</span>
                        </div>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Building size={18} />
                            </div>
                            <select 
                                className="input-field pl-12 cursor-pointer bg-slate-50 border-slate-200"
                                value={selectedProperty}
                                onChange={(e) => setSelectedProperty(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select a property to transfer</option>
                                <option value="1">123 Blockchain Ave (Token #1)</option>
                                <option value="2">456 Crypto Lane (Token #2)</option>
                            </select>
                        </div>
                    </div>

                    {/* Buyer Address */}
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-900">Buyer Wallet Address</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
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
                        <p className="text-xs text-slate-500 pl-1 flex items-center gap-1">
                            <AlertCircle size={12} /> Double check the address. Transfers are irreversible.
                        </p>
                    </div>

                    {/* Action */}
                    <div className="pt-4 border-t border-slate-100">
                        <button type="submit" className="w-full btn-primary h-12 text-base" disabled={isLoading}>
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
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-primary">
                            <Clock className="w-8 h-8 animate-pulse" />
                        </div>
                        <h3 className="font-bold text-xl text-slate-900 mb-2">Request Pending</h3>
                        <p className="text-slate-600 text-sm">Transfer request initiated successfully.<br/>Waiting for multi-signature approvals.</p>
                    </div>
                    
                    <div className="space-y-3">
                        <ApprovalStep role="Seller (You)" status="signed" />
                        <ApprovalStep role="Buyer Agreement" status="pending" />
                        <ApprovalStep role="Registrar Verification" status="pending" />
                    </div>

                    <button 
                        className="w-full mt-8 text-slate-500 hover:text-slate-900 text-sm font-medium underline" 
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

function ApprovalStep({ role, status }: { role: string, status: 'signed' | 'pending' }) {
    const isSigned = status === 'signed';
    return (
        <div className={`flex items-center justify-between p-4 rounded-xl border ${isSigned ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
            <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isSigned ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-300'}`}>
                    {isSigned ? <CheckCircle size={16} /> : <Clock size={16} />}
                </div>
                <span className={`font-semibold ${isSigned ? 'text-emerald-900' : 'text-slate-500'}`}>{role}</span>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${isSigned ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'}`}>
                {status}
            </span>
        </div>
    );
}
