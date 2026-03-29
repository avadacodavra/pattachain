
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Toaster } from 'react-hot-toast';
import { Navbar } from '@/components/Navbar';

import { InteractiveBackground } from '@/components/ui/InteractiveBackground';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ 
  weight: ['600', '700', '800'], 
  subsets: ['latin'],
  variable: '--font-poppins' 
});

export const metadata: Metadata = {
  title: 'PattaChain - Decentralized Land Registry',
  description: 'Blockchain-powered land governance with NFT ownership',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <InteractiveBackground />
        <Providers>
          <Navbar />
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
