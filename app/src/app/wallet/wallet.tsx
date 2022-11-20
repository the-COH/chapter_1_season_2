import { isEmpty } from 'lodash';
import React, { useContext } from 'react';
import { WalletContext } from '../../contexts/wallet-context';

export const Wallet = () => {
	const { account, connectWallet } = useContext(WalletContext);

	const style = 'text-[18px] leading-[21px] text-white border border-white rounded-[5px] w-[215px] h-[42px]';
	return (
		isEmpty(account)
			? <button className={style} type="button" onClick={connectWallet}>Connect Wallet</button>
			: (
				<button className={style} type="button">
					{account.slice(0, 6)}
					...
					{account.slice(account.length - 4, account.length)}
				</button>
			)
	);
};
