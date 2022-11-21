import { ethers } from "hardhat";

async function main() {
  const Cantillionaires = await ethers.getContractFactory("Cantillionaires");
  const cantillionaires = await Cantillionaires.deploy(169, 2569, ethers.utils.parseEther("175"), "https://example.com/", "0x...");
  await cantillionaires.deployed();
  console.log(`Deployed to ${cantillionaires.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
