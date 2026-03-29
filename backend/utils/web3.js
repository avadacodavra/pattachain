const { ethers } = require('ethers');
const { CONTRACTS, NETWORK } = require('../config/contracts');

const getProvider = () => {
  return new ethers.JsonRpcProvider(NETWORK.rpcUrl);
};

const getWallet = () => {
  const provider = getProvider();
  return new ethers.Wallet(process.env.PRIVATE_KEY, provider);
};

const getLandNFTContract = () => {
  const wallet = getWallet();
  return new ethers.Contract(
    CONTRACTS.LandNFT.address,
    CONTRACTS.LandNFT.abi,
    wallet
  );
};

const getTaxEscrowContract = () => {
  const wallet = getWallet();
  return new ethers.Contract(
    CONTRACTS.TaxEscrow.address,
    CONTRACTS.TaxEscrow.abi,
    wallet
  );
};

const getLandRegistryContract = () => {
  const wallet = getWallet();
  return new ethers.Contract(
    CONTRACTS.LandRegistry.address,
    CONTRACTS.LandRegistry.abi,
    wallet
  );
};

module.exports = {
  getProvider,
  getWallet,
  getLandNFTContract,
  getTaxEscrowContract,
  getLandRegistryContract,
};