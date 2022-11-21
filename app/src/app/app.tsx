/* eslint-disable no-nested-ternary */

import React, { useCallback, useContext, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { solidity } from '@replit/codemirror-lang-solidity';

import { isNil } from 'lodash';
import { ContractContext } from '../contexts/contract-context';
import { CompilerContext } from '../contexts/compiler-context';
import { Header } from './components/header';
import { NewContract } from './components/new-contract';
import { ContractList } from './components/contract-list';
import { ContractEditor } from './components/contract-editor';
import { WalletContext } from '../contexts/wallet-context';
import { ConnectWallet } from './components/connect-wallet';

export const App = () => {
	const { account } = useContext(WalletContext);
	const {
		activeContractAddress,
		setActiveContractAddress,
		contractAddresses,
		createNewContract,
		importContract,
		diamondCut,
		updateMetadata,
	} = useContext(ContractContext);
	const { compileContract, versions, activeVersion, setActiveVersion } = useContext(CompilerContext);
	const [source, setSource] = useState<string>(`
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract CustomFacet {

}
	`);

	const onChange = useCallback((value, viewUpdate) => {
		setSource(value);
	}, [setSource]);

	const onImportContract = useCallback(() => {
		const contractAddress = prompt('Contract address?');
		importContract(contractAddress);
	}, [importContract]);

	const [showList, setShowList] = useState(true);

	if (!account) {
		return <ConnectWallet />;
	}

	return (
		<div className="flex flex-col font-[Receipt] pt-[178px] justify-center items-center">
			<Header />

			<div className="flex items-center rounded-[5px] border border-black w-fit p-[5px]">
				<button
					type="button"
					className={`w-[215px] h-[42px] text-[18px] leading-[22px] ${showList ? 'bg-black bg-opacity-80 text-white' : ''} rounded-[5px]`}
					onClick={() => {
						setActiveContractAddress(null);
						setShowList(true);
					}}
				>
					MY CONTRACTS
				</button>

				<button
					type="button"
					className={`w-[215px] h-[42px] text-[18px] leading-[22px] ${!showList ? 'bg-black bg-opacity-80 text-white' : ''} rounded-[5px]`}
					onClick={() => {
						setActiveContractAddress(null);
						setShowList(false);
					}}
				>
					CREATE NEW
				</button>
			</div>

			{showList && isNil(activeContractAddress)
				? <ContractList />
				: isNil(activeContractAddress)
					? <NewContract />
					: <ContractEditor />}

			{/* <select onChange={(e) => setActiveContract(e.target.value)}>
				{
					contractAddresses.map((addess) => (
						<option key={addess} value={addess}>{addess}</option>
					))
				}
			</select>
			<button type="button" onClick={onImportContract}>Import Existing Contract</button>

			<button type="button" onClick={createNewContract}>Deploy New Contract</button>
			<button type="button" onClick={diamondCut}>Diamond Cut</button>
			<button type="button" onClick={updateMetadata}>Update Metadata</button>
			<div>
				{
					!isNil(versions)
						? (
							<select onChange={(e) => setActiveVersion(e.target.value)}>
								{
									Object.entries(versions.releases).map(([version, key]) => (
										<option key={key} value={version}>{version}</option>
									))
								}
							</select>
						)
						: null
				}
				<button type="button" onClick={() => compileContract(source)}>Compile</button>
			</div>
			<CodeMirror
				value={source}
				height="200px"
				// extensions={[solidity]}
				onChange={onChange}
			/> */}
		</div>
	);
};
