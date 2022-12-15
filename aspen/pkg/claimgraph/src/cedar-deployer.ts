import { CedarInterfaceDeployed } from '../generated/CedarDeployer/ICedarDeployer';
import { CedarERC1155Drop, CedarERC721Drop } from '../generated/templates';

export function handleDeployment(event: CedarInterfaceDeployed): void {
  if (event.params.implementationInterfaceId.startsWith('impl/ICedarERC1155Drop.sol:ICedarERC1155DropV')) {
    CedarERC1155Drop.create(event.params.contractAddress);
  } else if (event.params.implementationInterfaceId.startsWith('impl/ICedarERC721Drop.sol:ICedarERC721DropV')) {
    CedarERC721Drop.create(event.params.contractAddress);
  }
}
