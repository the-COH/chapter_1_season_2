import { deployers } from '@monaxlabs/ddk-contracts/dist/deployers.gen';
import { ICedarDeployerV9, ICedarDeployerV9__factory } from '@monaxlabs/ddk-contracts/dist/types';
import { providers, Signer } from 'ethers';

export type Network = typeof deployers[number]['network'];

export function getDeployer(network: Network, signerOrProvider: Signer | providers.Provider): ICedarDeployerV9 {
  const address = deployers.find((d) => d.network == network && d.version.major == 9)?.contractAddress;
  if (!address) {
    throw new Error(`Could not find CedarDeployer for network ${network}`);
  }
  return ICedarDeployerV9__factory.connect(address, signerOrProvider);
}
