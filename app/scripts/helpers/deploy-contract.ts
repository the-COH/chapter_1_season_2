import { ethers } from 'hardhat';
import { parseUnits } from 'ethers/lib/utils';
import 'promise-bind';

export const deployContract = (name: string, ...constructorArgs) =>
	Promise.do()
		.bind('contractFactory', () => ethers.getContractFactory(name))
		.then(({ contractFactory }) => contractFactory.deploy(
			...constructorArgs
		))
		.then((contract) => contract.deployed())
		.chainFirst((contract) => {
			console.log(`${name} deployed to: ${contract.address}`);
		})
		.then((contract) => contract);
