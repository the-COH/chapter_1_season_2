import { TokensClaimed } from '../generated/templates/CedarERC1155Drop/CedarERC1155Drop';
import { updateClaimBalance } from './claim-balances';

export function handleTokensClaimed(event: TokensClaimed): void {
  updateClaimBalance(event.address, 'ERC1155', event.params.receiver, event.params.tokenId, event.params.quantityClaimed);
}
