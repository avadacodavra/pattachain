
import LandNFTArtifact from '../shared/contracts/LandNFT.json';
import TaxEscrowArtifact from '../shared/contracts/TaxEscrow.json';
import LandRegistryArtifact from '../shared/contracts/LandRegistry.json';

export const CONTRACTS = {
  LandNFT: {
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    abi: LandNFTArtifact.abi,
  },
  TaxEscrow: {
    address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    abi: TaxEscrowArtifact.abi,
  },
  LandRegistry: {
    address: '0x34c543bAaca623d391D0407190DFE680AE068142A',
    abi: LandRegistryArtifact.abi,
  },
} as const;

export const NETWORK = {
  chainId: 80002,
  name: 'Polygon Amoy Testnet',
  rpcUrl: 'https://rpc-amoy.polygon.technology/',
  blockExplorer: 'https://amoy.polygonscan.com/',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
};
