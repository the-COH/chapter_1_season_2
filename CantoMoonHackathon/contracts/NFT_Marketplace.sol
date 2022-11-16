// SPDX-License-Identifier: MIT LICENSE


pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IOwnable {
  function owner() external view returns(address);
}


contract CmoonNftMarketplace is IERC721Receiver, ReentrancyGuard, Ownable {

  struct VaultInfo {
      ERC721Enumerable nft;
      uint256 creatorRoyalties;
      address royaltyPayoutAddress;
      uint256 totalVolume;
      bool isCreated;

  }

  uint256 marketPlaceRoyalty = 250; // Multiply percentage by 100 to get whole number(Example to get a 2% fee: 2% * 100 = 200)
  address royaltyWallet = 0x173b39FEC7beB1CEe96faC2A1CD06a031CE96d3e;

  struct List {
    uint256 tokenId;
    address payable seller;
    address payable holder;
    uint256 price;
    bool sold;
  }
  mapping(address => VaultInfo) public vaultInfo;

  address[] public vaultList;

  mapping(address => mapping(uint256 => List)) public vaultItems;

  function isCreated(address vaultAddress) public view returns(bool isIndeed) {
      return vaultInfo[vaultAddress].isCreated;
  }

  function createVault(
    address vaultAddress,
    ERC721Enumerable _nft,
    uint256 _creatorRoyalties,
    address _royaltyPayoutAddress
  ) public onlyOwner{

    if(isCreated(vaultAddress)) revert();
    vaultInfo[vaultAddress].nft = _nft;
    vaultInfo[vaultAddress].creatorRoyalties = _creatorRoyalties;
    vaultInfo[vaultAddress].royaltyPayoutAddress = _royaltyPayoutAddress;
    vaultInfo[vaultAddress].isCreated = true;
    vaultList.push(vaultAddress);
  }

    function updateVault(
    address vaultAddress,
    uint256 _creatorRoyalties, // Must multiply percentage by 100 example: 2% would be 200
    address _royaltyPayoutAddress
  ) public {
    if(!isCreated(vaultAddress)) revert();
    require(msg.sender == IOwnable(vaultAddress).owner() || msg.sender == owner(), "Not Owner of Marketplace or NFT Collection");
    require(_creatorRoyalties < 10000, "Royalties must be lower than 10%"); // Royalties MUST be lower than 10%
    vaultInfo[vaultAddress].creatorRoyalties = _creatorRoyalties;
    vaultInfo[vaultAddress].royaltyPayoutAddress = _royaltyPayoutAddress;
  }

  function getVaultCount() public view returns(uint entityCount) {
    return vaultList.length;
  }

  
  function getVaultInfo(address vaultAddress) public view returns(uint, address, uint256, bool) {
    return (vaultInfo[vaultAddress].creatorRoyalties, vaultInfo[vaultAddress].royaltyPayoutAddress, vaultInfo[vaultAddress].totalVolume, vaultInfo[vaultAddress].isCreated);
  }




  event NFTListCreated (
    address vaultAddress,
    uint256 indexed tokenId,
    address seller,
    address holder,
    uint256 price,
    bool sold
  );

  event NFTPurchased (
    address vaultAddress,
    uint256 indexed tokenId,
    address seller,
    uint256 price,
    bool sold
  );


  function getMarketPlaceRoyalty() public view returns (uint256) {
    return marketPlaceRoyalty;
  }

  function setMarketplaceRoyalty(uint256 _marketPlaceRoyalty) public onlyOwner returns (uint256){
    require(_marketPlaceRoyalty < 500, "marketplace royalty must be lower than 5%" ); //Marketplace Royalty must be lower than 5%!!
    marketPlaceRoyalty = _marketPlaceRoyalty;
    return marketPlaceRoyalty;
  }

  function setRoyaltyWallet(address _royaltyWallet) public onlyOwner returns (address){
    royaltyWallet = _royaltyWallet;
    return royaltyWallet;
  }

  function listSale(address vaultAddress, uint256 tokenId, uint256 price) public nonReentrant {
      require(vaultInfo[vaultAddress].isCreated == true, "NFT is not confiruged in this contract");
      require(vaultInfo[vaultAddress].nft.ownerOf(tokenId) == msg.sender, "NFT not yours");
      require(vaultItems[vaultAddress][tokenId].tokenId == 0, "NFT already listed");
      require(price > 0, "Amount must be higher than 0");
      vaultItems[vaultAddress][tokenId] =  List(tokenId, payable(msg.sender), payable(address(this)), price * 1 wei, false);
      vaultInfo[vaultAddress].nft.transferFrom(msg.sender, address(this), tokenId);
      emit NFTListCreated(vaultAddress, tokenId, msg.sender, address(this), price, false);
  }

    function updateListing(address vaultAddress, uint256 tokenId, uint256 price) public nonReentrant {
      require(vaultInfo[vaultAddress].isCreated == true, "NFT is not confiruged in this contract");
      require(vaultInfo[vaultAddress].nft.ownerOf(tokenId) == address(this), "NFT not yours");
      require(vaultItems[vaultAddress][tokenId].seller !=  0x0000000000000000000000000000000000000000, "NFT is not listed");
      require(price > 0, "Amount must be higher than 0");
      vaultItems[vaultAddress][tokenId].price =  price * 1 wei;
  }

  function buyNft(address vaultAddress, uint256 tokenId) public payable nonReentrant {
      uint256 price = vaultItems[vaultAddress][tokenId].price * 1 wei;
      require(msg.value == price, "Transfer Total Amount to complete transaction");
      uint256 marketplaceFee = (price * marketPlaceRoyalty) / 10000; // Divide by 10000 to equal percentage
      uint256 creatorRoyalty = (price * vaultInfo[vaultAddress].creatorRoyalties) / 10000; // Divide by 10000 to equal percentage
      if(marketPlaceRoyalty > 0) {
        payable(royaltyWallet).transfer(marketplaceFee);
      }

      if(creatorRoyalty > 0) {
        payable(vaultInfo[vaultAddress].royaltyPayoutAddress).transfer(creatorRoyalty);
      }
      vaultItems[vaultAddress][tokenId].seller.transfer(msg.value - marketplaceFee - creatorRoyalty);
      vaultInfo[vaultAddress].nft.transferFrom(address(this), msg.sender, tokenId);
      vaultItems[vaultAddress][tokenId].sold = true;
      delete vaultItems[vaultAddress][tokenId];
      vaultInfo[vaultAddress].totalVolume += price;
      emit NFTPurchased(vaultAddress, tokenId, msg.sender, price, true);
  }

  function cancelSale(address vaultAddress, uint256 tokenId) public nonReentrant {
      require(vaultItems[vaultAddress][tokenId].seller == msg.sender, "NFT not yours");
      vaultInfo[vaultAddress].nft.transferFrom(address(this), msg.sender, tokenId);
      delete vaultItems[vaultAddress][tokenId];
  }
  
  function getPrice(address vaultAddress, uint256 tokenId) public view returns (uint256) {
      uint256 price = vaultItems[vaultAddress][tokenId].price;
      return price;
  }

 function nftListings(address vaultAddress) public view returns (List[] memory) {
    uint256 nftCount = vaultInfo[vaultAddress].nft.totalSupply();
    uint currentIndex = 0;
    List[] memory items = new List[](nftCount);
    for (uint i = 0; i <= nftCount; i++) {
        if (vaultItems[vaultAddress][i].holder == address(this)) {
          uint currentId = i;
          List storage currentItem = vaultItems[vaultAddress][currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
    }
    return items;
  }

  function onERC721Received(
        address,
        address from,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
      require(from == address(0x0), "Cannot send nfts to Vault directly");
      return IERC721Receiver.onERC721Received.selector;
    }
  
    function withdraw() public payable onlyOwner() {
      require(payable(msg.sender).send(address(this).balance));
    }
  
}

