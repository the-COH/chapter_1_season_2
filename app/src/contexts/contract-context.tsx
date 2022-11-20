import React, {
	createContext,
	Dispatch,
	SetStateAction,
	ProviderProps,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { isNil, noop } from 'lodash';
import { ContractFactory, Contract } from 'ethers';
import 'promise-bind';
import { FacetCut } from 'diamond';
import { WalletContext } from './wallet-context';
import { default as DiamondArtifact } from '../../artifacts/contracts/diamond/Diamond.sol/Diamond.json';
import { default as CustomPackage } from '../../artifacts/contracts/packages/test/CustomPackage.sol/CustomPackage.json';
import { CustomPackage__factory, Diamond__factory, ERC721Base__factory, ERC721Enumerable__factory, ERC721Metadata__factory, IDiamondLoupe } from '../../typechain-types';
import { Test__factory } from '../../typechain-types/factories/packages/test/Test.sol/Test__factory';

export namespace ContractContext {
	export type Value = {
		contractAddresses: string[],
		activeContractAddress: string;
		setActiveContractAddress: Dispatch<SetStateAction<string>>;
		importContract: (contractAddress: string) => void;
		createNewContract: () => Promise<string>;
		facets: IDiamondLoupe.FacetStruct[];
		diamondCut: () => void;
		updateMetadata: () => void;
	};
}

export const ContractContext = createContext<ContractContext.Value>({
	contractAddresses: [],
	activeContractAddress: null,
	setActiveContractAddress: noop,
	importContract: noop,
	createNewContract: noop as () => Promise<string>,
	facets: [],
	diamondCut: noop,
	updateMetadata: noop,
});
ContractContext.displayName = 'Contract Context';

export const ContractProvider = ({ children }: Partial<ProviderProps<ContractContext.Value>>) => {
	// ===================================
	// States
	// ===================================

	const { provider } = useContext(WalletContext);
	const [contractAddresses, _setContractAddresses] = useState<string[]>([]);
	const [activeContractAddress, setActiveContractAddress] = useState<string>(null);
	const activeContract = useMemo(() =>
		!isNil(provider) && !isNil(activeContractAddress)
			? new Diamond__factory(provider.getSigner()).attach(activeContractAddress)
			: null, [provider, activeContractAddress]
	);
	const [facets, setFacets] = useState<IDiamondLoupe.FacetStruct[]>([]); {
		useEffect(() => {
			if (!isNil(activeContract)) {
				activeContract
					.facets()
					.then((facets) => setFacets(facets));
			} else {
				setFacets([]);
			}
		}, [setFacets, activeContract]);
	}

	// ===================================
	// Exported Methods
	// ===================================

	const setContractAddresses = useCallback((contractAddresses: string[]) => {
		_setContractAddresses(contractAddresses);
		localStorage.setItem('contracts', JSON.stringify(contractAddresses));
	}, [_setContractAddresses]);

	const getContractAddresses = useCallback(() => {
		const contractsJson = localStorage.getItem('contracts') ?? '[]';
		const contracts: string[] = JSON.parse(contractsJson);
		setContractAddresses(contracts);
	}, [setContractAddresses]);

	const createNewContract = useCallback(() => {
		const signer = provider.getSigner();
		const factory = new ContractFactory(DiamondArtifact.abi, DiamondArtifact.bytecode, signer);
		return factory.deploy()
			.chainFirst((contract) => console.log(contract))
			.then((contract) => contract.address);
	}, [provider]);

	const importContract = useCallback((contractAddress: string) => {
		setContractAddresses([
			...contractAddresses,
			contractAddress,
		].filter((item, pos, arr) => arr.indexOf(item) === pos));
	}, [contractAddresses, setContractAddresses]);

	// Custom Block
	const diamondCut = useCallback(() => {
		if (!isNil(activeContract)) {
			const test = new Test__factory(provider.getSigner()).attach('0xb3908691F877Ec754c1fD36560B9c95C37B8b70c');
			const cuts = [
				{
					target: '0xb3908691F877Ec754c1fD36560B9c95C37B8b70c',
					action: FacetCut.Action.Add,
					selectors: [
						test.interface.getSighash('helloWorld'),
					],
				},
			];

			activeContract
				.diamondCut(cuts, '0x0000000000000000000000000000000000000000', '0x')
				.then((tx) => tx.wait())
				.then((receipt) => console.log(receipt));
		}
	}, [activeContract, provider]);

	const updateMetadata = useCallback((name: string) => {
		const metadata = new ERC721Metadata__factory(provider.getSigner()).attach(activeContract.address);
		metadata
			.setName(name)
			.then((tx) => tx.wait());
	}, [activeContract, provider]);

	// ===================================
	// Effects
	// ===================================

	useEffect(() => {
		getContractAddresses();
	}, [getContractAddresses]);

	// ===================================
	// Exports
	// ===================================

	const value = useMemo<ContractContext.Value>(() => ({
		contractAddresses,
		activeContractAddress,
		setActiveContractAddress,
		importContract,
		createNewContract,
		facets,
		diamondCut,
		updateMetadata,
	}), [contractAddresses, activeContractAddress, setActiveContractAddress, importContract, createNewContract, facets, diamondCut, updateMetadata]);

	return <ContractContext.Provider value={value}>{children}</ContractContext.Provider>;
};
