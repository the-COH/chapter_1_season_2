/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Chip, ChipInterface } from "../Chip";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_beto",
        type: "address",
      },
      {
        internalType: "address",
        name: "_note",
        type: "address",
      },
      {
        internalType: "address",
        name: "_router",
        type: "address",
      },
      {
        internalType: "address",
        name: "_factory",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "PRECISION",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "beto",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "liquidity",
        type: "uint256",
      },
    ],
    name: "convertToChip",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "liquidity",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_totalLiquidity",
        type: "uint256",
      },
    ],
    name: "convertToChip",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chip",
        type: "uint256",
      },
    ],
    name: "convertToLiquidity",
    outputs: [
      {
        internalType: "uint128",
        name: "",
        type: "uint128",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountAddBeto",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountAddNote",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [
      {
        internalType: "uint256",
        name: "liquidityAdd",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountAddA",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountAddB",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "mintAmount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "note",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pair",
    outputs: [
      {
        internalType: "contract BaseV1Pair",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "router",
    outputs: [
      {
        internalType: "contract BaseV1Router01",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountAddBeto",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountAddNote",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "betoForNote",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "swapAmount",
        type: "uint256",
      },
    ],
    name: "swapAndMint",
    outputs: [
      {
        internalType: "uint256",
        name: "liquidity",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "mintAmount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalLiquidity",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint128",
        name: "amount",
        type: "uint128",
      },
    ],
    name: "withdraw",
    outputs: [
      {
        internalType: "uint256",
        name: "amountA",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountB",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60a060405264e8d4a510006080523480156200001a57600080fd5b506040516200250e3803806200250e8339810160408190526200003d91620003cc565b604051806040016040528060048152602001630434849560e41b815250604051806040016040528060048152602001630434849560e41b815250620000916200008b620002b560201b60201c565b620002b9565b8151620000a690600490602085019062000309565b508051620000bc90600590602084019062000309565b5050600680546001600160a01b03199081166001600160a01b0388811691821790935560078054831688851690811790915560098054909316878516179092556040516306801cc360e41b815260048101919091526024810191909152600060448201819052925090831690636801cc3090606401602060405180830381865afa1580156200014f573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062000175919062000429565b60095460405163e5e31b1360e01b81526001600160a01b03808416600483015292935091169063e5e31b1390602401602060405180830381865afa158015620001c2573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620001e891906200044e565b6200028e576040516320b7f73960e21b81526001600160a01b0386811660048301528581166024830152600060448301528316906382dfdce4906064016020604051808303816000875af115801562000245573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200026b919062000429565b600880546001600160a01b0319166001600160a01b0383161790559050620002aa565b600880546001600160a01b0319166001600160a01b0383161790555b5050505050620004af565b3390565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b828054620003179062000472565b90600052602060002090601f0160209004810192826200033b576000855562000386565b82601f106200035657805160ff191683800117855562000386565b8280016001018555821562000386579182015b828111156200038657825182559160200191906001019062000369565b506200039492915062000398565b5090565b5b8082111562000394576000815560010162000399565b80516001600160a01b0381168114620003c757600080fd5b919050565b60008060008060808587031215620003e357600080fd5b620003ee85620003af565b9350620003fe60208601620003af565b92506200040e60408601620003af565b91506200041e60608601620003af565b905092959194509250565b6000602082840312156200043c57600080fd5b6200044782620003af565b9392505050565b6000602082840312156200046157600080fd5b815180151581146200044757600080fd5b600181811c908216806200048757607f821691505b60208210811415620004a957634e487b7160e01b600052602260045260246000fd5b50919050565b608051612043620004cb600039600061038c01526120436000f3fe608060405234801561001057600080fd5b50600436106101b95760003560e01c8063788254fd116100f9578063aaf5eb6811610097578063ee8b627d11610071578063ee8b627d1461041b578063f2fde38b1461042e578063f869fab914610441578063f887ea401461045457600080fd5b8063aaf5eb6814610387578063db1f4952146103ae578063dd62ed3e146103e257600080fd5b806398d5fdca116100d357806398d5fdca14610346578063a457c2d71461034e578063a8aa1b3114610361578063a9059cbb1461037457600080fd5b8063788254fd1461031a5780638da5cb5b1461032d57806395d89b411461033e57600080fd5b806323b872dd11610166578063395093511161014057806339509351146102c157806355a8f729146102d457806370a08231146102e7578063715018a61461031057600080fd5b806323b872dd1461027457806326d111f514610287578063313ce567146102b257600080fd5b806315770f921161019757806315770f921461022357806318160ddd146102395780631b2ef1ca1461024157600080fd5b806302387a7b146101be57806306fdde03146101eb578063095ea7b314610200575b600080fd5b6101d16101cc366004611c26565b610467565b604080519283526020830191909152015b60405180910390f35b6101f3610630565b6040516101e29190611c58565b61021361020e366004611cc9565b6106c2565b60405190151581526020016101e2565b61022b6106da565b6040519081526020016101e2565b60035461022b565b61025461024f366004611cf3565b610765565b6040805194855260208501939093529183015260608201526080016101e2565b610213610282366004611d15565b610d3f565b60075461029a906001600160a01b031681565b6040516001600160a01b0390911681526020016101e2565b604051601281526020016101e2565b6102136102cf366004611cc9565b610d65565b6102546102e2366004611d5f565b610da4565b61022b6102f5366004611d9e565b6001600160a01b031660009081526001602052604090205490565b6103186110bf565b005b61022b610328366004611db9565b6110d3565b6000546001600160a01b031661029a565b6101f3611100565b61022b61110f565b61021361035c366004611cc9565b6112c0565b60085461029a906001600160a01b031681565b610213610382366004611cc9565b61137a565b61022b7f000000000000000000000000000000000000000000000000000000000000000081565b6103c16103bc366004611db9565b611388565b6040516fffffffffffffffffffffffffffffffff90911681526020016101e2565b61022b6103f0366004611dd2565b6001600160a01b03918216600090815260026020908152604080832093909416825291909152205490565b61022b610429366004611cf3565b6113ad565b61031861043c366004611d9e565b6113c6565b60065461029a906001600160a01b031681565b60095461029a906001600160a01b031681565b60008061048633846fffffffffffffffffffffffffffffffff16611456565b6007546006546001600160a01b03918216911610600080826104ba576007546006546001600160a01b0391821691166104ce565b6006546007546001600160a01b0391821691165b60085460095460405163095ea7b360e01b81526001600160a01b0391821660048201526fffffffffffffffffffffffffffffffff8b166024820152939550919350169063095ea7b3906044016020604051808303816000875af1158015610539573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061055d9190611e05565b506009546001600160a01b0316630dede6c4838360008a8180336040516001600160e01b031960e08a901b1681526001600160a01b039788166004820152958716602487015293151560448601526fffffffffffffffffffffffffffffffff9092166064850152608484015260a48301529190911660c48201524260e48201526101040160408051808303816000875af11580156105ff573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106239190611e22565b9097909650945050505050565b60606004805461063f90611e46565b80601f016020809104026020016040519081016040528092919081815260200182805461066b90611e46565b80156106b85780601f1061068d576101008083540402835291602001916106b8565b820191906000526020600020905b81548152906001019060200180831161069b57829003601f168201915b5050505050905090565b6000336106d08185856115dc565b5060019392505050565b6008546040517f70a082310000000000000000000000000000000000000000000000000000000081523060048201526000916001600160a01b0316906370a0823190602401602060405180830381865afa15801561073c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107609190611e81565b905090565b6007546006546000918291829182916001600160a01b039182169116908110906323b872dd336040516001600160e01b031960e084901b1681526001600160a01b039091166004820152306024820152604481018a90526064016020604051808303816000875af11580156107de573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108029190611e05565b506007546001600160a01b03166323b872dd336040516001600160e01b031960e084901b1681526001600160a01b039091166004820152306024820152604481018990526064016020604051808303816000875af1158015610868573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061088c9190611e05565b50600654600954604051636eb1769f60e11b81523060048201526001600160a01b0391821660248201528992919091169063dd62ed3e90604401602060405180830381865afa1580156108e3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109079190611e81565b10156109895760065460095460405163095ea7b360e01b81526001600160a01b039182166004820152600019602482015291169063095ea7b3906044016020604051808303816000875af1158015610963573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109879190611e05565b505b600754600954604051636eb1769f60e11b81523060048201526001600160a01b0391821660248201528892919091169063dd62ed3e90604401602060405180830381865afa1580156109df573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a039190611e81565b1015610a855760075460095460405163095ea7b360e01b81526001600160a01b039182166004820152600019602482015291169063095ea7b3906044016020604051808303816000875af1158015610a5f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a839190611e05565b505b60008082610aa5576007546006546001600160a01b039182169116610ab9565b6006546007546001600160a01b0391821691165b9150915060008084610acc57898b610acf565b8a8a5b6009546040517f5a47ddc30000000000000000000000000000000000000000000000000000000081526001600160a01b0388811660048301528781166024830152600060448301819052606483018690526084830185905260a4830181905260c48301523060e4830152426101048301529395509193509190911690635a47ddc390610124016060604051808303816000875af1158015610b74573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b989190611e9a565b9a50909850965088610ba86106da565b1415610bb657889550610bd0565b610bcd898a610bc36106da565b6104299190611ede565b95505b610bda338761172c565b505050506000808215610c0457610bf1868a611ede565b9150610bfd8589611ede565b9050610c1d565b610c0e8689611ede565b9050610c1a858a611ede565b91505b8115610ca8576006546001600160a01b031663a9059cbb336040516001600160e01b031960e084901b1681526001600160a01b039091166004820152602481018590526044016020604051808303816000875af1158015610c82573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ca69190611e05565b505b8015610d33576007546001600160a01b031663a9059cbb336040516001600160e01b031960e084901b1681526001600160a01b039091166004820152602481018490526044016020604051808303816000875af1158015610d0d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d319190611e05565b505b50505092959194509250565b600033610d4d85828561180b565b610d5885858561189d565b60019150505b9392505050565b3360008181526002602090815260408083206001600160a01b03871684529091528120549091906106d09082908690610d9f908790611ef5565b6115dc565b6006546000908190819081906001600160a01b03166323b872dd336040516001600160e01b031960e084901b1681526001600160a01b039091166004820152306024820152604481018b90526064016020604051808303816000875af1158015610e12573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e369190611e05565b506007546001600160a01b03166323b872dd336040516001600160e01b031960e084901b1681526001600160a01b039091166004820152306024820152604481018a90526064016020604051808303816000875af1158015610e9c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ec09190611e05565b5060008087610ee1576007546006546001600160a01b039182169116610ef5565b6006546007546001600160a01b0391821691165b60095460405163095ea7b360e01b81526001600160a01b039182166004820152602481018b905292945090925083169063095ea7b3906044016020604051808303816000875af1158015610f4d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f719190611e05565b506009546040517f13dcfc59000000000000000000000000000000000000000000000000000000008152600481018990526000602482018190526001600160a01b0385811660448401528481166064840152608483018290523060a48401524260c4840152909216906313dcfc599060e4016000604051808303816000875af1158015611002573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261102a9190810190611f23565b9050881561106b5761103c888c611ede565b9a508060008151811061105157611051611fe1565b60200260200101518a6110649190611ef5565b99506110a0565b611075888b611ede565b99508060008151811061108a5761108a611fe1565b60200260200101518b61109d9190611ef5565b9a505b6110aa8b8b610765565b929e919d509b50909950975050505050505050565b6110c7611ab4565b6110d16000611b0e565b565b6000806110df60035490565b905060006110eb6106da565b90506110f8828583611b76565b949350505050565b60606005805461063f90611e46565b6009546006546007546040517f4386e63c0000000000000000000000000000000000000000000000000000000081526001600160a01b0392831660048201529082166024820152600060448201819052670de0b6b3a764000060648301529283928392911690634386e63c906084016040805180830381865afa15801561119a573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111be9190611e22565b6007546006549294509092506001600160a01b03908116911610600080826111e75783856111ea565b84845b6008546006546040517f9e8cc04b0000000000000000000000000000000000000000000000000000000081526001600160a01b039182166004820152670de0b6b3a7640000602482015260016044820152939550919350600092911690639e8cc04b90606401602060405180830381865afa15801561126d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112919190611e81565b905060006112a88285670de0b6b3a7640000611b76565b90506112b48382611ef5565b97505050505050505090565b3360008181526002602090815260408083206001600160a01b0387168452909152812054909190838110156113625760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f00000000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b61136f82868684036115dc565b506001949350505050565b6000336106d081858561189d565b60008061139460035490565b905060006113a06106da565b90506110f8848284611b76565b6000806113b960035490565b90506110f8818585611b76565b6113ce611ab4565b6001600160a01b03811661144a5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608401611359565b61145381611b0e565b50565b6001600160a01b0382166114d25760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f2061646472657360448201527f73000000000000000000000000000000000000000000000000000000000000006064820152608401611359565b6001600160a01b038216600090815260016020526040902054818110156115615760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e60448201527f63650000000000000000000000000000000000000000000000000000000000006064820152608401611359565b6001600160a01b0383166000908152600160205260408120838303905560038054849290611590908490611ede565b90915550506040518281526000906001600160a01b038516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef906020015b60405180910390a3505050565b6001600160a01b0383166116575760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460448201527f72657373000000000000000000000000000000000000000000000000000000006064820152608401611359565b6001600160a01b0382166116d35760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f20616464726560448201527f73730000000000000000000000000000000000000000000000000000000000006064820152608401611359565b6001600160a01b0383811660008181526002602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591016115cf565b6001600160a01b0382166117825760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152606401611359565b80600360008282546117949190611ef5565b90915550506001600160a01b038216600090815260016020526040812080548392906117c1908490611ef5565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b6001600160a01b038381166000908152600260209081526040808320938616835292905220546000198114611897578181101561188a5760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152606401611359565b61189784848484036115dc565b50505050565b6001600160a01b0383166119195760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460448201527f64726573730000000000000000000000000000000000000000000000000000006064820152608401611359565b6001600160a01b0382166119955760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201527f65737300000000000000000000000000000000000000000000000000000000006064820152608401611359565b6001600160a01b03831660009081526001602052604090205481811015611a245760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206260448201527f616c616e636500000000000000000000000000000000000000000000000000006064820152608401611359565b6001600160a01b03808516600090815260016020526040808220858503905591851681529081208054849290611a5b908490611ef5565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051611aa791815260200190565b60405180910390a3611897565b6000546001600160a01b031633146110d15760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401611359565b600080546001600160a01b038381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b600080806000198587098587029250828110838203039150508060001415611bb157838281611ba757611ba7611ff7565b0492505050610d5e565b808411611bbd57600080fd5b60008486880960026001871981018816978890046003810283188082028403028082028403028082028403028082028403028082028403029081029092039091026000889003889004909101858311909403939093029303949094049190911702949350505050565b600060208284031215611c3857600080fd5b81356fffffffffffffffffffffffffffffffff81168114610d5e57600080fd5b600060208083528351808285015260005b81811015611c8557858101830151858201604001528201611c69565b81811115611c97576000604083870101525b50601f01601f1916929092016040019392505050565b80356001600160a01b0381168114611cc457600080fd5b919050565b60008060408385031215611cdc57600080fd5b611ce583611cad565b946020939093013593505050565b60008060408385031215611d0657600080fd5b50508035926020909101359150565b600080600060608486031215611d2a57600080fd5b611d3384611cad565b9250611d4160208501611cad565b9150604084013590509250925092565b801515811461145357600080fd5b60008060008060808587031215611d7557600080fd5b84359350602085013592506040850135611d8e81611d51565b9396929550929360600135925050565b600060208284031215611db057600080fd5b610d5e82611cad565b600060208284031215611dcb57600080fd5b5035919050565b60008060408385031215611de557600080fd5b611dee83611cad565b9150611dfc60208401611cad565b90509250929050565b600060208284031215611e1757600080fd5b8151610d5e81611d51565b60008060408385031215611e3557600080fd5b505080516020909101519092909150565b600181811c90821680611e5a57607f821691505b60208210811415611e7b57634e487b7160e01b600052602260045260246000fd5b50919050565b600060208284031215611e9357600080fd5b5051919050565b600080600060608486031215611eaf57600080fd5b8351925060208401519150604084015190509250925092565b634e487b7160e01b600052601160045260246000fd5b600082821015611ef057611ef0611ec8565b500390565b60008219821115611f0857611f08611ec8565b500190565b634e487b7160e01b600052604160045260246000fd5b60006020808385031215611f3657600080fd5b825167ffffffffffffffff80821115611f4e57600080fd5b818501915085601f830112611f6257600080fd5b815181811115611f7457611f74611f0d565b8060051b604051601f19603f83011681018181108582111715611f9957611f99611f0d565b604052918252848201925083810185019188831115611fb757600080fd5b938501935b82851015611fd557845184529385019392850192611fbc565b98975050505050505050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601260045260246000fdfea26469706673582212206e2d84dc041b6ce8eb97e3b19713cbe68a1ecc63240b639185d61789d223e43064736f6c634300080b0033";

export class Chip__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    _beto: string,
    _note: string,
    _router: string,
    _factory: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Chip> {
    return super.deploy(
      _beto,
      _note,
      _router,
      _factory,
      overrides || {}
    ) as Promise<Chip>;
  }
  getDeployTransaction(
    _beto: string,
    _note: string,
    _router: string,
    _factory: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _beto,
      _note,
      _router,
      _factory,
      overrides || {}
    );
  }
  attach(address: string): Chip {
    return super.attach(address) as Chip;
  }
  connect(signer: Signer): Chip__factory {
    return super.connect(signer) as Chip__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ChipInterface {
    return new utils.Interface(_abi) as ChipInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Chip {
    return new Contract(address, _abi, signerOrProvider) as Chip;
  }
}