async function main() {
  console.log("Deploying LandRegistry only...");

  const landNFTAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const taxEscrowAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const LandRegistry = await ethers.getContractFactory("LandRegistry");
  const landRegistry = await LandRegistry.deploy(
    landNFTAddress,
    taxEscrowAddress
  );

  await landRegistry.waitForDeployment();

  console.log("LandRegistry deployed to:", await landRegistry.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
