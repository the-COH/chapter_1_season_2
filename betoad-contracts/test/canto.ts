import { expect } from "chai";
import { ethers } from "hardhat";
import {
  time,
  loadFixture,
  setBalance,
  mine,
} from "@nomicfoundation/hardhat-network-helpers";
import { increase } from "@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time";
import { Chip } from "../typechain";

const NOTE_ADDRESS = "0x4e71A2E537B7f9D9413D3991D37958c0b5e1e503";
const WCANTO_ADDRESS = "0x826551890Dc65655a0Aceca109aB11AbDbD7a07B";
const FACTORY_ADDRESS = "0xE387067f12561e579C5f7d4294f51867E0c1cFba";
const ROUTER_ADDRESS = "0xa252eEE9BDe830Ca4793F054B506587027825a8e";

let BETO_ADDRESS = "0x4A6358b5d90818446BeD6CFd8821b5B83C0C92c5";
let CHIP_ADDRESS = "";

const newDeploy = true;

describe("Dice-House", function () {
  async function deployFixture() {
    const [deployer] = await ethers.getSigners();

    const Gov = await ethers.getContractFactory("Gov");
    const gov = await Gov.deploy();
    console.log("Deployed Gov: ", gov.address);

    const Beto = await ethers.getContractFactory("ERC20Mint");
    if (newDeploy) {
      const beto = await Beto.deploy();
      BETO_ADDRESS = beto.address;
      await beto.addMinter(deployer.address);
      await beto.mint(
        deployer.address,
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
    const wcanto = await ethers.getContractAt("IERC20", WCANTO_ADDRESS);
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
      ethers.BigNumber.from(10).pow(18).mul(1_000).mul(100),
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

    // const chipPair = await ethers.getContractAt("BaseV1Pair", chipPairAddress);

    // contractAddress.dice.setProtocolFee(15000);
    // contractAddress.dice.setHouseContract(address(contractAddress.house));
    // contractAddress.dice.setRandomContract(address(contractAddress.random));

    const value = createCalldata([
      //////////// DICE SETTING ////////////
      //////////// DICE SETTING ////////////
      [
        beto.address,
        Beto.interface.encodeFunctionData("addMinter(address)", [
          distributor.address,
        ]),
      ],
      ,
      //////////// DICE SETTING ////////////
      //////////// DICE SETTING ////////////
      [
        dice.address,
        Dice.interface.encodeFunctionData("setProtocolFee(uint256)", [30000]),
      ],
      [
        dice.address,
        Dice.interface.encodeFunctionData("setHouseContract(address)", [
          house.address,
        ]),
      ],
      [
        dice.address,
        Dice.interface.encodeFunctionData("setRandomContract(address)", [
          random.address,
        ]),
      ],
      //////////// HOUSE SETTING ////////////
      //////////// HOUSE SETTING ////////////
      [
        house.address,
        House.interface.encodeFunctionData("setMaxOutputRate(uint16)", [10000]),
      ],
      [
        house.address,
        House.interface.encodeFunctionData("setBeto(address)", [BETO_ADDRESS]),
      ],
      [
        house.address,
        House.interface.encodeFunctionData("setRewarder(address)", [
          rewarder.address,
        ]),
      ],
      [
        house.address,
        House.interface.encodeFunctionData("setDistributor(address)", [
          distributor.address,
        ]),
      ],
      [
        house.address,
        House.interface.encodeFunctionData("setTreasury(address)", [
          treasury.address,
        ]),
      ],
      [
        house.address,
        House.interface.encodeFunctionData("setCollector(address)", [
          collector.address,
        ]),
      ],
      [
        house.address,
        House.interface.encodeFunctionData(
          "createGame(string,string,string,address)",
          ["Dice", "Random Dice Game", "/dice", dice.address]
        ),
      ],
      [
        house.address,
        House.interface.encodeFunctionData(
          "createPool(string,address,uint256)",
          ["BETO", BETO_ADDRESS, 3600 * 24 * 7]
        ),
      ],
      [
        house.address,
        House.interface.encodeFunctionData(
          "createPool(string,address,uint256)",
          ["CHIP", CHIP_ADDRESS, 3600 * 24]
        ),
      ],
      [
        house.address,
        House.interface.encodeFunctionData(
          "createPool(string,address,uint256)",
          ["NOTE", NOTE_ADDRESS, 3600 * 24]
        ),
      ],
      [
        house.address,
        House.interface.encodeFunctionData(
          "createPool(string,address,uint256)",
          ["WCANTO", WCANTO_ADDRESS, 3600 * 24]
        ),
      ],
      //////////// TREASURY SETTING ////////////
      //////////// TREASURY SETTING ////////////
      [
        treasury.address,
        Treasury.interface.encodeFunctionData("setBeto(address)", [
          BETO_ADDRESS,
        ]),
      ],
      [
        treasury.address,
        Treasury.interface.encodeFunctionData("addSpender(address)", [
          house.address,
        ]),
      ],
      [
        treasury.address,
        Treasury.interface.encodeFunctionData("addSpender(address)", [
          rewarder.address,
        ]),
      ],
      //////////// REWARDER SETTING ////////////
      //////////// REWARDER SETTING ////////////
      [
        rewarder.address,
        Rewarder.interface.encodeFunctionData("setBeto(address)", [
          BETO_ADDRESS,
        ]),
      ],
      [
        rewarder.address,
        Rewarder.interface.encodeFunctionData("setRegisterFee(uint256)", [
          ethers.BigNumber.from(10).pow(18).mul(1_000),
        ]),
      ],
      [
        rewarder.address,
        Rewarder.interface.encodeFunctionData("setHouse(address)", [
          house.address,
        ]),
      ],
      [
        rewarder.address,
        Rewarder.interface.encodeFunctionData("setTreasury(address)", [
          treasury.address,
        ]),
      ],
      [
        rewarder.address,
        Rewarder.interface.encodeFunctionData("setCollector(address)", [
          collector.address,
        ]),
      ],
      [
        rewarder.address,
        Rewarder.interface.encodeFunctionData("setReferralRatio(uint256[])", [
          [80e10, 5e10, 5e10, 4e10, 3e10, 2e10, 1e10],
        ]),
      ],
      //////////// COLLECTOR SETTING ////////////
      //////////// COLLECTOR SETTING ////////////
      [
        collector.address,
        Collector.interface.encodeFunctionData("setBeto(address)", [
          BETO_ADDRESS,
        ]),
      ],
      [
        collector.address,
        Collector.interface.encodeFunctionData("addHarvestContract(address)", [
          house.address,
        ]),
      ],
      [
        collector.address,
        Collector.interface.encodeFunctionData("addAsset(address)", [
          BETO_ADDRESS,
        ]),
      ],
      [
        collector.address,
        Collector.interface.encodeFunctionData("addAsset(address)", [
          WCANTO_ADDRESS,
        ]),
      ],
      [
        collector.address,
        Collector.interface.encodeFunctionData("addAsset(address)", [
          CHIP_ADDRESS,
        ]),
      ],
      [
        collector.address,
        Collector.interface.encodeFunctionData("setDistributor(address)", [
          distributor.address,
        ]),
      ],
      //////////// DISTRIBUTOR SETTING ////////////
      //////////// DISTRIBUTOR SETTING ////////////
      [
        distributor.address,
        Distributor.interface.encodeFunctionData("setBeto(address)", [
          BETO_ADDRESS,
        ]),
      ],
      [
        distributor.address,
        Distributor.interface.encodeFunctionData("setVesting(address)", [
          vesting.address,
        ]),
      ],
      [
        distributor.address,
        Distributor.interface.encodeFunctionData(
          "addDistribution(address,uint8,uint256,uint256)",
          [house.address, 0, 0, 500000]
        ),
      ],
      [
        distributor.address,
        Distributor.interface.encodeFunctionData(
          "addDistribution(address,uint8,uint256,uint256)",
          [house.address, 1, 0, 125000]
        ),
      ],
      [
        distributor.address,
        Distributor.interface.encodeFunctionData(
          "addDistribution(address,uint8,uint256,uint256)",
          [house.address, 1, 1, 250000]
        ),
      ],
      [
        distributor.address,
        Distributor.interface.encodeFunctionData(
          "addDistribution(address,uint8,uint256,uint256)",
          [house.address, 1, 2, 62500]
        ),
      ],
      [
        distributor.address,
        Distributor.interface.encodeFunctionData(
          "addDistribution(address,uint8,uint256,uint256)",
          [house.address, 1, 3, 62500]
        ),
      ],
      //////////// RANDOM SETTING ////////////
      //////////// RANDOM SETTING ////////////
      [
        random.address,
        Random.interface.encodeFunctionData("addRelayer(address)", [
          deployer.address,
        ]),
      ],
      [
        random.address,
        Random.interface.encodeFunctionData("addGame(address)", [dice.address]),
      ],
    ]);

    tx = await gov.execute(
      value.targets,
      value.targets.map(() => 0),
      value.calldatas
    );
    await tx.wait();

    return {
      gov,
      house,
      random,
      dice,
      rewarder,
      treasury,
      collector,
      distributor,
      vesting,
      wcanto,
      beto,
      note,
      chip,
    };
  }

  it("Distribute", async function () {
    const [deployer, user2] = await ethers.getSigners();
    const { house, dice, distributor, beto, chip } = await loadFixture(
      deployFixture
    );

    // await beto.approve(house.address, ethers.BigNumber.from(2).pow(254));
    // await house.deposit(0, ethers.BigNumber.from(10).pow(18).mul(100_000));
    // await distributor.distribute();

    console.log("beto", (await house.pools(0)).price.toString());

    console.log("chip", (await chip.getPrice()).toString());

    // await dice.bet(1, 1000, WMATIC_ADDRESS, 200, 50, true);
    // await dice.bet(1, 1000, WMATIC_ADDRESS, 200, 50, true);
    // await dice.bet(1, 1000, WMATIC_ADDRESS, 200, 50, true);
    // await dice.bet(1, 1000, WMATIC_ADDRESS, 200, 50, true);
    // console.log(await dice.bets(0));
    // await dice.bet(1, 1000, 200, 50, true);
    // console.log(await dice.bets(1));
    // await dice.bet(1, 1000, 200, 50, true);
    // console.log(await dice.bets(2));c
  });

  // it("다이스 정상적으로 settle 되는지", async function () {
  //   const [owner, user2] = await ethers.getSigners();
  //   const { house, dice, wmatic } = await loadFixture(deployFixture);

  //   await wmatic.approve(house.address, 1_000_000_000_000_000);
  //   await wmatic.approve(dice.address, 1_000_000_000_000_000);
  //   await house.deposit(1, 1_000_000_000_000_000);

  //   await dice.bet(1, 1000, 200, 50, true);
  //   await dice.settle(owner.address);
  //   await mine(1);
  //   await dice.bet(1, 1000, 200, 50, true);
  //   await dice.settle(owner.address);
  //   await mine(1);
  //   await dice.bet(1, 1000, 200, 50, true);
  //   await dice.settle(owner.address);
  //   await mine(1);
  //   await dice.bet(1, 1000, 200, 50, true);
  //   await dice.settle(owner.address);
  //   await mine(1);
  //   await dice.bet(1, 1000, 200, 50, true);
  //   await dice.settle(owner.address);
  //   // await dice.bet(1, 1000, WMATIC_ADDRESS, 200, 50, true);
  //   // await dice.bet(1, 1000, WMATIC_ADDRESS, 200, 50, true);
  //   // await dice.bet(1, 1000, WMATIC_ADDRESS, 200, 50, true);
  //   // await dice.bet(1, 1000, WMATIC_ADDRESS, 200, 50, true);
  //   // console.log(await dice.bets(0));
  //   // await dice.bet(1, 1000, 200, 50, true);
  //   // console.log(await dice.bets(1));
  //   // await dice.bet(1, 1000, 200, 50, true);
  //   // console.log(await dice.bets(2));c
  // });

  // it("다이스 정상적으로 settleAll 로 한번에 되는지", async function () {
  //   const [user1, user2, user3] = await ethers.getSigners();
  //   const { house, dice, wmatic } = await loadFixture(deployFixture);

  //   await wmatic.approve(house.address, 1_000_000_000_000_000);
  //   await wmatic.approve(dice.address, 1_000_000_000_000_000);
  //   await wmatic.connect(user2).approve(dice.address, 1_000_000_000_000_000);
  //   await wmatic.connect(user3).approve(dice.address, 1_000_000_000_000_000);
  //   await wmatic.approve(dice.address, 1_000_000_000_000_000);
  //   await house.deposit(1, 1_000_000_000_000_000);

  //   await dice.connect(user1).bet(1, 1000, 200, 50, true);
  //   const beforeBalance1 = await wmatic.balanceOf(user1.address);
  //   const beforeBetInfo1 = await dice["betInfo(uint256)"](0);
  //   expect(beforeBetInfo1.player).to.equal(user1.address);
  //   expect(beforeBetInfo1.isEnd).to.equal(false);

  //   await dice.connect(user2).bet(1, 1000, 200, 50, true);
  //   const beforeBalance2 = await wmatic.balanceOf(user2.address);
  //   const beforeBetInfo2 = await dice["betInfo(uint256)"](1);
  //   expect(beforeBetInfo2.player).to.equal(user2.address);
  //   expect(beforeBetInfo2.isEnd).to.equal(false);

  //   await dice.connect(user3).bet(1, 1000, 200, 50, true);
  //   const beforeBalance3 = await wmatic.balanceOf(user3.address);
  //   const beforeBetInfo3 = await dice["betInfo(uint256)"](2);
  //   expect(beforeBetInfo3.player).to.equal(user3.address);
  //   expect(beforeBetInfo3.isEnd).to.equal(false);

  //   await dice.settleAll();

  //   const afterBetInfo1 = await dice["betInfo(uint256)"](0);
  //   const afterBetInfo2 = await dice["betInfo(uint256)"](1);
  //   const afterBetInfo3 = await dice["betInfo(uint256)"](2);
  //   console.log(afterBetInfo1);
  //   console.log(afterBetInfo2);
  //   console.log(afterBetInfo3);

  //   // await dice.connect(user3).bet(1, 1000, WMATIC_ADDRESS, 200, 50, true);
  //   // await dice.bet(1, 1000, WMATIC_ADDRESS, 200, 50, true);
  //   // await dice.bet(1, 1000, WMATIC_ADDRESS, 200, 50, true);
  //   // await dice.bet(1, 1000, WMATIC_ADDRESS, 200, 50, true);
  //   // await dice.bet(1, 1000, WMATIC_ADDRESS, 200, 50, true);
  //   // console.log(await dice.bets(0));
  //   // await dice.bet(1, 1000, 200, 50, true);
  //   // console.log(await dice.bets(1));
  //   // await dice.bet(1, 1000, 200, 50, true);
  //   // console.log(await dice.bets(2));
  // });
});

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
