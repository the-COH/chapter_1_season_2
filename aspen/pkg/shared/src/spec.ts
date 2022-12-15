import fs from 'fs';
import * as path from 'path';
import { ContractManifest, ContractsManifest } from './manifest';
import { parse } from './schema';
import { printJsonObjectAsTypescriptConst } from './typescript';

export const specDir = path.join(__dirname, '..', '..', '..', 'node_modules', '@monaxlabs', 'spec');
const contractFamilies = new Set(['CedarDeployer', 'CedarERC721Drop', 'CedarERC1155Drop']);

export async function generateTsFile(
  constName: string,
  relativePathToJson: string,
  outputFileTs: string,
): Promise<void> {
  const obj = JSON.parse(fs.readFileSync(path.join(specDir, relativePathToJson)).toString());
  const ts = await printJsonObjectAsTypescriptConst(constName, obj);
  fs.writeFileSync(outputFileTs, ts);
}

export async function dumpLatestABIs(abiDir: string): Promise<void> {
  fs.mkdirSync(abiDir, { recursive: true });
  const manifest = parse(
    ContractsManifest,
    JSON.parse(fs.readFileSync(path.join(specDir, 'contracts/manifest.json')).toString()),
  );
  for (const m of Object.values(manifest).filter((m) => contractFamilies.has(m.family))) {
    writeABI(abiDir, m)
  }
}

function writeABI(abiDir: string, manifest: ContractManifest) {
  fs.writeFileSync(path.join(abiDir, manifest.name + '.json'), JSON.stringify(manifest.abi, null, 2));
}
