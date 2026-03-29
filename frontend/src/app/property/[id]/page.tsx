
'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { MapPin, Ruler, User, Clock, ShieldCheck, FileText, ArrowUpRight } from 'lucide-react';

const mockProperty = {
  id: 1,
  location: "123 Blockchain Ave, Polygon City",
  area: 1200,
  owner: "0x123...abc",
  value: "5000 MATIC",
  image: "https://placehold.co/800x400/png",
  description: "A beautiful plot located in the heart of the crypto valley. Perfect for building your decentralized dream home. Features include smart contract-backed security and instant transferability.",
  history: [
    { date: "2023-10-15", event: "Transfer", from: "0x987...zyx", to: "0x123...abc", txHash: "0xabc..." },
    { date: "2023-01-20", event: "Minted", from: "Null", to: "0x987...zyx", txHash: "0xdef..." },
  ]
};

export default function PropertyDetails() {
  const params = useParams();
  const { id } = params; 

  // In a real app, fetch property details by ID
  const property = mockProperty; 

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image and Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl overflow-hidden shadow-2xl relative aspect-video flex items-center justify-center bg-gray-100 group">
             {/* Image Placeholder */}
             <div className="text-gray-400 font-medium">Property Image (Token #{id})</div>
             <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                Token ID: #{id}
             </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-6">{property.location}</h1>
            
            <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-8 border-b border-gray-100 pb-8">
               <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
                 <MapPin className="h-5 w-5" /> <span className="font-semibold">Polygon City</span>
               </div>
               <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg">
                 <Ruler className="h-5 w-5" /> <span className="font-semibold">{property.area} sqft</span>
               </div>
               <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
                 <ShieldCheck className="h-5 w-5" /> <span className="font-semibold">Verified Title</span>
               </div>
            </div>

            <h3 className="text-lg font-bold mb-3 font-display">Description</h3>
            <p className="text-gray-600 leading-relaxed mb-8">
              {property.description}
            </p>
            
            <h3 className="text-lg font-bold mb-4 font-display flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" /> Ownership History
            </h3>
            <div className="space-y-4">
                {property.history.map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                        <div className="space-y-1">
                            <div className="font-semibold flex items-center gap-2 text-gray-900">
                                {item.event}
                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wide">{item.event}</span>
                            </div>
                            <div className="text-sm text-gray-500 font-mono">
                                <span className="text-gray-400">From:</span> {item.from} <span className="text-gray-400">→ To:</span> {item.to}
                            </div>
                        </div>
                        <div className="mt-2 sm:mt-0 text-sm text-right">
                            <div className="text-gray-500 font-medium mb-1">{item.date}</div>
                            <a href="#" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-xs hover:underline">
                                View TX <ArrowUpRight className="h-3 w-3 ml-1" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Ownership & Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card sticky top-24">
            <h3 className="text-xl font-bold font-display mb-6">Ownership Status</h3>
            
            <div className="flex items-center gap-4 mb-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                  <User className="h-6 w-6" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-wide mb-1">Current Owner</p>
                  <p className="text-sm font-bold text-gray-900 font-mono truncate">{property.owner}</p>
                </div>
            </div>

            <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Estimated Value</span>
                  <span className="font-bold text-gray-900 text-lg">{property.value}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Last Transfer</span>
                  <span className="font-medium text-gray-900">Oct 15, 2023</span>
                </div>
            </div>

            <div className="space-y-3">
               <button className="w-full btn-primary">
                 Initiate Transfer
               </button>
               <button className="w-full btn-secondary flex items-center justify-center gap-2">
                 <FileText className="h-4 w-4" /> View Deed Document
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
