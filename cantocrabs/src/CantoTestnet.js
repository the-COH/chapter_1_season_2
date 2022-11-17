import { Chain } from "@usedapp/core";

export const CantoTestnet = {
    chainId: 470,
    chainName: "Canto Testnet",
    isTestChain: true,
    isLocalChain: false,
    multicallAddress: "0x801Fa29E004C46CAc9B3293E88C2315c0ff787DF",
    getExplorerAddressLink: (address) =>
        `https://testnet-explorer.canto.neobase.one/address/${address}`,
    getExplorerTransactionLink: (transactionHash) =>
        `https://testnet-explorer.canto.neobase.one/tx/${transactionHash}`,
    // Optional parameters:
    rpcUrl: "https://eth.plexnode.wtf/",
    blockExplorerUrl: "https://testnet-explorer.canto.neobase.one",
    nativeCurrency: {
        name: "Canto",
        symbol: "CANTO",
        decimals: 18,
    },
};