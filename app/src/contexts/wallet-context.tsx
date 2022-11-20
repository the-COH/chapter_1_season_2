import React, { createContext, ProviderProps, useCallback, useEffect, useMemo, useState } from 'react';
import { isEmpty, isNil, noop } from 'lodash';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';

export namespace WalletContext {
	export type Value = {
		connectWallet: () => void;
		account: string;
		provider: Web3Provider;
	};
}

export const WalletContext = createContext<WalletContext.Value>({
	connectWallet: noop,
	account: null,
	provider: null,
});
WalletContext.displayName = 'Wallet Context';

export const WalletProvider = ({ children }: Partial<ProviderProps<WalletContext.Value>>) => {
	// ===================================
	// States
	// ===================================

	const [account, setAccount] = useState<string>();
	const provider = useMemo(() => new ethers.providers.Web3Provider(window.ethereum), []);

	// ===================================
	// Exported Methods
	// ===================================

	const connectWallet = useCallback(() => {
		if (!isNil(provider)) {
			provider
				.send('eth_requestAccounts', [])
				.then(([account]: string[]) => {
					setAccount(account);
				});
		}
	}, [provider]);

	// ===================================
	// Effects
	// ===================================

	useEffect(() => {
		const onAccountChange = () => {
			provider
				.send('eth_accounts', [])
				.then((accounts: string[]) => {
					if (isEmpty(accounts)) {
						setAccount(null);
					} else {
						setAccount(accounts[0]);
					}
				});
		};

		window.ethereum.on('accountsChanged', onAccountChange);
		onAccountChange();

		return () => {
			window.ethereum.off('accountsChange', onAccountChange);
		};
	}, [provider]);

	// ===================================
	// Exports
	// ===================================

	const value = useMemo<WalletContext.Value>(() => ({
		connectWallet,
		account,
		provider,
	}), [connectWallet, account, provider]);

	return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};
