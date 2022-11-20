# Carbon Package Manager

Carbon is a package manager for EVM smart contracts. Instead of the traditional monolithic smart contract architecture, Carbon uses ERC-2535 (Diamond Proxy) to organize smart contracts into packages that can be configured and managed independently.

To get started with Carbon, we first deploy a blank diamond proxy contract. This proxy contract will keep the state of the smart contract, and will act as a workspace where pre-built packages can be install and configured to add new features.

For example, to deploy an NFT on Carbon, you would first deploy a blank contract, and install the ERC721 packages. This will add the ERC721 interface functions to the contract, and also expose a few management functions that only the owner of the contract can call to configure settings such as the name and symbol of the NFT. If, later on, you want to add staking mechanism to your NFT, you just need to install the ERC721 Staking package. If, after time, you decide that you no longer want staking, you can also remove the package and staking would no longer be available.

Some packages are dependent on other packages. For example ERC721 Enumeration package which provides functions such as `totalSupply` is dependent on the ERC721 Base package. We have built simple dependency management logic into Carbon so dependencies are automatically selected during an installation process.

In addition to using the pre-built packages (currently on ERC721, and we'll be adding ERC20, DAO governance, multi-sig, etc.), you can also write custom packages that can be installed into your proxy contract.

Finally, the crypto community sometimes distrust contracts that are upgradeable, which is the case for contracts created using Carbon. There is also an option for the owner of the contrack to renounce it so the proxy contract is effectively locked and no additional packages can be added or removed from the contract.