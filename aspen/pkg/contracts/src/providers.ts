import { parseFromEnvOrFile } from '@monaxlabs/ddk-shared/dist/environment';
import { providers, Wallet } from 'ethers';
import * as t from 'io-ts';
import { JsonFromString } from 'io-ts-types';
import path from 'path';

// A JSON object of type EnvCredentials is expected to be saved here (ignored from repo)
const defaultConfigFile = path.resolve(path.join(__dirname, 'providers.json'));
const defaultConfigEnvVarName = 'PROVIDERS_JSON';

const NetworkSecrets = t.partial({
  Mumbai: t.string,
  Mainnet: t.string,
  Goerli: t.string,
  Polygon: t.string,
});

type NetworkSecrets = t.TypeOf<typeof NetworkSecrets>;

const ProviderConfig = t.type({
  providerUrls: NetworkSecrets,
  privateKeys: NetworkSecrets,
});

type ProviderConfig = t.TypeOf<typeof ProviderConfig>;

let providerConfig: ProviderConfig;

export type SupportedNetwork = keyof NetworkSecrets;
export const SupportedNetwork = t.keyof(NetworkSecrets.props);

export const supportedNetworks = Object.freeze(Object.keys(NetworkSecrets.props)) as SupportedNetwork[];

export async function getProvider(network: SupportedNetwork, chainId?: number): Promise<providers.JsonRpcProvider> {
  const { providerUrls } = await getProviderConfig();
  const providerUrl = providerUrls[network];
  if (!providerUrl) {
    throw new Error(`No provider URL provided for network ${network}`);
  }
  return new providers.JsonRpcProvider(providerUrl, chainId);
}

export async function getSigner(network: SupportedNetwork): Promise<Wallet> {
  const { privateKeys } = await getProviderConfig();
  const provider = await getProvider(network);
  const privateKey = privateKeys[network];
  if (!privateKey) {
    throw new Error(`No private key provided for network ${network}`);
  }
  return new Wallet(privateKey, provider);
}

async function getProviderConfig(): Promise<ProviderConfig> {
  if (!providerConfig) {
    providerConfig = await parseFromEnvOrFile(
      JsonFromString.pipe(ProviderConfig),
      defaultConfigFile,
      defaultConfigEnvVarName,
    );
  }
  return providerConfig;
}
