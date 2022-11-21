import process from 'process';
import * as dotenv from 'dotenv';
import 'promise-bind';

import { deployContract } from './helpers';

dotenv.config();

export const deployDiamond = () =>
	Promise.do()
		// .bind('diamond', () => deployContract('Diamond'));
		.bind('test', () => deployContract('CustomPackage'));

if (process.argv[1] === __filename) {
	deployDiamond();
}
