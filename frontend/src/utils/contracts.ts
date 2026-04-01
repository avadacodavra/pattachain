
import LandNFTArtifact from '../shared/contracts/LandNFT.json';
import TaxEscrowArtifact from '../shared/contracts/TaxEscrow.json';
import LandRegistryArtifact from '../shared/contracts/LandRegistry.json';

export const CONTRACTS = {
  LandNFT: {
    address: (process.env.NEXT_PUBLIC_LANDNFT_ADDRESS ||
      '0x5FbDB2315678afecb367f032d93F642f64180aa3') as `0x${string}`,
    abi: LandNFTArtifact.abi,
  },
  TaxEscrow: {
    address: (process.env.NEXT_PUBLIC_TAXESCROW_ADDRESS ||
      '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512') as `0x${string}`,
    abi: TaxEscrowArtifact.abi,
  },
  LandRegistry: {
    address: (process.env.NEXT_PUBLIC_LANDREGISTRY_ADDRESS ||
      '0x34c543bAca623d391D0407190DFE680AE068142A') as `0x${string}`,
    abi: LandRegistryArtifact.abi,
  },
} as const;
