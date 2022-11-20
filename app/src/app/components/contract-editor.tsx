import React, { useState } from 'react';
import { BlockState } from '../enums/block-state';
import { ContractBlock } from './contract-block';

export const ContractEditor = () => {
	const [name, setName] = useState('Project Name');

	const blocks = [
		{
			name: 'ERC 721',
			description: 'NFT COLLECTION',
			state: BlockState.Installed,
		},
		{
			name: 'ERC 721',
			description: 'NFT COLLECTION',
			state: BlockState.PendingInstall,
		},
		{
			name: 'ERC 721',
			description: 'NFT COLLECTION',
			state: BlockState.NotInstalled,
		},
	];

	return (
		<div className="flex flex-col mt-[60px] w-full max-w-[1000px]">
			<div className="flex mb-[40px] w-full">
				<input
					className="text-[34px] leading-[40px] ghrow h-[66px] p-[15px] border rounded-[5px]"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<button
					className="h-[66px] w-[70px] bg-[#C9C9C9] rounded-[5px] text-[30px] mx-[10px] text-white"
					type="button"
				>
					x
				</button>
				<button
					className="h-[66px] w-[220px] bg-[#FDF531] disabled:bg-transparent rounded-[5px] text-[22px] leading-[26px]"
					type="button"
				>
					SAVE
				</button>
			</div>
			<div className="flex flex-wrap gap-[20px]">
				{blocks.map((block) => (
					<ContractBlock block={block} />
				))}
			</div>
		</div>
	);
};
