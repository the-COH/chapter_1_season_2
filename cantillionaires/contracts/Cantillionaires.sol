// SPDX-License-Identifier: MIT
//
// CANTILLIONARIES
// cantillionaires.com
// 2022
//

pragma solidity ^0.8.16;

import "erc721a/contracts/extensions/ERC721AQueryable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Cantillionaires is ERC721AQueryable, ERC2981, Ownable {

  string public baseURI;
  address public royaltyRecipient;
  uint256 public royaltyAmount = 500;
  uint256 public price; 

  uint256 public immutable CBD_MINT_LIMIT;
  uint256 public immutable TOTAL_LIMIT;

  uint256 public cbdClaimedCount;
  
  address public w1;
  address public w2;
  address public w3;
  address public w4;

  mapping(address => bool) private cbdClaims;

  bool public isSaleActive = false;
  bool public forBuddiesOnly = true;

  bytes32 private cbdMerkleRoot;
  bytes32 private BuddiesMerkleRoot;

  error NotOpen();
  error GiantError();
  error BuddiesOnly();
  error TooMany();
  error ZeroMintError();
  error BadCanto(uint256 expected);

  constructor(
    uint256 cbdMintLimit,
    uint256 totalLimit,
    uint256 _price,
    string memory _baseUri,
    address _royaltyRecipient
    ) ERC721A("Cantillionaires", "CNTL") {
    CBD_MINT_LIMIT = cbdMintLimit;
    TOTAL_LIMIT = totalLimit;
    price = _price;
    baseURI = _baseUri;
    royaltyRecipient = _royaltyRecipient;
  }

  function setCBDMerkleRoot(bytes32 merkRoot) external onlyOwner {
    cbdMerkleRoot = merkRoot;
  }

  function setBuddiesMerkleRoot(bytes32 merkRoot) external onlyOwner {
    BuddiesMerkleRoot = merkRoot;
  }  

  function setPayees(address _w1, address _w2, address _w3, address _w4) public onlyOwner {
    w1 = _w1;
    w2 = _w2;
    w3 = _w3;
    w4 = _w4;
  }

  function toggleIsSaleActive() public onlyOwner {
    isSaleActive = !isSaleActive;
  }

  function toggleForBuddiesOnly()  public onlyOwner {
    forBuddiesOnly = !forBuddiesOnly;
  }

  function setPrice(uint256 _price) public onlyOwner {
    price = _price;
  }

  // Checks if the given address gets a free CBD mint.
  // This isn't a general "are you ever entitled?" check, it's a "right now, given everything, do you get one for free?".
  function entitledToFreeMintFromCBD(address a, bytes32[] memory cbdMerkleProof) public view returns (bool){
    if(cbdClaimedCount + 1 > CBD_MINT_LIMIT){
      return false;
    }
    bytes32 l = keccak256(abi.encodePacked(a));
    bool inTree = MerkleProof.verify(cbdMerkleProof, cbdMerkleRoot, l);
    return !cbdClaims[a] && inTree;
  }

  // Are you in the Buddy List?
  // Check if `forBuddiesOnly` is enabled to determine if this actually gets you anything.
  function isAddressInBuddyList(address a, bytes32[] memory buddyMerkleProof) public view returns (bool) {
    bytes32 l = keccak256(abi.encodePacked(a));
    return MerkleProof.verify(buddyMerkleProof, BuddiesMerkleRoot, l);
  }

  function mint(uint256 numToMint, bytes32[] memory cbdMerkleProof, bytes32[] memory buddyMerkleProof) public payable {

    if(!isSaleActive){
      revert NotOpen();
    }

    if(numToMint == 0){
     revert ZeroMintError(); 
    }

    if(forBuddiesOnly && !isAddressInBuddyList(msg.sender, buddyMerkleProof)){
     revert BuddiesOnly(); 
    }

    // Do we even have enough left?
    if(_totalMinted() + numToMint > TOTAL_LIMIT){
      revert TooMany();
    }

    uint256 numToCharge = numToMint;
    if(entitledToFreeMintFromCBD(msg.sender, cbdMerkleProof)){
      numToCharge = numToCharge - 1;
      cbdClaims[msg.sender] = true;
      cbdClaimedCount = cbdClaimedCount + 1;
    }

    uint256 requiredCanto = numToCharge * price;

    if(msg.value != requiredCanto){
      revert BadCanto(requiredCanto);
    }

    _mint(msg.sender, numToMint);    
  }

  function _baseURI() internal view override returns (string memory) {
    return baseURI;
  }

  function setBaseURI(string calldata newURI) external onlyOwner {
    baseURI = newURI;
  }

  function _startTokenId() internal view virtual override returns (uint256) {
    return 1;
  }

  function royaltyInfo(uint256, uint256 salePrice)
  public
  view
  virtual
  override
  returns (address, uint256)
  {
    return (royaltyRecipient, (salePrice * royaltyAmount) / 10000);
  }

  function setRoyaltyInfo(address _royaltyRecipient, uint256 _royaltyAmount) external onlyOwner
  {
    royaltyRecipient = _royaltyRecipient;
    royaltyAmount = _royaltyAmount;
  }

  // Debug only.
  function setCbdClaimedCount(uint256 newVal) public onlyOwner {
    cbdClaimedCount = newVal;
  }

  // Debug only
  function updateCbdClaims(address a) public onlyOwner {
    cbdClaims[a] = true;
  }

  function distributeFunds() public onlyOwner {
    uint256 balance = address(this).balance;
    uint256 perWalletChunk = balance / 100 * 25;

    address[4] memory recips = [w1, w2, w3, w4];
    for (uint i = 0; i < recips.length; i++) {
      (bool success, ) = payable(address(recips[i])).call{
        value: perWalletChunk
        }("");
        if (!success) {
          revert GiantError();
        }
      }
    }

    function withdrawTokens(address _token, uint256 _amount) onlyOwner external {
      bool success = IERC20(_token).transfer(msg.sender, _amount);
      if (!success) {
        revert GiantError();
      }    
    }

    function supportsInterface(bytes4 _interfaceId)
    public
    view
    virtual
    override(ERC721A, IERC721A, ERC2981)
    returns (bool)
    {
      return
      super.supportsInterface(_interfaceId) ||
      ERC2981.supportsInterface(_interfaceId) ||
      ERC721A.supportsInterface(_interfaceId);
    }

    receive() external payable {}  
  }
