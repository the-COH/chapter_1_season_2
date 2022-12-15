import { BigInt } from '@graphprotocol/graph-ts';
import { TokensClaimed } from '../generated/templates/CedarERC721Drop/CedarERC721Drop';
import { updateClaimBalance } from './claim-balances';

export function handleTokensClaimed(event: TokensClaimed): void {
  const startId = event.params.startTokenId;
  const capId = startId.plus(event.params.quantityClaimed);
  const bigOne = BigInt.fromI32(1);
  for (let tokenId = startId; tokenId.lt(capId); tokenId = tokenId.plus(bigOne)) {
    updateClaimBalance(event.address, 'ERC721', event.params.receiver, tokenId, bigOne);
  }
}
