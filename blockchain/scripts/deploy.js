const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

async function deployWithBalanceCheck(contractName, factory, args, signer) {
  const balance = await hre.ethers.provider.getBalance(signer.address);
  const deploymentTx = await factory.getDeployTransaction(...args);
  const feeData = await hre.ethers.provider.getFeeData();

  const gasLimit =
    deploymentTx.gasLimit ?? (await hre.ethers.provider.estimateGas(deploymentTx));
  const gasPrice =
    deploymentTx.gasPrice ??
    feeData.gasPrice ??
    feeData.maxFeePerGas;

  if (!gasPrice) {
    throw new Error(`Could not determine gas price for ${contractName} deployment.`);
  }

  const estimatedCost = gasLimit * gasPrice;

  console.log(
    `${contractName}: wallet balance ${hre.ethers.formatEther(balance)} MATIC, estimated deploy cost ${hre.ethers.formatEther(estimatedCost)} MATIC`
  );

  if (balance < estimatedCost) {
    throw new Error(
      `${contractName} deployment needs about ${hre.ethers.formatEther(
        estimatedCost
      )} MATIC but wallet only has ${hre.ethers.formatEther(balance)} MATIC.`
    );
  }

  const contract = await factory.deploy(...args);
  await contract.waitForDeployment();
  return contract;
}

async function main() {
  const { ethers, network } = hre;
  const [deployer] = await ethers.getSigners();

  console.log(`Deploying contracts to ${network.name}...`);
  console.log(`Deployer: ${deployer.address}`);

  const LandNFT = await ethers.getContractFactory("LandNFT");
  const landNFT = await deployWithBalanceCheck("LandNFT", LandNFT, [], deployer);
  const landNFTAddress = await landNFT.getAddress();
  console.log("LandNFT deployed to:", landNFTAddress);

  const TaxEscrow = await ethers.getContractFactory("TaxEscrow");
  const taxEscrow = await deployWithBalanceCheck(
    "TaxEscrow",
    TaxEscrow,
    [landNFTAddress, deployer.address],
    deployer
  );
  const taxEscrowAddress = await taxEscrow.getAddress();
  console.log("TaxEscrow deployed to:", taxEscrowAddress);

  const LandRegistry = await ethers.getContractFactory("LandRegistry");
  const landRegistry = await deployWithBalanceCheck(
    "LandRegistry",
    LandRegistry,
    [landNFTAddress, taxEscrowAddress],
    deployer
  );
  const landRegistryAddress = await landRegistry.getAddress();
  console.log("LandRegistry deployed to:", landRegistryAddress);

  const deployment = {
    network: network.name,
    chainId: Number(network.config.chainId || 0),
    LandNFT: landNFTAddress,
    TaxEscrow: taxEscrowAddress,
    LandRegistry: landRegistryAddress,
    Registrar: deployer.address,
    deployer: deployer.address,
  };

  const deploymentPath = path.join(__dirname, "..", "deployment.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));

  console.log(`Deployment saved to ${deploymentPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
