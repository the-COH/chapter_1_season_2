# Ping Explorer Infra

Automates the [Ping explorer](https://github.com/ping-pub/explorer) deployment to Goole Cloud Platform.

Also patches the explorer to add a Canto testnet that links to the our full nodes.

<https://ping-explorer-3mid33wd4a-uc.a.run.app/canto/staking?testnet>

## Build
Download, patch and build locally before using.
```sh
export WORKSPACE=dev
make explorer/extract
make explorer/patch
make explorer/build
```

## Deploy
Deploy to GCP Cloud Run.
```sh
export WORKSPACE=dev
make docker/build
make docker/login
make docker/push
make devops/terraform/plan
make devops/terraform/apply
```
We leverage [Terraform workspaces](https://developer.hashicorp.com/terraform/language/state/workspaces) to handle state data instance separation.
In our setup the `WORKSPACE` matches with the network (e.g. `dev`, `prod`), but can also be used to stand up a dedicated dev instance (e.g. `dev-<name>`).

## Run the explorer locally
Run locally, useful for testing and debugging.
Via docker:
```sh
make docker/build
make docker/run
```
Without docker:
```sh
make explorer/run
```

## Advanced workflow
I've updated the `canto-testnet.patch` with a different IP set and I want to redeploy my service.
```sh
make explorer/patch
make -B explorer/build
make docker/build
make docker/push
make devops/terraform/redeploy
```
