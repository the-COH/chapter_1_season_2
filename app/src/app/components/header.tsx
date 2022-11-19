import React from 'react';
import { Wallet } from '../wallet';

export const Header: React.FC = () => (
	<div className="flex items-center fixed top-0 inset-x-0 bg-[#161616] px-[40px] py-[47px] z-10">
		<div className="text-[40px] leading-[48px] grow text-white">CANTRACT</div>

		<Wallet />
	</div>
);
