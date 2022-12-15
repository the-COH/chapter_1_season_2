import { dumpLatestABIs, generateTsFile } from '@monaxlabs/ddk-shared/dist/spec';
import * as path from 'path';

const deployersFileTs = path.join(__dirname, '..', 'src', 'deployers.gen.ts');
const manifestFileTs = path.join(__dirname, '..', 'src', 'manifest.gen.ts');
export const rootDir = path.join(__dirname, '..', '..', '..')
export const claimgraphAbiDir = path.join(rootDir, 'pkg', 'claimgraph', 'abis');
export const contractsAbiDir = path.join(rootDir, 'pkg', 'contracts', 'abis');

generateTsFile('deployers', 'contracts/deployments.json', deployersFileTs)
  .then(() => generateTsFile('manifest', 'contracts/manifest.json', manifestFileTs))
  .then(() => Promise.all([dumpLatestABIs(claimgraphAbiDir), dumpLatestABIs(contractsAbiDir)]))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
