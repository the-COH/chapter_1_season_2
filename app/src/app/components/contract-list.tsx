import React, { useContext, useState } from 'react';
import { ContractContext } from '../../contexts/contract-context';

export const ContractList = () => {
	const { setActiveContractAddress } = useContext(ContractContext);

	const [contracts] = useState([
		{
			address: '0x',
			name: 'JOLYBEE',
			description: 'NFT COLLECTION',
			blocks: ['BASE', 'ENUMERABLE', 'METADATA', 'STAKING'],
		},
		{
			address: '0x',
			name: 'TEST 01B',
			description: 'TOKEN LAUNCH',
			blocks: ['BASE', 'SAFE APPROVAL', 'METADATA', 'SNAPSHOT'],
		},
		{
			address: '0x',
			name: 'CLARITY',
			description: 'SEMI FUNGIBLE TOKEN',
			blocks: ['BASE', 'ENUMERABLE', 'METADATA', 'STAKING'],
		},
	]);

	return (
		<div className="mt-[60px] w-full max-w-[1000px]">
			<div className="flex flex-col">
				{contracts.map((contract, index) => (
					// eslint-disable-next-line no-nested-ternary
					<div className={`flex p-[24px] border-x border-black ${index === 0 ? 'rounded-t-[5px] border-t' : index === contracts.length - 1 ? 'rounded-b-[5px] border-y' : 'border-x border-t'}`}>
						<img className="w-[128px] h-[128px] mr-[36px]" src="/assets/images/block-icon.png" alt="" />
						<div className="flex flex-col self-center grow">
							<div className="text-[34px] leading-[40px]">{contract.name}</div>
							<div className="text-[18px] leading-[21px]">{contract.description}</div>
							<div className="text-[16px] leading-[19px] text-[#B3B3B3] mt-[14px]">{contract.blocks.map((block, index) => `${index === 0 ? '' : '•'} ${block}`)}</div>
						</div>
						<button
							className="self-end text-[18px] leading-[21px] bg-[#FDF531] w-[130px] h-[42px] mt-[20px] border border-black rounded-[5px]"
							type="button"
							onClick={() => {
								setActiveContractAddress(contract.address);
							}}
						>
							EDIT
						</button>
					</div>
				))}
			</div>
		</div>
	);
};
