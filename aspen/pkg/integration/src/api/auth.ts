import * as g from '@monaxlabs/ddk-gating';
import * as p from '@monaxlabs/ddk-publishing';
import { parseFromEnvOrFile } from '@monaxlabs/ddk-shared/dist/environment';
import * as t from 'io-ts';
import { JsonFromString } from 'io-ts-types';
import * as path from 'path';

const Credential = t.type({
  baseUrl: t.string,
  name: t.string,
  password: t.string,
});

type Credential = t.TypeOf<typeof Credential>;

const Credentials = t.type({
  gating: Credential,
  publishing: Credential,
});

type Credentials = t.TypeOf<typeof Credentials>;

export const EnvCredentials = t.partial({
  staging: Credentials,
  develop: Credentials,
  production: Credentials,
  localhost: Credentials,
});

type EnvCredentials = t.TypeOf<typeof EnvCredentials>;

export type AspenEnvironment = keyof EnvCredentials;
export const AspenEnvironment = t.keyof(EnvCredentials.props);

// A JSON object of type EnvCredentials is expected to be saved here (ignored from repo)
const defaultCredentialsFile = 'credentials.json';
const defaultCedentialsEnvVarName = 'CREDENTIALS_JSON';

// Authenticate the API in a global state (which is horrible, but hey)
export async function authenticateAll({ publishing, gating }: Credentials): Promise<void> {
  await authenticate(p.OpenAPI, publishing);
  await authenticate(g.OpenAPI, gating);
}

export async function authenticate(
  config: p.OpenAPIConfig & g.OpenAPIConfig,
  { baseUrl, name, password }: Credential,
): Promise<string> {
  config.BASE = baseUrl;
  const accessToken = await p.AuthService.postAuth({
    requestBody: { name, password },
  });
  const token = accessToken.replace('Bearer ', '');
  config.TOKEN = token;
  return token;
}

export async function authenticateAllFromFile(
  environment: AspenEnvironment,
  credentialsFile = path.resolve(path.join(__dirname, defaultCredentialsFile)),
  credentialsEnvVarName = defaultCedentialsEnvVarName,
): Promise<void> {
  const envCreds = await parseFromEnvOrFile(
    JsonFromString.pipe(EnvCredentials),
    credentialsFile,
    credentialsEnvVarName,
  );

  const creds = envCreds[environment];
  if (!creds) {
    throw new Error(
      `No environment credentials for environment '${environment}' defined at ${path.resolve(defaultCredentialsFile)}`,
    );
  }
  await authenticateAll(creds);
}
