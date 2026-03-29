const LandNFTArtifact = require('../shared/LandNFT.json');
const TaxEscrowArtifact = require('../shared/TaxEscrow.json');
const LandRegistryArtifact = require('../shared/LandRegistry.json');

const CONTRACTS = {
  LandNFT: {
    address: process.env.LANDNFT_ADDRESS,
    abi: LandNFTArtifact.abi,
  },
  TaxEscrow: {
    address: process.env.TAXESCROW_ADDRESS,
    abi: TaxEscrowArtifact.abi,
  },
  LandRegistry: {
    address: process.env.LANDREGISTRY_ADDRESS,
    abi: LandRegistryArtifact.abi,
  },
};

const NETWORK = {
  chainId: 80002,
  name: 'Polygon Amoy Testnet',
  rpcUrl: process.env.POLYGON_AMOY_RPC,
};

module.exports = { CONTRACTS, NETWORK };