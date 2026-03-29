
'use client';

import Link from 'next/link';
import { ArrowRight, Shield, CheckCircle2 } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-32 pb-12 overflow-hidden bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
           
           {/* Left Content */}
           <div className="flex-1 space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors cursor-default border border-primary/30">
                 <span className="relative flex h-2 w-2">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                 </span>
                 <span className="text-primary font-bold text-xs tracking-wide uppercase">LIVE ON POLYGON AMOY</span>
              </div>
              
              {/* Heading */}
              <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                The Future of <br/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60 inline-block hover:scale-[1.02] transition-transform origin-left pb-2">
                  Land Registry
                </span>
              </h1>
              
              {/* Description */}
              <p className="text-lg text-slate-500 leading-relaxed max-w-xl opacity-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                Secure, transparent, and immutable property ownership powered by the blockchain. Eliminate fraud, reduce paperwork, and transfer assets instantly with PattaChain's decentralized ledger application.
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4 pt-2 opacity-0 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                 <Link href="/register" className="group bg-slate-900 text-white font-medium py-3.5 px-8 rounded-xl hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 transition-all shadow-lg shadow-slate-900/20 flex items-center gap-2 active:scale-95">
                    Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                 </Link>
                 <Link href="/dashboard" className="bg-white text-slate-700 font-medium py-3.5 px-8 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95">
                    View Demo Property
                 </Link>
              </div>

              {/* Trusted By */}
              <div className="pt-6 flex items-center gap-4 opacity-0 animate-fade-in" style={{ animationDelay: '0.7s' }}>
                  <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map((i) => (
                          <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-500 z-${10-i} ring-2 ring-transparent hover:ring-primary/30 transition-all cursor-default`}>
                              U{i}
                          </div>
                      ))}
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-500 z-0">
                          +2k
                      </div>
                  </div>
                  <div className="text-sm">
                      <span className="font-bold text-slate-900">Trusted by</span> <span className="text-slate-500">2,000+ landowners worldwide</span>
                  </div>
              </div>
           </div>

           {/* Right Concept Visual */}
           <div className="flex-1 w-full max-w-xl relative opacity-0 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              {/* Background Stack Effect */}
              <div className="absolute top-4 -right-4 w-full h-full bg-slate-100 rounded-[2rem] -rotate-2 animate-pulse-slow"></div>
              <div className="absolute -top-4 -left-4 w-full h-full bg-primary/10 rounded-[2rem] rotate-2"></div>
              
              {/* Main Card */}
              <div className="relative bg-white rounded-[2rem] p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 hover:rotate-1 transition-transform duration-500 hover:shadow-primary/10 animate-float will-change-transform">
                  
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-8">
                      <div className="flex gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                              <Shield size={24} />
                          </div>
                          <div>
                              <h3 className="font-bold text-slate-900 text-lg">Certificate of Ownership</h3>
                              <p className="text-slate-400 text-xs font-mono mt-0.5">ULPIN: 4921-9382-1029</p>
                          </div>
                      </div>
                      <div className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full flex items-center gap-1.5 shadow-sm border border-green-100">
                          <CheckCircle2 size={12} /> Verified
                      </div>
                  </div>

                  {/* Map Placeholder */}
                  <div className="w-full h-64 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 flex items-center justify-center mb-8 relative overflow-hidden group cursor-crosshair">
                      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-100 group-hover:scale-110 transition-transform duration-700"></div>
                      <span className="text-slate-400 font-medium z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-slate-100 group-hover:scale-105 transition-transform">Interactive Map View</span>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors">
                          <p className="text-xs text-slate-500 font-medium mb-1">Land Value</p>
                          <p className="text-xl font-bold text-slate-900">12,500 MATIC</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors">
                          <p className="text-xs text-slate-500 font-medium mb-1">Area Size</p>
                          <p className="text-xl font-bold text-slate-900">2,400 sq.ft</p>
                      </div>
                  </div>
              </div>
           </div>
        </div>

      </div>
    </section>
  );
}
