
'use client';

import { 
  ShieldCheck, 
  Zap, 
  Globe2, 
  FileJson, 
  Users, 
  Lock,
  ArrowUpRight 
} from 'lucide-react';

export function Features() {
  return (
    <section className="pb-24 pt-0 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">
            Everything you need to <span className="text-primary">manage land on-chain</span>
          </h2>
          <p className="text-slate-500 text-lg">
            PattaChain provides a comprehensive suite of tools to digitize, verify, and transfer property ownership with military-grade security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
          
          {/* Main Large Card - Security */}
          <div className="md:col-span-2 lg:col-span-2 row-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
               <ShieldCheck size={120} className="text-primary" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Bank-Grade Security</h3>
                <p className="text-slate-500">
                  Built on Polygon, ensuring every transaction is immutable and cryptographically secure. 
                  Say goodbye to forged documents and land grabbing.
                </p>
              </div>
            </div>
          </div>

          {/* Tall Card - Global Access */}
          <div className="md:col-span-1 lg:col-span-1 row-span-2 bg-slate-900 rounded-3xl p-8 shadow-xl shadow-slate-900/20 hover:-translate-y-1 transition-transform duration-300 group relative overflow-hidden text-white">
             <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             <div className="relative z-10 h-full flex flex-col">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white mb-auto backdrop-blur-sm">
                   <Globe2 size={24} />
                </div>
                <div className="mt-8">
                   <h3 className="text-xl font-bold mb-2">Global Access</h3>
                   <p className="text-slate-300 text-sm leading-relaxed">
                     Access your property records from anywhere in the world. Verify ownership instantly through our decentralized dApp.
                   </p>
                </div>
             </div>
          </div>

          {/* Small Card - Instant Transfer */}
             <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg shadow-slate-200/50 hover:border-primary/30 transition-colors group">
             <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:rotate-12 transition-transform">
                   <Zap size={20} />
                </div>
                <ArrowUpRight size={18} className="text-slate-300 group-hover:text-primary transition-colors" />
             </div>
             <h3 className="font-bold text-slate-900 mb-1">Instant Transfer</h3>
             <p className="text-sm text-slate-500">Atomic swaps for immediate ownership transfer.</p>
          </div>

          {/* Small Card - Smart Contracts */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg shadow-slate-200/50 hover:border-primary/30 transition-colors group">
             <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600 group-hover:rotate-12 transition-transform">
                   <FileJson size={20} />
                </div>
                <ArrowUpRight size={18} className="text-slate-300 group-hover:text-primary transition-colors" />
             </div>
             <h3 className="font-bold text-slate-900 mb-1">Smart Deeds</h3>
             <p className="text-sm text-slate-500">Self-executing contracts automate compliance.</p>
          </div>

          {/* Wide Card - Multi-Sig */}
             <div className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-white to-primary/5 rounded-3xl p-8 border border-slate-100 shadow-lg shadow-slate-200/50 flex flex-col md:flex-row items-center gap-8 group">
             <div className="flex-1">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm mb-4 border border-slate-100">
                   <Users size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Multi-Signature Governance</h3>
                <p className="text-slate-500">
                   Requires approval from Buyer, Seller, and Government Registrar for any transfer to verify authenticity.
                </p>
             </div>
             <div className="flex -space-x-4 pr-4 opacity-80 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0 duration-500">
                {[1,2,3].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center shadow-sm">
                     <Lock size={16} className="text-slate-400" />
                  </div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
