/* eslint-disable @typescript-eslint/ban-types */
import { Address, BigInt } from '@graphprotocol/graph-ts';
import { ClaimBalance } from '../generated/schema';

export function updateClaimBalance(
  contractAddress: Address,
  tokenType: string,
  receiver: Address,
  tokenId: BigInt,
  amount: BigInt,
): void {
  const id = contractAddress.toHexString() + '-' + receiver.toHexString() + '-' + tokenId.toString();
  let balance = ClaimBalance.load(id);
  if (balance == null) {
    balance = new ClaimBalance(id);
    balance.contractAddress = contractAddress.toHexString();
    balance.tokenType = tokenType;
    balance.receiver = receiver.toHexString();
    balance.tokenId = tokenId;
    balance.totalClaimed = BigInt.fromI32(0);
  }
  balance.totalClaimed = balance.totalClaimed.plus(amount);
  balance.save();
}
