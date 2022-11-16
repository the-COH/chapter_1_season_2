import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter"
import "@nomiclabs/hardhat-etherscan";
import "hardhat-nodemon";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    cantoTest: {
      url: 'https://eth.plexnode.wtf',
      chainId: 740,
      accounts: [``]
    },
    cantoMainnet: {
      url: 'https://canto.slingshot.finance',
      chainId: 7700,
      accounts: [``]
    }
  },  
  solidity: {
    version: "0.8.16",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};

export default config;
