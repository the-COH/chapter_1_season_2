pragma solidity ^0.8.0;

import "../contracts/utils/math/SafeMath.sol";
import "../contracts/access/Ownable.sol";
import "../contracts/utils/Address.sol";
import "../contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../contracts/utils/Counters.sol";
import "./Auth.sol";

contract CANTOCRABS is ERC721Enumerable, Auth {
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    string private _baseUri;
    string private _fileExtension;

    Counters.Counter tokenCounter;

    uint256 private mintPrice;
    uint256 private MAX_SUPPLY = 3333;

    address private fundAddress;

    constructor() ERC721("Canto Crabs", "CRAB") Auth(msg.sender) {
        mintPrice = 0 ether;
        fundAddress = msg.sender;
    }

    function setMintPrice(uint256 newPrice) external authorized {
        mintPrice = newPrice;
    }

    function getCurrentTokenCount() external view returns (uint256) {
        return tokenCounter.current();
    }

    function setBaseUri(string memory uri) public authorized {
        _baseUri = uri;
    }

    function setFileExtension(string memory ext) public authorized {
        _fileExtension = ext;
    }

    function uint2str(uint256 _i)
        internal
        pure
        returns (string memory _uintAsString)
    {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(_baseUri, uint2str(tokenId), _fileExtension)
            );
    }

    function mintNFTs(uint256 numberOfNfts) external payable {
        uint256 totalCost = numberOfNfts * mintPrice;

        require(msg.value == totalCost, "Not enough Canto");
        require(tokenCounter.current() < MAX_SUPPLY, "Supply Minted");
        payable(fundAddress).transfer(msg.value);
        for (uint256 i = 0; i < numberOfNfts; i++) {
            tokenCounter.increment();
            uint256 _tokenId = tokenCounter.current();
            require(_tokenId <= MAX_SUPPLY, "Supply minted");
            _safeMint(msg.sender, _tokenId);
        }
    }
}
