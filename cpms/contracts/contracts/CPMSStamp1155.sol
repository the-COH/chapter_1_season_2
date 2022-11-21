// SPDX-License-Identifier: MIT

/*

CPMS Stamp ERC1155 NFT

Work in progress! 

This maintains a collection of CPMS Stamps.
All metadata is on-chain, include the base64 encoded tiny GIF image.

This enables the CPMS Letter to be bound to a CPMS Stamp, and render the stamp in its view.

Additional features:

A stamp has an optional reference to an external contract for additional eligiblity checking. 
This could be used to, e.g, support an allow list mint for a specific stamp, rather than an open mint.

See the `Stamp` struct for additional config.

The contract supports two access roles:
- An admin for managing funds and granting access, 
- A staff role for adjusting the Stamp metadata.

The creation of a Letter will bind the Stamp to that Letter, for display purposes, and burn the owners stamp.

TODO: Nicer comments, burn functionality, support for eligibilityCheckerAddress contract.

*/

pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract CPMSStamp1155 is ERC1155, ERC1155Supply, AccessControl {
  string public name = "CPMS Stamp";
  string public symbol = "CPMS_ST";

  using Counters for Counters.Counter;

  // Users with this role can manage stamp data.
  bytes32 public constant STAMP_ROLE = keccak256("STAMP_ROLE");

  struct Stamp {
    string name;
    string description;
    string attributes; // JSON string of the attributes for the metadata. Not escaped, should just be a string of valid JSON, e.g, '{"season": "1", "artist": "Someone"}'
    string dataUri; // This is the store of the actual stamp image. Be sure to compress!y    
    uint price;
    uint maxSupply; // How many of this stamp are available?
    uint maxAmountPerWallet;
    bool saleActive; // Allows togglign the availability of this stamp.
    bool hasEligibilityCheck; // If false we don't have to bother with that checker.
    address eligibilityCheckerAddress; // The address we'll proxy elgibility checks to.
  }

  error InvalidTokenID();

  mapping (uint => Stamp) public stamps;

  // Triggers when we setup a new stamp
  event NewStampSetup(uint);

  Counters.Counter private stampCounter;

  modifier onlyAdmin {
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Admin role required for this action");
    _;
  }

  modifier onlyStaff {
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || hasRole(STAMP_ROLE, msg.sender), "Staff role required for this action");
    _;
  }

  constructor(string memory uri_) ERC1155(uri_) {
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender); // Make sure the deployer is an admin.
  }

  function initStamp(Stamp calldata stamp) public onlyStaff {
    require(stamp.maxSupply > 0, "can't setup a 0 supply object");
    require(stamp.maxAmountPerWallet > 0, "maxAmountPerWallet should be greater than 0");
  
    stamps[stampCounter.current()] = stamp;
    
    // Tell the world:
    emit NewStampSetup(stampCounter.current());

    // Bump us up so we're ready for the next one.
    stampCounter.increment();
  }

  // Replaces the object at the given `stampId` with a new Stamp consisting of the given struct.
  function updateStamp(uint stampId, Stamp calldata stamp) public onlyStaff {
    stamps[stampId] = stamp;
  }

  // Returns the newest Stamp's ID.
  function currentStampId() external view returns (uint){
    // The counter gets incremented after a new object is setup,
    // so we subtract one to get the actual current ID of the most recently created stamp.
    return stampCounter.current() - 1;
  }  

  function uri(uint256 tokenId) public view virtual override returns (string memory) {
    return string(abi.encodePacked(ERC1155.uri(tokenId), Strings.toString(tokenId), '.json'));
  }

  // TODO: the message container will probably call this
  function imageDataUri(uint256 tokenId) external view returns (string memory) {
    // This will blow up if you provide a token that doesn't exist, that's ok.
    Stamp memory s = stamps[tokenId];
    return s.dataUri;
  }

  function tokenURI(uint256 tokenId)
    public
    view
    returns (string memory)
  {
    if (tokenId > stampCounter.current()) revert InvalidTokenID();

    Stamp memory s = stamps[tokenId];

    bytes memory dataURI = abi.encodePacked(
        '{',
            '"name": "', s.name, '",',
            '"description": "', s.description, '",',
            '"image": "', s.dataUri, '",',
            '"attributes": ', s.attributes,
        '}'
    );
    return string(
        abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(dataURI)
        )
    );

  }

  function airdrop(uint stampId, uint count, address addr) public onlyAdmin {
    _mint(addr, stampId, count, "");
  }

  function withdrawTokens(IERC20 token) external onlyAdmin {
    uint256 balance = token.balanceOf(address(this));
    token.transfer(msg.sender, balance);
  }

  function withdrawAll() external onlyAdmin {
    payable(msg.sender).transfer(address(this).balance);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, AccessControl) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function _beforeTokenTransfer(
      address operator,
      address from,
      address to,
      uint256[] memory ids,
      uint256[] memory amounts,
      bytes memory data
  ) internal override(ERC1155, ERC1155Supply) {
      super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
  }

  receive() external payable {}  

}