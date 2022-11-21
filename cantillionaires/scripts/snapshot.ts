// Demonstrates how to snapshot the Longnecks.
// Uses the Cantillionaires contract factory since that'll provide the config to call `ownerOf`, don't need the actual ABI or anything.

const fs = require('fs');
import { ethers } from "hardhat";

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
} 
const longneck = '0xC0C73CcFEE66eb400acCee23Fe70369186e4D3C9'

async function main() {
  const Cantillionaires = await ethers.getContractFactory('Cantillionaires');
  const t = await Cantillionaires.attach(longneck);
  const totalSupply = await t.totalSupply()
  for(let i = 1; i <= parseInt(totalSupply); i++){
    console.log(await t.ownerOf(i))
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

