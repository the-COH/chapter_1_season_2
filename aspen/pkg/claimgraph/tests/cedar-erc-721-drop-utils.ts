import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  AcceptTerms,
  Approval,
  ApprovalForAll,
  BaseURIUpdated,
  ClaimConditionsUpdated,
  DefaultRoyalty,
  GreenlistStatus,
  MaxTotalSupplyUpdated,
  MaxWalletClaimCountUpdated,
  OwnerUpdated,
  PlatformFeeInfoUpdated,
  PrimarySaleRecipientUpdated,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  RoyaltyForToken,
  TermsActive,
  TokensClaimed,
  TokensLazyMinted,
  Transfer,
  WalletClaimCountUpdated
} from "../generated/CedarERC721Drop/CedarERC721Drop"

export function createAcceptTermsEvent(
  userAgreement: string,
  user: Address
): AcceptTerms {
  let acceptTermsEvent = changetype<AcceptTerms>(newMockEvent())

  acceptTermsEvent.parameters = new Array()

  acceptTermsEvent.parameters.push(
    new ethereum.EventParam(
      "userAgreement",
      ethereum.Value.fromString(userAgreement)
    )
  )
  acceptTermsEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )

  return acceptTermsEvent
}

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createBaseURIUpdatedEvent(
  baseURIIndex: BigInt,
  baseURI: string
): BaseURIUpdated {
  let baseUriUpdatedEvent = changetype<BaseURIUpdated>(newMockEvent())

  baseUriUpdatedEvent.parameters = new Array()

  baseUriUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "baseURIIndex",
      ethereum.Value.fromUnsignedBigInt(baseURIIndex)
    )
  )
  baseUriUpdatedEvent.parameters.push(
    new ethereum.EventParam("baseURI", ethereum.Value.fromString(baseURI))
  )

  return baseUriUpdatedEvent
}

export function createClaimConditionsUpdatedEvent(
  claimConditions: Array<ethereum.Tuple>
): ClaimConditionsUpdated {
  let claimConditionsUpdatedEvent = changetype<ClaimConditionsUpdated>(
    newMockEvent()
  )

  claimConditionsUpdatedEvent.parameters = new Array()

  claimConditionsUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "claimConditions",
      ethereum.Value.fromTupleArray(claimConditions)
    )
  )

  return claimConditionsUpdatedEvent
}

export function createDefaultRoyaltyEvent(
  newRoyaltyRecipient: Address,
  newRoyaltyBps: BigInt
): DefaultRoyalty {
  let defaultRoyaltyEvent = changetype<DefaultRoyalty>(newMockEvent())

  defaultRoyaltyEvent.parameters = new Array()

  defaultRoyaltyEvent.parameters.push(
    new ethereum.EventParam(
      "newRoyaltyRecipient",
      ethereum.Value.fromAddress(newRoyaltyRecipient)
    )
  )
  defaultRoyaltyEvent.parameters.push(
    new ethereum.EventParam(
      "newRoyaltyBps",
      ethereum.Value.fromUnsignedBigInt(newRoyaltyBps)
    )
  )

  return defaultRoyaltyEvent
}

export function createGreenlistStatusEvent(_status: boolean): GreenlistStatus {
  let greenlistStatusEvent = changetype<GreenlistStatus>(newMockEvent())

  greenlistStatusEvent.parameters = new Array()

  greenlistStatusEvent.parameters.push(
    new ethereum.EventParam("_status", ethereum.Value.fromBoolean(_status))
  )

  return greenlistStatusEvent
}

export function createMaxTotalSupplyUpdatedEvent(
  maxTotalSupply: BigInt
): MaxTotalSupplyUpdated {
  let maxTotalSupplyUpdatedEvent = changetype<MaxTotalSupplyUpdated>(
    newMockEvent()
  )

  maxTotalSupplyUpdatedEvent.parameters = new Array()

  maxTotalSupplyUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "maxTotalSupply",
      ethereum.Value.fromUnsignedBigInt(maxTotalSupply)
    )
  )

  return maxTotalSupplyUpdatedEvent
}

export function createMaxWalletClaimCountUpdatedEvent(
  count: BigInt
): MaxWalletClaimCountUpdated {
  let maxWalletClaimCountUpdatedEvent = changetype<MaxWalletClaimCountUpdated>(
    newMockEvent()
  )

  maxWalletClaimCountUpdatedEvent.parameters = new Array()

  maxWalletClaimCountUpdatedEvent.parameters.push(
    new ethereum.EventParam("count", ethereum.Value.fromUnsignedBigInt(count))
  )

  return maxWalletClaimCountUpdatedEvent
}

export function createOwnerUpdatedEvent(
  prevOwner: Address,
  newOwner: Address
): OwnerUpdated {
  let ownerUpdatedEvent = changetype<OwnerUpdated>(newMockEvent())

  ownerUpdatedEvent.parameters = new Array()

  ownerUpdatedEvent.parameters.push(
    new ethereum.EventParam("prevOwner", ethereum.Value.fromAddress(prevOwner))
  )
  ownerUpdatedEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownerUpdatedEvent
}

export function createPlatformFeeInfoUpdatedEvent(
  platformFeeRecipient: Address,
  platformFeeBps: BigInt
): PlatformFeeInfoUpdated {
  let platformFeeInfoUpdatedEvent = changetype<PlatformFeeInfoUpdated>(
    newMockEvent()
  )

  platformFeeInfoUpdatedEvent.parameters = new Array()

  platformFeeInfoUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "platformFeeRecipient",
      ethereum.Value.fromAddress(platformFeeRecipient)
    )
  )
  platformFeeInfoUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "platformFeeBps",
      ethereum.Value.fromUnsignedBigInt(platformFeeBps)
    )
  )

  return platformFeeInfoUpdatedEvent
}

export function createPrimarySaleRecipientUpdatedEvent(
  recipient: Address
): PrimarySaleRecipientUpdated {
  let primarySaleRecipientUpdatedEvent = changetype<
    PrimarySaleRecipientUpdated
  >(newMockEvent())

  primarySaleRecipientUpdatedEvent.parameters = new Array()

  primarySaleRecipientUpdatedEvent.parameters.push(
    new ethereum.EventParam("recipient", ethereum.Value.fromAddress(recipient))
  )

  return primarySaleRecipientUpdatedEvent
}

export function createRoleAdminChangedEvent(
  role: Bytes,
  previousAdminRole: Bytes,
  newAdminRole: Bytes
): RoleAdminChanged {
  let roleAdminChangedEvent = changetype<RoleAdminChanged>(newMockEvent())

  roleAdminChangedEvent.parameters = new Array()

  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdminRole",
      ethereum.Value.fromFixedBytes(previousAdminRole)
    )
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newAdminRole",
      ethereum.Value.fromFixedBytes(newAdminRole)
    )
  )

  return roleAdminChangedEvent
}

export function createRoleGrantedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleGranted {
  let roleGrantedEvent = changetype<RoleGranted>(newMockEvent())

  roleGrantedEvent.parameters = new Array()

  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleGrantedEvent
}

export function createRoleRevokedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleRevoked {
  let roleRevokedEvent = changetype<RoleRevoked>(newMockEvent())

  roleRevokedEvent.parameters = new Array()

  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleRevokedEvent
}

export function createRoyaltyForTokenEvent(
  tokenId: BigInt,
  royaltyRecipient: Address,
  royaltyBps: BigInt
): RoyaltyForToken {
  let royaltyForTokenEvent = changetype<RoyaltyForToken>(newMockEvent())

  royaltyForTokenEvent.parameters = new Array()

  royaltyForTokenEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  royaltyForTokenEvent.parameters.push(
    new ethereum.EventParam(
      "royaltyRecipient",
      ethereum.Value.fromAddress(royaltyRecipient)
    )
  )
  royaltyForTokenEvent.parameters.push(
    new ethereum.EventParam(
      "royaltyBps",
      ethereum.Value.fromUnsignedBigInt(royaltyBps)
    )
  )

  return royaltyForTokenEvent
}

export function createTermsActiveEvent(status: boolean): TermsActive {
  let termsActiveEvent = changetype<TermsActive>(newMockEvent())

  termsActiveEvent.parameters = new Array()

  termsActiveEvent.parameters.push(
    new ethereum.EventParam("status", ethereum.Value.fromBoolean(status))
  )

  return termsActiveEvent
}

export function createTokensClaimedEvent(
  claimConditionIndex: BigInt,
  claimer: Address,
  receiver: Address,
  startTokenId: BigInt,
  quantityClaimed: BigInt
): TokensClaimed {
  let tokensClaimedEvent = changetype<TokensClaimed>(newMockEvent())

  tokensClaimedEvent.parameters = new Array()

  tokensClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "claimConditionIndex",
      ethereum.Value.fromUnsignedBigInt(claimConditionIndex)
    )
  )
  tokensClaimedEvent.parameters.push(
    new ethereum.EventParam("claimer", ethereum.Value.fromAddress(claimer))
  )
  tokensClaimedEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  tokensClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "startTokenId",
      ethereum.Value.fromUnsignedBigInt(startTokenId)
    )
  )
  tokensClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "quantityClaimed",
      ethereum.Value.fromUnsignedBigInt(quantityClaimed)
    )
  )

  return tokensClaimedEvent
}

export function createTokensLazyMintedEvent(
  startTokenId: BigInt,
  endTokenId: BigInt,
  baseURI: string
): TokensLazyMinted {
  let tokensLazyMintedEvent = changetype<TokensLazyMinted>(newMockEvent())

  tokensLazyMintedEvent.parameters = new Array()

  tokensLazyMintedEvent.parameters.push(
    new ethereum.EventParam(
      "startTokenId",
      ethereum.Value.fromUnsignedBigInt(startTokenId)
    )
  )
  tokensLazyMintedEvent.parameters.push(
    new ethereum.EventParam(
      "endTokenId",
      ethereum.Value.fromUnsignedBigInt(endTokenId)
    )
  )
  tokensLazyMintedEvent.parameters.push(
    new ethereum.EventParam("baseURI", ethereum.Value.fromString(baseURI))
  )

  return tokensLazyMintedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}

export function createWalletClaimCountUpdatedEvent(
  wallet: Address,
  count: BigInt
): WalletClaimCountUpdated {
  let walletClaimCountUpdatedEvent = changetype<WalletClaimCountUpdated>(
    newMockEvent()
  )

  walletClaimCountUpdatedEvent.parameters = new Array()

  walletClaimCountUpdatedEvent.parameters.push(
    new ethereum.EventParam("wallet", ethereum.Value.fromAddress(wallet))
  )
  walletClaimCountUpdatedEvent.parameters.push(
    new ethereum.EventParam("count", ethereum.Value.fromUnsignedBigInt(count))
  )

  return walletClaimCountUpdatedEvent
}
