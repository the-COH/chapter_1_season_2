/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Distributor, DistributorInterface } from "../Distributor";

const _abi = [
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
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "enum Reward.Type",
        name: "rewardType",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "key",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "ratio",
        type: "uint256",
      },
    ],
    name: "addDistribution",
    outputs: [
      {
        internalType: "uint256",
        name: "distributionId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "allDestributions",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "target",
            type: "address",
          },
          {
            internalType: "enum Reward.Type",
            name: "rewardType",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "key",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "ratio",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalDistributeAmount",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
        ],
        internalType: "struct IDistributor.Distribution[]",
        name: "",
        type: "tuple[]",
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
        internalType: "contract ERC20Mint",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "distribute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "distributionHistories",
    outputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "enum Reward.Type",
        name: "rewardType",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "key",
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
        name: "",
        type: "uint256",
      },
    ],
    name: "distributions",
    outputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "enum Reward.Type",
        name: "rewardType",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "key",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "ratio",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalDistributeAmount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentRound",
    outputs: [
      {
        internalType: "uint256",
        name: "round",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastRoundHeight",
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
        name: "newOwner",
        type: "address",
      },
    ],
    name: "migrate",
    outputs: [],
    stateMutability: "nonpayable",
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
    inputs: [
      {
        internalType: "uint256",
        name: "distributionId",
        type: "uint256",
      },
    ],
    name: "removeDistribution",
    outputs: [],
    stateMutability: "nonpayable",
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
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "rounds",
    outputs: [
      {
        internalType: "uint256",
        name: "distributionAmount",
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
        name: "_beto",
        type: "address",
      },
    ],
    name: "setBeto",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_vesting",
        type: "address",
      },
    ],
    name: "setVesting",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalDistributeAmount",
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
    inputs: [],
    name: "vesting",
    outputs: [
      {
        internalType: "contract IVesting",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061001a3361001f565b61006f565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6110b38061007e6000396000f3fe608060405234801561001057600080fd5b50600436106101365760003560e01c80638c65c81f116100b2578063ab99f68211610081578063e4fc6b6d11610066578063e4fc6b6d14610281578063f2fde38b14610289578063f869fab91461029c57600080fd5b8063ab99f6821461025b578063ce5494bb1461026e57600080fd5b80638c65c81f1461020c5780638da5cb5b1461021f5780639398f69914610230578063a32bf5971461025357600080fd5b8063459d37f511610109578063715018a6116100ee578063715018a6146101f25780637ee05a3e146101fa57806387b6d2561461020357600080fd5b8063459d37f5146101be5780636f6ff3bc146101df57600080fd5b8063037699561461013b5780632f5c69ed146101595780634487d3df1461016e57806344c63eec14610193575b600080fd5b6101436102af565b6040516101509190610dae565b60405180910390f35b61016c610167366004610e56565b610388565b005b61018161017c366004610e78565b6103b2565b60405161015096959493929190610e91565b6002546101a6906001600160a01b031681565b6040516001600160a01b039091168152602001610150565b6101d16101cc366004610ed3565b61040b565b604051908152602001610150565b61016c6101ed366004610e56565b61052e565b61016c610558565b6101d160035481565b6101d160045481565b6101d161021a366004610e78565b61056c565b6000546001600160a01b03166101a6565b61024361023e366004610f1b565b61058d565b6040516101509493929190610f3d565b6005546101d1565b61016c610269366004610e78565b6105e2565b61016c61027c366004610e56565b610624565b61016c6106a7565b61016c610297366004610e56565b610c37565b6001546101a6906001600160a01b031681565b60606007805480602002602001604051908101604052809291908181526020016000905b8282101561037f5760008481526020908190206040805160c081019091526005850290910180546001600160a01b03811683529192909190830190600160a01b900460ff16600181111561032957610329610d76565b600181111561033a5761033a610d76565b8152600182810154602080840191909152600284015460408401526003840154606084015260049093015460ff161515608090920191909152918352920191016102d3565b50505050905090565b610390610ccc565b600180546001600160a01b0319166001600160a01b0392909216919091179055565b600781815481106103c257600080fd5b6000918252602090912060059091020180546001820154600283015460038401546004909401546001600160a01b038416955060ff600160a01b90940484169492939192911686565b6000610415610ccc565b60076040518060c00160405280876001600160a01b0316815260200186600181111561044357610443610d76565b81526020808201879052604082018690526000606083018190526001608090930183905284548084018655948152819020835160059095020180546001600160a01b031981166001600160a01b039096169586178255918401519394909392849274ffffffffffffffffffffffffffffffffffffffffff191690911790600160a01b9084908111156104d7576104d7610d76565b02179055506040820151600182810191909155606083015160028301556080830151600383015560a0909201516004909101805460ff19169115159190911790556007546105259190610f82565b95945050505050565b610536610ccc565b600280546001600160a01b0319166001600160a01b0392909216919091179055565b610560610ccc565b61056a6000610d26565b565b6005818154811061057c57600080fd5b600091825260209091200154905081565b600660205281600052604060002081815481106105a957600080fd5b60009182526020909120600390910201805460018201546002909201546001600160a01b0382169450600160a01b90910460ff16925084565b6105ea610ccc565b6000600782815481106105ff576105ff610f99565b60009182526020909120600590910201600401805460ff191691151591909117905550565b61062c610ccc565b6001546040517ff2fde38b0000000000000000000000000000000000000000000000000000000081526001600160a01b0383811660048301529091169063f2fde38b90602401600060405180830381600087803b15801561068c57600080fd5b505af11580156106a0573d6000803e3d6000fd5b5050505050565b6005546103e88110156108af57600061014d82106106f55761029b82106106d8576969e10de76676d08000006106e4565b69d3c21bcecceda10000005b69ffffffffffffffffffff16610702565b6a013da329b63364718000005b6affffffffffffffffffffff1690506000620f42406107248362030d40610faf565b61072e9190610fce565b9050600061073c8284610ff0565b6001546040517f40c10f19000000000000000000000000000000000000000000000000000000008152306004820152602481018390529192506001600160a01b0316906340c10f1990604401600060405180830381600087803b1580156107a257600080fd5b505af11580156107b6573d6000803e3d6000fd5b505060015460025460405163095ea7b360e01b81526001600160a01b039182166004820152602481018790529116925063095ea7b391506044016020604051808303816000875af115801561080f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108339190611008565b506002546040517fc9e9fe9c000000000000000000000000000000000000000000000000000000008152600481018490526001600160a01b039091169063c9e9fe9c90602401600060405180830381600087803b15801561089357600080fd5b505af11580156108a7573d6000803e3d6000fd5b505050505050505b6001546040517f70a082310000000000000000000000000000000000000000000000000000000081523060048201526000916001600160a01b0316906370a0823190602401602060405180830381865afa158015610911573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610935919061102a565b905080600360008282546109499190610ff0565b9091555050604080516020810190915281815260058054600181018255600091825291517f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db0909201919091555b600754811015610c2e576000600782815481106109b5576109b5610f99565b60009182526020909120600590910201600481015490915060ff1615610c1b576000620f42408260020154856109eb9190610faf565b6109f59190610fce565b600154835460405163095ea7b360e01b81526001600160a01b03918216600482015260248101849052929350169063095ea7b3906044016020604051808303816000875af1158015610a4b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a6f9190611008565b5080826003016000828254610a849190610ff0565b9091555050815460018301546040517f4a41baaa0000000000000000000000000000000000000000000000000000000081526001600160a01b03831692634a41baaa92610ae192600160a01b90920460ff16918690600401611043565b600060405180830381600087803b158015610afb57600080fd5b505af1158015610b0f573d6000803e3d6000fd5b50506005546006925060009150610b2890600190610f82565b8152602080820192909252604090810160002081516080810190925284546001600160a01b03811683529092820190600160a01b900460ff166001811115610b7257610b72610d76565b8152602080820185905260018681015460409093019290925283548083018555600094855293819020835160039095020180546001600160a01b031981166001600160a01b039096169586178255918401519394909392849274ffffffffffffffffffffffffffffffffffffffffff191690911790600160a01b908490811115610bfe57610bfe610d76565b021790555060408201518160010155606082015181600201555050505b5080610c2681611062565b915050610996565b50504360045550565b610c3f610ccc565b6001600160a01b038116610cc05760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f646472657373000000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b610cc981610d26565b50565b6000546001600160a01b0316331461056a5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610cb7565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b634e487b7160e01b600052602160045260246000fd5b60028110610daa57634e487b7160e01b600052602160045260246000fd5b9052565b602080825282518282018190526000919060409081850190868401855b82811015610e2d5781516001600160a01b03815116855286810151610df288870182610d8c565b508086015185870152606080820151908601526080808201519086015260a09081015115159085015260c09093019290850190600101610dcb565b5091979650505050505050565b80356001600160a01b0381168114610e5157600080fd5b919050565b600060208284031215610e6857600080fd5b610e7182610e3a565b9392505050565b600060208284031215610e8a57600080fd5b5035919050565b6001600160a01b038716815260c08101610eae6020830188610d8c565b85604083015284606083015283608083015282151560a0830152979650505050505050565b60008060008060808587031215610ee957600080fd5b610ef285610e3a565b9350602085013560028110610f0657600080fd5b93969395505050506040820135916060013590565b60008060408385031215610f2e57600080fd5b50508035926020909101359150565b6001600160a01b038516815260808101610f5a6020830186610d8c565b60408201939093526060015292915050565b634e487b7160e01b600052601160045260246000fd5b600082821015610f9457610f94610f6c565b500390565b634e487b7160e01b600052603260045260246000fd5b6000816000190483118215151615610fc957610fc9610f6c565b500290565b600082610feb57634e487b7160e01b600052601260045260246000fd5b500490565b6000821982111561100357611003610f6c565b500190565b60006020828403121561101a57600080fd5b81518015158114610e7157600080fd5b60006020828403121561103c57600080fd5b5051919050565b606081016110518286610d8c565b602082019390935260400152919050565b600060001982141561107657611076610f6c565b506001019056fea26469706673582212206012e06fc157447589690b1b8907f8de8a93510954f2c83dc17e81fb1551bed964736f6c634300080b0033";

export class Distributor__factory extends ContractFactory {
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
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Distributor> {
    return super.deploy(overrides || {}) as Promise<Distributor>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Distributor {
    return super.attach(address) as Distributor;
  }
  connect(signer: Signer): Distributor__factory {
    return super.connect(signer) as Distributor__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DistributorInterface {
    return new utils.Interface(_abi) as DistributorInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Distributor {
    return new Contract(address, _abi, signerOrProvider) as Distributor;
  }
}