import React, { createContext, useContext, useEffect, useRef } from "react";
import { StoreContext } from "../store";

import MetaMaskOnboarding from "@metamask/onboarding";

const useConnect = () => {
  let store = useContext(StoreContext);
  const onboarding = useRef<MetaMaskOnboarding>();

  useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  useEffect(() => {
    // function handleChangeChain
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      ethereum
        .request({ method: "eth_requestAccounts" })
        .then(handleNewAccounts);
      ethereum.request({ method: "net_version" }).then(handleNewChain);
      ethereum.on("accountsChanged", handleNewAccounts);
      ethereum.on("chainChanged", handleNewChain);
      return () => {
        // ethereum.off("accountsChanged", handleNewAccounts);
      };
    }
  }, []);

  const handleNewAccounts = (newAccounts: any) => {
    store.walletStore.address = newAccounts[0];
  };
  const handleNewChain = (newChainId: any) => {
    store.walletStore.chainId = newChainId;
  };

  const connect = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      ethereum.enable();
      ethereum.request({ method: "net_version" }).then(handleNewChain);
      ethereum
        .request({ method: "personal_sign" })
        .then((result: any) => console.log("personal_sign", result));
      ethereum
        .request({ method: "eth_requestAccounts" })
        .then(
          (newAccounts: any) => (store.walletStore.address = newAccounts[0])
        );
    } else {
      onboarding.current?.startOnboarding();
    }
  };

  const disconnect = () => {
    store.walletStore.address = "";
    store.walletStore.chainId = "";
  };

  return {
    connect,
    disconnect,
  };
};

export default useConnect;
