import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

async function deployedFixture(opts){
  const CPMSStamp1155 = await ethers.getContractFactory("CPMSStamp1155");
  const stamp = await CPMSStamp1155.deploy("http://cpms.wtf");
  return { stamp };
}

let testStamp1 = {
  name: 'The Stamp Name',
  description: 'Something about this',
  attributes: '{"season": "1", "artist": "Someone"}',
  dataUri: 'data:image/gif;base64,R0lGODlhPABJAPQAAAAAACAcJSEdJ2ROKCUzVW9BZr9ZBr1ZCP96ARNEqx1tsRxtsnCs3riuipS11tG80q3G5fbf3QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAAALAAAAAA8AEkAAAX/INA0gEia5ZieKuq2MCuv9Di/d0zju47bwKBwSCwaiymGcslsOpeQp1QaZZ6STEi0OoUqq9xvt4lABGSNJ1js1DLc8O3WG2eUzYNzMNz+zt9va4BdgncBAQMDNkl8gmtxWpGSkYGVkmWHiHlXInKWnpOhoqOTZQaZmWikq6yREaGvWqaoiXpArbiSsbuiCAaYh7WKMLmssZMRr8mXv5mJz2clKcUQZYm8EMess8F5mQSqub61Wsrm2dpaAVoG7cGIqLY2yfT19hHjmeXVpwHY+AEIBGh3SiC8eItERHiQjOHChg2tJRL4gKEpAhQdvjKDUSBGZ95SSRNRsaTJkqYM/9TKVNHXQAMGM5kJ2NFZPJEmGpxsaNKXxJXJ3NGMGfNQTWjwvAm5d88U0kPJXBp9F/Dm03jDWFSE+HChL5XCagXtB3LqN00Hb3LSefLk12chDwmNGdKgwTwr4eKc5xAlgjwEb9JsRrXWR6y04CZaam9cSLJmq8IrShNx2ssJG3S1+DeuVVqD2wGr3E0wzhQMt77FWzhe0bE+pdr05o0eAjSN211F5dFoxpIEfZYl7W8r46iiv3nsHfAZRa6if402K9Be5gULYJtWfja1xgjRMS1HdW8t9gUpV/KW7K0601/SZ948Xw9NAQIFRndkbrMqg3sMLBAeHmadd16AQuAnnf9elFWlXgAGniddfOsVcB92AWKX2X3c3PQRAWHlYeGIFuL3lXSTLXcffhgVsFYiQuXx4XJF1VLiRAUMoCCFKWpiIVxoDGAIVabZlZRizwT3V2maICnEaoqh5ZmD2wXw1ZKodIhKZgQh6SVvhwWQwJhkJkCQbs+cONR+a3VZpYdYlYneHWjKlVdd0eSEppd8hphHAguQeaY1cgUDlmtCNCHmEoeMwUAASowp4ZlnAgYWNLVkZiZkb/q2n0FkChiYXJRyGtBaZW6KCqBrfopRoKnCGuh5gNaKnacEJIAGdpLCWmuqwMb666y2DgsssULw+qutvvYqZ7OSFlvsrGUkkF7/VinICq220QYbKqCdTXutXoiYJyyg2kL7ra2O5bHAS5diitcmKzTAJ3bQBEtrr/Emoq63qQTR6U0JiAnhu4d4m8ABBxzCcAAHFNywmGVmNjCZnaKLHcMcOwzxxAkXfJoIZVIsciYnHyJAPBqjuzDHD2fSMMgI1Rsgw2OyLJgAK2cSIa8LwDzdIUGjomEQSnSciQCPMmrlKfkuK+tXpfX5zHUMHNDFuF82SVth8+Y1chqPJsanlPN6nXZYaG0XJNptm/Z1lRgL5q0QKZumcMgK933smJr+63ffgi8bqrKBonr4t8o663KvzXK7L9DRJl6v4wY+vrjGvtIKdOYuT554/xDDBl0mw0X/HCHknmfu+sG8Bq5FoBDMqjrCrX/OOXYCRAgh7Oflma3qtW+cOuy/33rr78kTzTPvyqvc+661V79A9Vo4UEbQuGMHwQHvPr+AA0THswDPPO+8gBDFO3D99cUH3THCh8xedADPQ3CIA+Av/bzbxDjP7BzgAEloL2ZEiwQC47FApZlmLVDgAxMKCDJJMKCABRQFBR2GAJClb0v1WsATROgEhulvHaLIAgQckLR18I9makEaE0joKCqskIVKKGDWcNhBpaFvZYlSAg1r2ITsTTCClLBDDxv2Q1tgYYZEtCEOV3EHMzQRglHM4hMyGAkCWrFneTqCGMdIxhYx9iAHaDyjGnnwAzb64I1pdGMcVRACADs=',
  price: 10,
  maxSupply: 2,
  maxAmountPerWallet: 1,
  saleActive: true,
  hasEligibilityCheck: false,
  eligibilityCheckerAddress: '0x000000000000000000000000000000000000dEaD'
}

describe("CPMSStamp1155", async () => {
  describe("initStamp", async () => {
    it("should work emit event", async () => {
      const { stamp } = await loadFixture(deployedFixture);
      await expect(await stamp.initStamp(testStamp1)).emit(stamp, "NewStampSetup").withArgs(0);
    })
    it("should increment counter", async () => {
      const { stamp } = await loadFixture(deployedFixture);
      await expect(await stamp.initStamp(testStamp1)).emit(stamp, "NewStampSetup").withArgs(0);
      expect(await stamp.currentStampId()).to.equal("0")
      await expect(await stamp.initStamp(testStamp1)).emit(stamp, "NewStampSetup").withArgs(1);
      expect(await stamp.currentStampId()).to.equal("1")
    })
    // TODO
    // test the requires()
  })
  describe("tokenURI", async () => {
    it("should raise error if calling a token that doesn't exist", async() => {
      const { stamp } = await loadFixture(deployedFixture);
      await expect(stamp.tokenURI(1)).to.be.revertedWithCustomError(
        stamp,
        "InvalidTokenID"
      )      
    })
    // TODO: check this out, validate the JSON
    it("should do something", async () => {
      const { stamp } = await loadFixture(deployedFixture);
      await stamp.initStamp(testStamp1)
      console.log(await stamp.tokenURI(0))
    })
  })
  describe("imageDataUri", async() => {
    it("should render data URI", async() => {
      const { stamp } = await loadFixture(deployedFixture);
      await stamp.initStamp(testStamp1)
      expect(await stamp.imageDataUri(0)).to.equal(testStamp1.dataUri)
    })
  })
})