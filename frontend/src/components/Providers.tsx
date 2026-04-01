
'use client';

import * as React from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import { darkTheme, getDefaultConfig, RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from '@/components/ThemeProvider';
import { APP_CONFIG } from '@/lib/config';

const config = getDefaultConfig({
  appName: 'PattaChain',
  projectId: APP_CONFIG.walletConnectProjectId,
  chains: [polygonAmoy],
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RainbowKitThemeBridge>{children}</RainbowKitThemeBridge>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function RainbowKitThemeBridge({ children }: { children: React.ReactNode }) {
  const { mounted, theme } = useTheme();

  const rainbowTheme = mounted && theme === 'dark'
    ? darkTheme({
        accentColor: 'hsl(28 88% 58%)',
        accentColorForeground: 'hsl(210 40% 98%)',
        borderRadius: 'medium',
        fontStack: 'system',
        overlayBlur: 'small',
      })
    : lightTheme({
        accentColor: 'hsl(203 74% 36%)',
        accentColorForeground: 'hsl(210 40% 98%)',
        borderRadius: 'medium',
        fontStack: 'system',
        overlayBlur: 'small',
      });

  return <RainbowKitProvider theme={rainbowTheme}>{children}</RainbowKitProvider>;
}
