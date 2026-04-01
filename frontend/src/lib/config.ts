const DEFAULT_BACKEND_URL = 'http://localhost:5000';
const DEFAULT_AMOY_RPC = 'https://rpc-amoy.polygon.technology/';

export const APP_CONFIG = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || DEFAULT_BACKEND_URL,
  walletConnectProjectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '9f461dc542d9df0b784f72f9e480cc68',
};

export const NETWORK = {
  chainId: 80002,
  name: 'Polygon Amoy Testnet',
  rpcUrl: process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC || DEFAULT_AMOY_RPC,
  blockExplorer: 'https://amoy.polygonscan.com/',
  nativeCurrency: {
    name: 'POL',
    symbol: 'POL',
    decimals: 18,
  },
} as const;
