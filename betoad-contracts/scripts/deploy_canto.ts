// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, artifacts, run } from "hardhat";
import { BaseContract, Signer } from "ethers";
import { mine, setBalance } from "@nomicfoundation/hardhat-network-helpers";
import { Cipher } from "crypto";
import { increase } from "@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time";
import { notEqual } from "assert";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const newDeploy = true;

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.

  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  await run("compile");
  const [deployer] = await ethers.getSigners();
  const latestBlockNumber = (await ethers.provider.getBlock("latest")).number;

  const NOTE_ADDRESS = "0x4e71A2E537B7f9D9413D3991D37958c0b5e1e503";
  const WCANTO_ADDRESS = "0x826551890Dc65655a0Aceca109aB11AbDbD7a07B";
  const FACTORY_ADDRESS = "0xE387067f12561e579C5f7d4294f51867E0c1cFba";
  const ROUTER_ADDRESS = "0xa252eEE9BDe830Ca4793F054B506587027825a8e";

  let BETO_ADDRESS = "0x4A6358b5d90818446BeD6CFd8821b5B83C0C92c5";
  let CHIP_ADDRESS = "";

  const Gov = await ethers.getContractFactory("Gov");
  const gov = await Gov.deploy();
  console.log("Deployed Gov: ", gov.address);

  const ACCOUNT1 = "0x5478e0d48d935E49A715b6d666729fd40ec2eBcf";
  const ACCOUNT2 = "0x51037D82783150B1578cc4E5f47d97a229C7308F";

  const Beto = await ethers.getContractFactory("ERC20Mint");
  if (newDeploy) {
    const beto = await Beto.deploy();
    BETO_ADDRESS = beto.address;
    await beto.addMinter(deployer.address);
    await beto.mint(
      deployer.address,
      ethers.BigNumber.from(10).pow(18).mul(1_000_000_000)
    );
    await beto.mint(
      ACCOUNT1,
      ethers.BigNumber.from(10).pow(18).mul(1_000_000_000)
    );
    await beto.mint(
      ACCOUNT2,
      ethers.BigNumber.from(10).pow(18).mul(1_000_000_000)
    );
    await beto.transferOwnership(gov.address);
  }
  console.log("Deployed BETO: ", BETO_ADDRESS);

  const Chip = await ethers.getContractFactory("Chip");
  const chip = await Chip.deploy(
    BETO_ADDRESS,
    NOTE_ADDRESS,
    ROUTER_ADDRESS,
    FACTORY_ADDRESS
  );
  CHIP_ADDRESS = chip.address;

  const House = await ethers.getContractFactory("House");
  const house = await House.deploy(
    BETO_ADDRESS,
    NOTE_ADDRESS,
    CHIP_ADDRESS,
    ROUTER_ADDRESS
  );
  let tx = await house.transferOwnership(gov.address);
  await tx.wait();
  console.log("Deployed House: ", house.address);

  const Random = await ethers.getContractFactory("Random");
  const random = await Random.deploy();
  tx = await random.transferOwnership(gov.address);
  await tx.wait();
  console.log("Deployed Random: ", random.address);

  const Dice = await ethers.getContractFactory("Dice");
  const dice = await Dice.deploy();
  tx = await dice.transferOwnership(gov.address);
  await tx.wait();
  console.log("Deployed Dice: ", dice.address);

  const Treasury = await ethers.getContractFactory("Treasury");
  const treasury = await Treasury.deploy();
  tx = await treasury.transferOwnership(gov.address);
  await tx.wait();
  console.log("Deployed Treasury: ", treasury.address);

  const Rewarder = await ethers.getContractFactory("Rewarder");
  const rewarder = await Rewarder.deploy();
  tx = await rewarder.transferOwnership(gov.address);
  await tx.wait();
  console.log("Deployed Rewarder: ", rewarder.address);

  const Collector = await ethers.getContractFactory("Collector");
  const collector = await Collector.deploy(
    BETO_ADDRESS,
    NOTE_ADDRESS,
    ROUTER_ADDRESS
  );
  tx = await collector.transferOwnership(gov.address);
  await tx.wait();
  console.log("Deployed Collector: ", collector.address);

  const Distributor = await ethers.getContractFactory("Distributor");
  const distributor = await Distributor.deploy();
  tx = await distributor.transferOwnership(gov.address);
  await tx.wait();
  console.log("Deployed Distributor: ", distributor.address);

  const Vesting = await ethers.getContractFactory("Vesting");
  const vesting = await Vesting.deploy();
  tx = await vesting.setBeto(BETO_ADDRESS);
  await tx.wait();
  console.log("Deployed Vesting: ", vesting.address);

  await setBalance(
    deployer.address,
    ethers.BigNumber.from(10).pow(18).mul(100_000_000_000)
  );
  await setBalance(
    ACCOUNT1,
    ethers.BigNumber.from(10).pow(18).mul(100_000_000_000)
  );
  await setBalance(
    ACCOUNT2,
    ethers.BigNumber.from(10).pow(18).mul(100_000_000_000)
  );

  const wcanto = await ethers.getContractAt("IWCANTO", WCANTO_ADDRESS);
  await wcanto.deposit({
    value: ethers.BigNumber.from(10).pow(18).mul(1_000_000_000),
  });

  const router = await ethers.getContractAt("BaseV1Router01", ROUTER_ADDRESS);
  await router.swapExactCANTOForTokens(
    0,
    [{ from: WCANTO_ADDRESS, to: NOTE_ADDRESS, stable: false }],
    deployer.address,
    Math.floor(Date.now() / 1000) + 1000,
    {
      value: ethers.BigNumber.from(10).pow(18).mul(1_000_000),
    }
  );

  const beto = await ethers.getContractAt("IERC20", BETO_ADDRESS);
  const note = await ethers.getContractAt("IERC20", NOTE_ADDRESS);
  console.log("[B] BETO_BALANCE: ", await beto.balanceOf(deployer.address));
  console.log("[B] NOTE_BALANCE: ", await note.balanceOf(deployer.address));

  const chipPairAddress = await chip.pair();
  console.log("CHAIR PAIR ", chipPairAddress);

  await note.approve(router.address, ethers.BigNumber.from(2).pow(254));
  await beto.approve(router.address, ethers.BigNumber.from(2).pow(254));
  await router.addLiquidity(
    NOTE_ADDRESS,
    BETO_ADDRESS,
    false,
    ethers.BigNumber.from(10).pow(18).mul(1_000),
    ethers.BigNumber.from(10).pow(18).mul(1_000).mul(10),
    0,
    0,
    deployer.address,
    Math.floor(Date.now() / 1000) + 1000
  );
  console.log("[A] BETO_BALANCE: ", await beto.balanceOf(deployer.address));
  console.log("[A] NOTE_BALANCE: ", await note.balanceOf(deployer.address));

  await router.swapExactTokensForTokensSimple(
    ethers.BigNumber.from(10).pow(18).mul(10),
    0,
    NOTE_ADDRESS,
    BETO_ADDRESS,
    false,
    deployer.address,
    Math.floor(Date.now() / 1000) + 1000
  );
  await increase(3600);
  await router.swapExactTokensForTokensSimple(
    ethers.BigNumber.from(10).pow(18).mul(10),
    0,
    NOTE_ADDRESS,
    BETO_ADDRESS,
    false,
    deployer.address,
    Math.floor(Date.now() / 1000) + 4600
  );
  await increase(3600);
  await router.swapExactTokensForTokensSimple(
    ethers.BigNumber.from(10).pow(18).mul(10),
    0,
    NOTE_ADDRESS,
    BETO_ADDRESS,
    false,
    deployer.address,
    Math.floor(Date.now() / 1000) + 8200
  );

  const balance = await (await note.balanceOf(deployer.address)).div(4);
  await note.transfer(ACCOUNT1, balance);
  await note.transfer(ACCOUNT2, balance);

  // const chipPair = await ethers.getContractAt("BaseV1Pair", chipPairAddress);

  // contractAddress.dice.setProtocolFee(15000);
  // contractAddress.dice.setHouseContract(address(contractAddress.house));
  // contractAddress.dice.setRandomContract(address(contractAddress.random));

  const address: Record<string, string> = {};

  address["BETO"] = BETO_ADDRESS;
  address["WCANTO"] = WCANTO_ADDRESS;
  address["NOTE"] = NOTE_ADDRESS;
  address["CHIP"] = CHIP_ADDRESS;
  address["House"] = house.address;
  address["Random"] = random.address;
  address["Dice"] = dice.address;
  address["Treasury"] = treasury.address;
  address["Rewarder"] = rewarder.address;
  address["Collector"] = collector.address;
  address["Distributor"] = distributor.address;
  address["Vesting"] = vesting.address;

  saveTypechainFiles();
  saveDeployedAddress(address);
}

async function saveDeployedAddress(address: any) {
  const fs = require("fs");
  try {
    fs.unlink("./frontend/src/constants/address.ts");
  } catch (e) {}

  fs.writeFileSync(
    "./frontend/src/constants/address.ts",
    `export default ${JSON.stringify(address)}`
  );
}

async function saveTypechainFiles() {
  const fs = require("fs");
  const fse = require("fs-extra");

  fse.removeSync("./frontend/src/typechain");
  fse.removeSync("./frontend/src/artifacts");

  fse.copySync("./typechain", "./frontend/src/typechain");
  fse.copySync("./artifacts", "./frontend/src/artifacts");

  // if (!fs.existsSync(contractsDir)) {
  //   fs.mkdirSync(contractsDir);
  // }

  // fs.writeFileSync(
  //   contractsDir + "/contract-address.json",
  //   JSON.stringify({ Factory: factory.address }, undefined, 2)
  // );

  // const LFProductFactory = artifacts.readArtifactSync("LFProductFactory");
  // const LFERC20 = artifacts.readArtifactSync("INonfungiblePositionManager");

  // fs.writeFileSync(
  //   contractsDir + "/LFProductFactory.json",
  //   JSON.stringify(LFProductFactory, null, 2)
  // );
  // fs.writeFileSync(
  //   contractsDir + "/LFERC20.json",
  //   JSON.stringify(LFERC20, null, 2)
  // );
}

function createCalldata(data: any[]) {
  const targets: any[] = [];
  const calldatas: any[] = [];
  data.forEach((item) => {
    targets.push(item[0]);
    calldatas.push(item[1]);
  });
  return {
    targets,
    calldatas,
  };
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
