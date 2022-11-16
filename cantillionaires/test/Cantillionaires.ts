import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');



let addressesForMerkList = []
let proofs = []

let ogProofs = []
let ogAddressesForMerkList = []

describe("Cantillionaires", function () {
  async function deployedFixture() {
    return await _coreFixture({});
  }

  async function deployedFixtureWithLowEarlyBirdLimit() {
    return await _coreFixture({earlyBirdSupply: 2});
  }

  async function deployedFixtureWithMaxSupply() {
    return await _coreFixture({maxSupply: 5});
  }  

  async function _coreFixture(opts){
    const baseTokenPrice        = opts.price || 0 // Free eveywhere but the mint method, to let us skip eth math in unrelated cases
    const totalLimit            = opts.totalLimit || 5
    const cbdMintLimit          = opts.cbdMintLimit || 2
    const baseUri               = "http://example.com/api/"
    const royaltyRecipient      = ethers.Wallet.createRandom().address

    const Cantillionaires = await ethers.getContractFactory("Cantillionaires");
    const cantillionaires = await Cantillionaires.deploy(cbdMintLimit, totalLimit, baseTokenPrice, baseUri, royaltyRecipient);

    const [owner, otherUser1, otherUser2, otherUser3] = await ethers.getSigners()

    addressesForMerkList.push(otherUser1.address)
    addressesForMerkList.push(otherUser2.address)
    let leafNodes = addressesForMerkList.map(addr => keccak256(addr));
    let merkleTree = new MerkleTree(leafNodes, keccak256, {sortPairs: true});
    let root = merkleTree.getRoot().toString('hex');

    for(let i = 0; i < addressesForMerkList.length; i++){
      proofs.push(merkleTree.getHexProof(keccak256(ethers.utils.solidityPack(['address'], [addressesForMerkList[i]]))))  
    }

    await cantillionaires.setCBDMerkleRoot('0x' + root)

    // Buddy list
    ogAddressesForMerkList.push(otherUser2.address)
    ogAddressesForMerkList.push(otherUser3.address)
    leafNodes = ogAddressesForMerkList.map(addr => keccak256(addr));
    merkleTree = new MerkleTree(leafNodes, keccak256, {sortPairs: true});
    root = merkleTree.getRoot().toString('hex');

    for(let i = 0; i < ogAddressesForMerkList.length; i++){
      ogProofs.push(merkleTree.getHexProof(keccak256(ethers.utils.solidityPack(['address'], [ogAddressesForMerkList[i]]))))  
    }

    await cantillionaires.setBuddiesMerkleRoot('0x' + root)


    return { cantillionaires, baseTokenPrice, totalLimit, cbdMintLimit, baseUri, royaltyRecipient };
  }


  describe("Deployment", () => {
    it("should set owner", async () => {
      const [owner] = await ethers.getSigners();
      const { cantillionaires, baseUri } = await loadFixture(deployedFixture);
      expect(await cantillionaires.owner()).to.equal(owner.address);
    })

    it("Should set the baseUri", async () => {
      const { cantillionaires, baseUri } = await loadFixture(deployedFixture);
      expect(await cantillionaires.baseURI()).to.equal(baseUri);
    });

    it("Should set the royaltyRecipient", async () => {
      const { cantillionaires, royaltyRecipient } = await loadFixture(deployedFixture);
      expect(await cantillionaires.royaltyRecipient()).to.equal(royaltyRecipient);
    });    

    it("Should set the cbdMintLimit", async () => {
      const { cantillionaires, cbdMintLimit } = await loadFixture(deployedFixture);
      expect(await cantillionaires.CBD_MINT_LIMIT()).to.equal(cbdMintLimit);
    });    

    it("Should set the totalLimit", async () => {
      const { cantillionaires, totalLimit } = await loadFixture(deployedFixture);
      expect(await cantillionaires.TOTAL_LIMIT()).to.equal(totalLimit);
    });

    it("Should set the price", async () => {
      const { cantillionaires, baseTokenPrice } = await loadFixture(deployedFixture);
      expect(await cantillionaires.price()).to.equal(baseTokenPrice);
    });        
  })

  describe("toggleIsSaleActive", async() => {
    it("should work", async() => {
      const { cantillionaires, baseTokenPrice } = await loadFixture(deployedFixture);
      expect(await cantillionaires.isSaleActive()).to.equal(false)      
      await cantillionaires.toggleIsSaleActive()
      expect(await cantillionaires.isSaleActive()).to.equal(true)      
      await cantillionaires.toggleIsSaleActive()
      expect(await cantillionaires.isSaleActive()).to.equal(false)      
    })
  })

  describe("toggleForBuddiesOnly", async() => {
    it("should work", async() => {
      const { cantillionaires, baseTokenPrice } = await loadFixture(deployedFixture);
      expect(await cantillionaires.forBuddiesOnly()).to.equal(true)      
      await cantillionaires.toggleForBuddiesOnly()
      expect(await cantillionaires.forBuddiesOnly()).to.equal(false)      
      await cantillionaires.toggleForBuddiesOnly()
      expect(await cantillionaires.forBuddiesOnly()).to.equal(true)      
    })
  })


  describe("setBaseTokenPrice", async () => {
    it("should update price", async () => {
      const { cantillionaires } = await loadFixture(deployedFixture);
      await cantillionaires.setPrice(1000);
      expect(await cantillionaires.price()).to.equal(1000);
    })
    it("should not allow a non-owner to do this", async () => {
      const { cantillionaires } = await loadFixture(deployedFixture);

      await expect(
        cantillionaires.connect((await ethers.getSigners())[2]).setPrice(1000)
      ).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );      
    })
  })

  describe("entitledToFreeMintFromCBD", async() => {
    it("should be false if no proof provided", async() => {
      const { cantillionaires } = await loadFixture(deployedFixture);
      expect(await cantillionaires.entitledToFreeMintFromCBD(ethers.Wallet.createRandom().address, [])).to.equal(false);
    })
    it("should be false proof provided but you're not in it", async() => {
      const { cantillionaires } = await loadFixture(deployedFixture);
      const [owner, otherUser1, otherUser2] = await ethers.getSigners()
      expect(await cantillionaires.entitledToFreeMintFromCBD(owner.address, [])).to.equal(false);
    })
    it("should be true if you're in it and the limit is ok and you didn't claim yet", async() => {
      const { cantillionaires } = await loadFixture(deployedFixture);
      const [owner, otherUser1, otherUser2] = await ethers.getSigners()
      expect(await cantillionaires.entitledToFreeMintFromCBD(otherUser1.address, proofs[0])).to.equal(true);      
      expect(await cantillionaires.entitledToFreeMintFromCBD(otherUser1.address, proofs[1])).to.equal(false);      
    })
    it("should be false proof provided, you're in it, but you already claimed", async() => {
      const { cantillionaires } = await loadFixture(deployedFixture);
      const [owner, otherUser1, otherUser2] = await ethers.getSigners()
      expect(await cantillionaires.entitledToFreeMintFromCBD(otherUser1.address, proofs[0])).to.equal(true);
      await cantillionaires.updateCbdClaims(otherUser1.address)
      expect(await cantillionaires.entitledToFreeMintFromCBD(otherUser1.address, proofs[0])).to.equal(false);
    })
    it("should be false proof provided, you're in it, but your mint will put it over the limit", async() => {
      const { cantillionaires } = await loadFixture(deployedFixture);
      const [owner, otherUser1, otherUser2] = await ethers.getSigners()
      expect(await cantillionaires.entitledToFreeMintFromCBD(otherUser1.address, proofs[0])).to.equal(true);
      await cantillionaires.setCbdClaimedCount(1)
      expect(await cantillionaires.entitledToFreeMintFromCBD(otherUser1.address, proofs[0])).to.equal(true);      
      await cantillionaires.setCbdClaimedCount(2) // It's already at 2, so minting one more will put us over the limit.
      expect(await cantillionaires.entitledToFreeMintFromCBD(otherUser1.address, proofs[0])).to.equal(false);            
      await cantillionaires.setCbdClaimedCount(10)
      expect(await cantillionaires.entitledToFreeMintFromCBD(otherUser1.address, proofs[0])).to.equal(false);                  
    })
  })

  describe("isAddressInBuddyList", async() => {
    it("should be false if not in it", async() => {
      const { cantillionaires } = await loadFixture(deployedFixture);
      const [owner, otherUser1, otherUser2, otherUser3] = await ethers.getSigners()      
      expect(await cantillionaires.isAddressInBuddyList(otherUser1.address, [])).to.equal(false);                  
    })
    it("should be true if in it", async() => {
      const { cantillionaires } = await loadFixture(deployedFixture);
      const [owner, otherUser1, otherUser2, otherUser3] = await ethers.getSigners()      
      expect(await cantillionaires.isAddressInBuddyList(otherUser2.address, ogProofs[0])).to.equal(true);                        
      expect(await cantillionaires.isAddressInBuddyList(otherUser3.address, ogProofs[1])).to.equal(true);                        
    })
  })

  describe("mint", async() => {
    it("should revert if it's not open", async() => {
      const { cantillionaires } = await loadFixture(deployedFixture);
      await expect(cantillionaires.mint(1, [], []))
      .to.be.revertedWithCustomError(cantillionaires, "NotOpen")
    })
    it("should revert if you try to mint 0", async() => {
      const { cantillionaires } = await loadFixture(deployedFixture);
      await cantillionaires.toggleIsSaleActive()
      await expect(cantillionaires.mint(0, [], []))
      .to.be.revertedWithCustomError(cantillionaires, "ZeroMintError")      

    })
    it("should revert if it is Buddies only and you are not an Buddies", async() => {
      const { cantillionaires } = await loadFixture(deployedFixture);
      await cantillionaires.toggleIsSaleActive()
      await expect(cantillionaires.mint(1, [], []))
      .to.be.revertedWithCustomError(cantillionaires, "BuddiesOnly")            
    })
    it("should revert if you try to mint more than limit", async() => {
      const { cantillionaires } = await loadFixture(deployedFixture);
      const [owner, otherUser1, otherUser2, otherUser3] = await ethers.getSigners()      
      await cantillionaires.toggleIsSaleActive()
      await expect(cantillionaires.connect(otherUser3).mint(100, [], ogProofs[1]))
      .to.be.revertedWithCustomError(cantillionaires, "TooMany")
    })
    it("should revert if you try to mint more than limit, after someone else", async() => {
      const { cantillionaires } = await loadFixture(deployedFixture);
      const [owner, otherUser1, otherUser2, otherUser3] = await ethers.getSigners()      
      await cantillionaires.toggleIsSaleActive()
      await cantillionaires.connect(otherUser3).mint(3, [], ogProofs[1])
      await cantillionaires.connect(otherUser2).mint(2, [], ogProofs[0])   
      await expect(cantillionaires.connect(otherUser3).mint(1, [], ogProofs[1]))
      .to.be.revertedWithCustomError(cantillionaires, "TooMany")
    })
    it("should give you a free one if you're in the CBD list and haven't minted yet (and is Buddies)", async() => {
      const { cantillionaires } = await loadFixture(deployedFixture);
      const [owner, otherUser1, otherUser2, otherUser3] = await ethers.getSigners()      
      await cantillionaires.toggleIsSaleActive()
      await cantillionaires.setPrice(ethers.utils.parseEther('1'))
      await cantillionaires.connect(otherUser2).mint(2, proofs[1], ogProofs[0], {
          value: ethers.utils.parseEther('1'),
          from: otherUser2.address
      })
      expect(await cantillionaires.balanceOf(otherUser2.address)).to.equal(2);
    })
    it("should give you a free one if you're in the CBD list and haven't minted yet", async() => {
      const { cantillionaires } = await loadFixture(deployedFixture);
      const [owner, otherUser1, otherUser2, otherUser3] = await ethers.getSigners()      
      await cantillionaires.toggleIsSaleActive()
      await cantillionaires.setPrice(ethers.utils.parseEther('1'))
      const claimCount = await cantillionaires.cbdClaimedCount()
      await cantillionaires.connect(otherUser2).mint(1, proofs[1], ogProofs[0])
      expect(await cantillionaires.balanceOf(otherUser2.address)).to.equal(1);
      expect(await cantillionaires.cbdClaimedCount()).to.equal(claimCount + 1)
    })
    it("should not give free if in Buddies list not CBD list", async() => {
      const { cantillionaires } = await loadFixture(deployedFixture);
      const [owner, otherUser1, otherUser2, otherUser3] = await ethers.getSigners()      
      await cantillionaires.toggleIsSaleActive()
      await cantillionaires.setPrice(ethers.utils.parseEther('1'))
      await expect(cantillionaires.connect(otherUser3).mint(1, proofs[1], ogProofs[1]))
      .to.be.revertedWithCustomError(cantillionaires, "BadCanto")
        .withArgs(ethers.utils.parseEther('1'));
    })
    it("should allow rando to mint when it's not Buddies only", async() => {
      const { cantillionaires } = await loadFixture(deployedFixture);
      const [owner, otherUser1, otherUser2, otherUser3] = await ethers.getSigners()      
      await cantillionaires.toggleIsSaleActive()
      await cantillionaires.setPrice(ethers.utils.parseEther('1'))
      await cantillionaires.toggleForBuddiesOnly()

      await cantillionaires.mint(5, [], [], {
        value: ethers.utils.parseEther('5')
      })
      expect(await cantillionaires.balanceOf(owner.address)).to.equal(5);

    })
    it("don't give two free CBDs", async() => {
      const { cantillionaires } = await loadFixture(deployedFixture);
      const [owner, otherUser1, otherUser2, otherUser3] = await ethers.getSigners()      
      await cantillionaires.toggleIsSaleActive()
      await cantillionaires.toggleForBuddiesOnly()
      
      await cantillionaires.setPrice(ethers.utils.parseEther('1'))
      await cantillionaires.connect(otherUser2).mint(2, proofs[1], [], {
          value: ethers.utils.parseEther('1'),
          from: otherUser2.address
      })
      expect(await cantillionaires.balanceOf(otherUser2.address)).to.equal(2);

      // Would explode if it was free
      await cantillionaires.connect(otherUser2).mint(1, proofs[1], [], {
          value: ethers.utils.parseEther('1'),
          from: otherUser2.address
      })
    })
    it("should give a CBD dude a freebie if not Buddies season", async() => {
      const { cantillionaires } = await loadFixture(deployedFixture);
      const [owner, otherUser1, otherUser2, otherUser3] = await ethers.getSigners()      
      await cantillionaires.toggleIsSaleActive()
      await cantillionaires.toggleForBuddiesOnly()
      
      await cantillionaires.setPrice(ethers.utils.parseEther('1'))
      await cantillionaires.connect(otherUser2).mint(2, proofs[1], [], {
          value: ethers.utils.parseEther('1'),
          from: otherUser2.address
      })
      expect(await cantillionaires.balanceOf(otherUser2.address)).to.equal(2);      
    })
    it("should not give free away if not CBD but is Buddies", async() => {
      const { cantillionaires } = await loadFixture(deployedFixture);
      const [owner, otherUser1, otherUser2, otherUser3] = await ethers.getSigners()      
      await cantillionaires.toggleIsSaleActive()
      await cantillionaires.toggleForBuddiesOnly()
      
      await cantillionaires.setPrice(ethers.utils.parseEther('1'))
      await cantillionaires.connect(otherUser3).mint(2, [], ogProofs[0], {
          value: ethers.utils.parseEther('2'),
          from: otherUser3.address
      })
      expect(await cantillionaires.balanceOf(otherUser3.address)).to.equal(2);      
    })
  })

  describe("setPayees", async() => {
    it("should assign wallets", async() => {
      const { cantillionaires } = await loadFixture(deployedFixture);
      const w1 = ethers.Wallet.createRandom().address
      const w2 = ethers.Wallet.createRandom().address
      const w3 = ethers.Wallet.createRandom().address
      const w4 = ethers.Wallet.createRandom().address
      await cantillionaires.setPayees(w1, w2, w3, w4);
      expect(await cantillionaires.w1()).to.eq(w1)
      expect(await cantillionaires.w2()).to.eq(w2)
      expect(await cantillionaires.w3()).to.eq(w3)
      expect(await cantillionaires.w4()).to.eq(w4)      
    })
  })

  describe("withdrawAll", async() => {
    it("should work repeatedly", async() => {

      const { cantillionaires } = await loadFixture(deployedFixture);
      const [owner, otherUser1, otherUser2, otherUser3] = await ethers.getSigners()      
      await cantillionaires.toggleIsSaleActive()
      await cantillionaires.setPrice(ethers.utils.parseEther('500'))
      await cantillionaires.toggleForBuddiesOnly()

      await cantillionaires.mint(2, [], [], {
        value: ethers.utils.parseEther('1000')
      })

      const balance = await ethers.provider.getBalance(cantillionaires.address);      
      expect(balance).to.eq(ethers.utils.parseEther('1000'))

      const [w1, w2, w3, w4] = await ethers.getSigners();

      await cantillionaires.setPayees(w1.address, w2.address, w3.address, w4.address);

      const before = await ethers.provider.getBalance(cantillionaires.address);
      let w1StartBalance = await ethers.provider.getBalance(w1.address);
      let w2StartBalance = await ethers.provider.getBalance(w2.address);
      let w3StartBalance = await ethers.provider.getBalance(w3.address);
      let w4StartBalance = await ethers.provider.getBalance(w4.address);

      // console.log([w1StartBalance, w2StartBalance, w3StartBalance, w4StartBalance].map( (a) => parseFloat(ethers.utils.formatEther(a)) ).join("\n"))

      await cantillionaires.distributeFunds()

      const after = await ethers.provider.getBalance(cantillionaires.address);

      let w1EndBalance = await ethers.provider.getBalance(w1.address);
      let w2EndBalance = await ethers.provider.getBalance(w2.address);
      let w3EndBalance = await ethers.provider.getBalance(w3.address);
      let w4EndBalance = await ethers.provider.getBalance(w4.address);


      // console.log([w1EndBalance, w2EndBalance, w3EndBalance, w4EndBalance].map( (a) => parseFloat(ethers.utils.formatEther(a)) ).join("\n"))

      const divBy4 = parseFloat(ethers.utils.formatEther(before.div(4)));
      // console.log(divBy4)

      expect(
        parseFloat(ethers.utils.formatEther(w1EndBalance))
      ).to.be.closeTo(
        parseFloat(ethers.utils.formatEther(w1StartBalance)) + divBy4,
        0.1
      )

      expect(
        parseFloat(ethers.utils.formatEther(w2EndBalance))
      ).to.be.closeTo(
        parseFloat(ethers.utils.formatEther(w2StartBalance)) + divBy4,
        0.1
      )

      expect(
        parseFloat(ethers.utils.formatEther(w3EndBalance))
      ).to.be.closeTo(
        parseFloat(ethers.utils.formatEther(w3StartBalance)) + divBy4,
        0.1
      )

      expect(
        parseFloat(ethers.utils.formatEther(w4EndBalance))
      ).to.be.closeTo(
        parseFloat(ethers.utils.formatEther(w4StartBalance)) + divBy4,
        0.1
      )      

    })
  })

  describe ("tokenURI", () => {
    it("should return a good url", async () => {
      const { cantillionaires } = await loadFixture(deployedFixture);
      const [owner] = await ethers.getSigners();
      await cantillionaires.toggleIsSaleActive()
      await cantillionaires.setPrice(ethers.utils.parseEther('1'))
      await cantillionaires.toggleForBuddiesOnly()      

      await cantillionaires.mint(2, [], [], {
          value: ethers.utils.parseEther('2'),
          from: owner.address
      })

      expect(await cantillionaires.tokenURI(1)).to.equal('http://example.com/api/1')
      expect(await cantillionaires.tokenURI(2)).to.equal('http://example.com/api/2')
    })
    it("should raise URIQueryForNonexistentToken for un-minted ID", async () => {
      const { cantillionaires } = await loadFixture(deployedFixture);

      await expect(cantillionaires.tokenURI(3)).to.be.revertedWithCustomError(
        cantillionaires,
        "URIQueryForNonexistentToken"
      )
    })
  })
})
