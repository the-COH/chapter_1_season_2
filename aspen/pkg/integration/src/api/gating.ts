import { ChainIdFromChainName } from '@monaxlabs/ddk-contracts/dist/network';
import { SupportedNetwork } from '@monaxlabs/ddk-contracts/dist/providers';
import {
  AuthService,
  CreateRoleRequest,
  GateResponse,
  GateService,
  GateSignInMode,
  GateType,
  JWK,
  RolesService,
} from '@monaxlabs/ddk-gating';
import { parse } from '@monaxlabs/ddk-shared/dist/schema';
import { Signer } from 'ethers';
import { either as E, function as F } from 'fp-ts';
import * as t from 'io-ts';
import { importJWK, JWTPayload, jwtVerify } from 'jose';

export type GateCreated = GateResponse & { id: string };

export type GateOptions = {
  onExisting?: 'delete' | 'reuse';
};

const DefaultGateOptions: GateOptions = {};

export async function configureGate(
  network: SupportedNetwork,
  gateName: string,
  roles: Omit<CreateRoleRequest, 'chainId'>[],
  options?: GateOptions,
): Promise<GateCreated> {
  const { onExisting } = { ...DefaultGateOptions, ...options };
  if (onExisting) {
    const gates = await GateService.getClientGates();
    const existingGates = gates.filter((g) => g.name === gateName);
    if (existingGates.length) {
      if (onExisting === 'delete') {
        console.error(`Deleting existing gates ${existingGates.map((g) => `${g.id} ('${g.name}')`).join(', ')}`);
        await Promise.all(existingGates.map(({ id }) => GateService.deleteGate({ id })));
      } else if (onExisting === 'reuse') {
        return existingGates[0];
      } else if (onExisting === 'fail') {
        throw new Error(`Gate already exists with name '${gateName}'`);
      }
    }
  }
  const gate = await GateService.createGate({
    requestBody: { type: GateType.WEB3, name: gateName, signInMode: GateSignInMode.MULTIPLE },
  });

  const chainId = ChainIdFromChainName[network].toString();
  await RolesService.addGateRoles({
    id: gate.id,
    requestBody: roles.map((r) => ({ ...r, chainId })),
  });

  return gate as GateCreated;
}

export async function authenticateForGate(gateId: string, signer: Signer): Promise<string> {
  const signerAddress = await signer.getAddress();
  const { signpad } = await AuthService.getSignpad({ gateId, requestBody: { signer: signerAddress } });
  const signature = await signer.signMessage(signpad);
  return AuthService.authenticateForGate({ requestBody: { signpad, signature } });
}

const StringArray = t.array(t.string);
const MaybeStringArray = t.union([t.string, StringArray]);
const Roles = new t.Type<string[]>(
  'Roles',
  StringArray.is,
  (input, context) =>
    F.pipe(
      MaybeStringArray.validate(input, context),
      E.map((a) => (Array.isArray(a) ? a : [a])),
    ),
  t.identity,
);

export async function parseAndVerifyJWT(
  publicKey: JWK,
  jwtToken: string,
): Promise<{ payload: JWTPayload; roles: string[] }> {
  const key = await importJWK(publicKey, '', true);
  const { payload } = await jwtVerify(jwtToken, key, { clockTolerance: 100 });
  const roles = parse(Roles, payload.role);
  return { payload, roles };
}
