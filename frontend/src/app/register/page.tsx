
'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '@/utils/contracts';
import toast from 'react-hot-toast';
import { Upload, FileText, MapPin, Ruler, Loader2, Info } from 'lucide-react';
import { uploadToIPFS } from '@/utils/ipfs';

export default function RegisterPage() {
  const { isConnected } = useAccount();
  const [formData, setFormData] = useState({
    ulpin: '',
    ipfsHash: '',
    area: '',
    location: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 35 });

  const { writeContract, data: hash, isPending: isWritePending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error('Please connect your wallet');
      return;
    }
    // ... logic remains same ...
    try {
      let ipfsHash = formData.ipfsHash;
      if (file) {
          toast.loading('Uploading to IPFS...', { id: 'ipfs' });
          ipfsHash = await uploadToIPFS(file);
          toast.success('Uploaded to IPFS!', { id: 'ipfs' });
      } else {
           ipfsHash = 'QmPlaceholderHash'; 
      }
      toast.loading('Please confirm transaction...', { id: 'tx' });
      writeContract({
        address: CONTRACTS.LandNFT.address as `0x${string}`,
        abi: CONTRACTS.LandNFT.abi,
        functionName: 'registerLand',
        args: [
          formData.ulpin,
          ipfsHash,
          BigInt(formData.area || 0),
          formData.location,
        ],
      }, {
        onSuccess: () => toast.loading('Waiting for confirmation...', { id: 'tx' }),
        onError: (e) => toast.error('Failed: ' + e.message, { id: 'tx' })
      });
    } catch (e: any) {
      toast.error('Error: ' + e.message);
    }
  };

  if (isSuccess) {
    toast.success('Land registered successfully!', { id: 'tx' });
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
  };

  return (
    <div
      className="min-h-screen bg-slate-50 pt-24 pb-12 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 50, y: 35 })}
      style={
        {
          '--mx': `${mousePos.x}%`,
          '--my': `${mousePos.y}%`,
        } as React.CSSProperties
      }
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-slate-50/70 to-slate-100/90" />
        <div
          className="absolute inset-0"
          style={
            {
              background:
                'radial-gradient(700px circle at var(--mx) var(--my), rgba(14,165,233,0.18), transparent 55%), radial-gradient(520px circle at calc(var(--mx) - 15%) calc(var(--my) + 10%), rgba(99,102,241,0.15), transparent 60%)',
            } as React.CSSProperties
          }
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.2)_1px,transparent_1px)] bg-[size:80px_80px] opacity-40" />
      </div>

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-bold text-slate-900 mb-3">Register New Land</h1>
          <p className="text-slate-600">Mint a new property NFT by verifying land details and uploading deeds.</p>
        </div>

        <div className="card border-t-4 border-t-primary">
           {/* Form Header */}
           <div className="mb-8 p-4 bg-primary/10 rounded-xl border border-primary/30 flex gap-3 items-start">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm text-primary/90">
                <p className="font-semibold mb-1">Registration Requirements</p>
                <p className="opacity-90">Ensure you have the valid ULPIN and original sale deed PDF ready. This action will mint a permanent NFT record on the Polygon blockchain.</p>
              </div>
           </div>

           <form onSubmit={handleSubmit} className="space-y-6">
             <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <FileText size={16} className="text-slate-400" /> ULPIN Number
                    </label>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. 1234-5678-9012"
                        value={formData.ulpin}
                        onChange={(e) => setFormData({...formData, ulpin: e.target.value})}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Ruler size={16} className="text-slate-400" /> Total Area (sq.ft)
                    </label>
                    <input
                        type="number"
                        className="input-field"
                        placeholder="e.g. 1200"
                        value={formData.area}
                        onChange={(e) => setFormData({...formData, area: e.target.value})}
                        required
                    />
                </div>
             </div>

             <div className="space-y-2">
                 <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <MapPin size={16} className="text-slate-400" /> Physical Address
                 </label>
                 <input
                     type="text"
                     className="input-field"
                     placeholder="Property full address..."
                     value={formData.location}
                     onChange={(e) => setFormData({...formData, location: e.target.value})}
                     required
                 />
             </div>

             <div className="space-y-2 pt-2">
                 <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                    <Upload size={16} className="text-slate-400" /> Upload Deed (PDF)
                 </label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                    <input 
                        type="file" 
                        accept=".pdf"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => e.target.files && setFile(e.target.files[0])}
                    />
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                            <Upload size={20} />
                        </div>
                        <p className="font-medium text-slate-900">
                            {file ? file.name : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-slate-500">PDF up to 10MB</p>
                    </div>
                 </div>
             </div>

             <div className="pt-6">
                <button
                    type="submit"
                    disabled={isWritePending || isConfirming || !isConnected}
                    className="w-full btn-primary h-12 text-base shadow-xl shadow-primary/20"
                >
                    {isWritePending || isConfirming ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="animate-spin h-5 w-5" /> Processing Transaction...
                        </span>
                    ) : 'Mint Property NFT'}
                </button>
             </div>
           </form>
        </div>
      </div>
    </div>
  );
}
