import React, { useContext } from 'react';
import { WalletContext } from '../../contexts/wallet-context';

export const ConnectWallet = () => {
	const { connectWallet } = useContext(WalletContext);

	return (
		<div className="flex flex-col font-[Receipt]">
			<div className="flex flex-col bg-black pt-[315px] pb-[100px] items-center">
				<div className="text-[80px] leading-[96px] text-white">*** CARBON ***</div>
				<button
					className="text-[38px] leading-[45px] text-white border border-white rounded-[5px] w-full max-w-[750px] h-[86px] mt-[130px]"
					type="button"
					onClick={connectWallet}
				>
					Connect Wallet
				</button>
			</div>

			<div className="flex justify-center mt-[70px]">
				<img className="w-[128px] h-[128px] mr-[125px]" src="/assets/images/block-icon.png" alt="" />
				<img className="w-[128px] h-[128px] mr-[125px]" src="/assets/images/block-icon.png" alt="" />
				<img className="w-[128px] h-[128px]" src="/assets/images/block-icon.png" alt="" />
			</div>
		</div>

	);
};
