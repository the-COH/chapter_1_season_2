import React, { useContext, useState } from 'react';
import { ContractContext } from '../../contexts/contract-context';

export const NewContract = () => {
	const { setActiveContractAddress, importContract } = useContext(ContractContext);
	const [name, setName] = useState(null);
	const [importAddress, setImportAddress] = useState(null);

	return (
		<div className="flex flex-col mt-[60px] w-full max-w-[1000px]">
			<div className="flex flex-col border border-black rounded-[5px] p-[20px] w-full items-end">
				<input
					className="text-[34px] bg-[#F4F4F4] p-[30px] w-full"
					value={name}
					placeholder="PROJECT NAME"
					onChange={(e) => setName(e.target.value)}
				/>
				<button
					className="text-[22px] leading-[26px] bg-[#FDF531] w-[290px] h-[66px] mt-[20px] border border-black rounded-[5px]"
					type="button"
					onClick={() => setActiveContractAddress('0x')}
				>
					CREATE NEW
				</button>
			</div>
			<div className="flex flex-col border border-black rounded-[5px] p-[20px] w-full items-end mt-[20px]">
				<input
					className="text-[34px] bg-[#F4F4F4] p-[30px] w-full"
					value={importAddress}
					placeholder="PASTE ADDRESS"
					onChange={(e) => setImportAddress(e.target.value)}
				/>
				<button
					className="text-[22px] leading-[26px] bg-[#FDF531] w-[290px] h-[66px] mt-[20px] border border-black rounded-[5px]"
					type="button"
					onClick={() => {
						importContract(importAddress);
					}}
				>
					IMPORT EXISTING
				</button>
			</div>
		</div>

	);
};
