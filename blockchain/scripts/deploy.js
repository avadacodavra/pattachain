const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

async function main() {
  const { ethers, network } = hre;
  const [deployer] = await ethers.getSigners();

  console.log(`Deploying contracts to ${network.name}...`);
  console.log(`Deployer: ${deployer.address}`);

  const LandNFT = await ethers.getContractFactory("LandNFT");
  const landNFT = await LandNFT.deploy();
  await landNFT.waitForDeployment();
  const landNFTAddress = await landNFT.getAddress();
  console.log("LandNFT deployed to:", landNFTAddress);

  const TaxEscrow = await ethers.getContractFactory("TaxEscrow");
  const taxEscrow = await TaxEscrow.deploy(landNFTAddress, deployer.address);
  await taxEscrow.waitForDeployment();
  const taxEscrowAddress = await taxEscrow.getAddress();
  console.log("TaxEscrow deployed to:", taxEscrowAddress);

  const LandRegistry = await ethers.getContractFactory("LandRegistry");
  const landRegistry = await LandRegistry.deploy(
    landNFTAddress,
    taxEscrowAddress
  );
  await landRegistry.waitForDeployment();
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
