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
import { getCompilerVersions, solidityCompiler } from '@agnostico/browser-solidity-compiler';
import { WalletContext } from './wallet-context';

type CompilerVersions = {
	releases: {
		[version: string]: string
	},
	latestRelease: string,
	builds: {
		version: string,
		path: string
	}[]
}

export namespace CompilerContext {
	export type Value = {
		activeVersion: string;
		setActiveVersion: Dispatch<SetStateAction<string>>;
		getVersions: () => void;
		versions: CompilerVersions;
		compileContract: (contentBody: string) => void;
	};
}

export const CompilerContext = createContext<CompilerContext.Value>({
	activeVersion: null,
	setActiveVersion: noop,
	getVersions: noop,
	versions: null,
	compileContract: noop,
});
CompilerContext.displayName = 'Contract Context';

export const CompilerProvider = ({ children }: Partial<ProviderProps<CompilerContext.Value>>) => {
	// ===================================
	// States
	// ===================================

	const [versions, setVersions] = useState<CompilerVersions>(null);
	const [activeVersion, setActiveVersion] = useState<string>(null);

	// ===================================
	// Exported Methods
	// ===================================

	const getVersions = useCallback(() => {
		getCompilerVersions()
			.then((versions: CompilerVersions) => {
				setVersions(versions);
				setActiveVersion(versions.latestRelease);
			});
	}, [setVersions, setActiveVersion]);

	const compileContract = useCallback((contractBody: string) => {
		console.log(versions);
		solidityCompiler({
			version: `https://binaries.soliditylang.org/bin/${versions.releases[activeVersion]}`,
			contractBody: contractBody,
			options: {
				optimizer: {
					enabled: true,
					runs: 99,
				},
			},
		})
			.then((value) => console.log(value));
	}, [activeVersion, versions]);

	// ===================================
	// Effects
	// ===================================

	useEffect(() => {
		getVersions();
	}, [getVersions]);

	// ===================================
	// Exports
	// ===================================

	const value = useMemo<CompilerContext.Value>(() => ({
		activeVersion,
		setActiveVersion,
		getVersions,
		versions,
		compileContract,
	}), [compileContract, getVersions, versions, activeVersion]);

	return <CompilerContext.Provider value={value}>{children}</CompilerContext.Provider>;
};
