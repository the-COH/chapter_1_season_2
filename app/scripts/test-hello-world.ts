import process from 'process';
import * as dotenv from 'dotenv';
import 'promise-bind';

import { ethers } from 'hardhat';
import { deployContract } from './helpers';

dotenv.config();

export const deployDiamond = () =>
	Promise.do()
		.bind('test', () => ethers.getContractAt('Test', '0xc8055479Fc039d5bc23dE794A6cA34577632E497'))
		.chainFirst(({ test }) =>
			test
				.helloWorld()
				.then((v) => console.log(v))
		);

if (process.argv[1] === __filename) {
	deployDiamond();
}
