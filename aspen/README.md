# Aspen SDKs and example code

This directory contains a mixture of generated and library code for interacting with Aspen and its family of NFT contracts (which carry the internal moniker 'Cedar')

## Setup

This package is a yarn workspaces-based monorepo. Currently `pkg/integration` contains the integration-level code and `pkg/publishing`, `pkg/gating, and `pkg/contracts` contain library/SDK code.

`pkg/claimgraph` contains a Graph node subgraph that records claims on a ERC721/ERC1155 contract

### Credentials

The DDK expects some secret credential files to be present in order to function (and to build) they are:

- [pkg/integration/src/api/credentials.json](pkg/integration/src/api/credentials.template.json)
- [pkg/contracts/src/providers.json](pkg/contracts/src/providers.template.json)

The links above take you to a template for these files each of which you should copy to the same directory remoing `.template` from the filename.

These files are ignored by git. `providers.json` contains secret keys for each network you wish to use and `credentials.json` contains Aspen API credentials.

#### Identity/Gating

Note that currently the Identity/Gating API accepts the exact same bearer token as the Publishing API. You can just copy the username and password you are given for each Publishing environment you are using into both the `publishing` and `gating` block of `credentials.json`

### Build

From the root of the repository run:

```shell
yarn install
# Generates necessary code then builds
yarn update
```

To install dependencies and build all sub-packages.

## Flows

The main entry point for this repo is a demo-come-integration test [pkg/ddc/src/flows.ts](pkg/ddc/src/flows.ts). It implements deploying a 1155 access NFT contract, A, and a 721 content NFT contract, B, where each token on B is derived from a specific token on A. Some synthetic users claim some A tokens and then are issued some B tokens based on consultation of a subgraph tracking claims. The final flow also demonstrates gating on A tokens.

They can be run with:

```shell
yarn flows
```

From the root of the repo or from `pkg/ddc`. the flows to run can be customised by editing:

```typescript
// Change this to perform a different run
const flowToRun: (keyof typeof flows)[] = [1, 2, 3, 4];
```

In the `flows.ts` file.

### State

In order to not repeatedly redeploy collections and to demonstrate the necessary issuance state that needs to be saved to a database there are two files:

- [collection-info.json](pkg/ddc/collection-info.json) (delete to deploy fresh collections)
- [issuance-info.json](pkg/ddc/issuance-info.json) (delete to forget any existing issuance)

```shell
yarn workspace @monaxlabs/ddk-integration clear-state
```

Removes both of these files, but either can deleted independently.
