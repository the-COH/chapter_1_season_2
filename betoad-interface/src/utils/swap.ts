import BigNumber from "bignumber.js";
import { Asset, AssetInfo, NativeToken, Token } from "types/asset";
import { AstroPool } from "types/swap";
import { toString } from "./asset";

export const simulate = (offer_asset: Asset, pool: AstroPool) => {
  let offer_pool;
  let ask_pool;
  if (toString(offer_asset.info) === toString(pool.assets[0].info)) {
    offer_pool = pool.assets[0].amount;
    ask_pool = pool.assets[1].amount;
  } else if (toString(offer_asset.info) === toString(pool.assets[1].info)) {
    offer_pool = pool.assets[1].amount;
    ask_pool = pool.assets[0].amount;
  } else {
    return null;
  }

  const fee = new BigNumber(0.003);

  let k = offer_pool.multipliedBy(ask_pool);

  let return_amount = ask_pool.minus(
    k.dividedBy(offer_pool.plus(offer_asset.amount))
  );
  let commission_amount = return_amount.multipliedBy(fee);
  let no_slippage_amount = offer_asset.amount
    .multipliedBy(ask_pool)
    .dividedBy(offer_pool)
    .minus(commission_amount);
  let spread_amount = no_slippage_amount.minus(return_amount);

  return_amount = return_amount.minus(commission_amount);

  const slippage = new BigNumber(100).minus(
    return_amount.dividedBy(no_slippage_amount).multipliedBy(100)
  );

  return {
    return_amount: return_amount,
    commission_amount: commission_amount,
    spread_amount: spread_amount,
    slippage: slippage,
  };
};

export const reverse_simulate = (ask_asset: Asset, pool: AstroPool) => {
  let offer_pool;
  let ask_pool;
  if (toString(ask_asset.info) === toString(pool.assets[0].info)) {
    ask_pool = pool.assets[0].amount;
    offer_pool = pool.assets[1].amount;
  } else if (toString(ask_asset.info) === toString(pool.assets[1].info)) {
    ask_pool = pool.assets[1].amount;
    offer_pool = pool.assets[0].amount;
  } else {
    return null;
  }
  const fee = new BigNumber(0.003);
  // const one_minus_commission = new BigNumber(1).minus(fee);
  const commission_amount = ask_asset.amount.multipliedBy(fee);
  const real_ask_amount = ask_asset.amount.plus(commission_amount);

  let no_slippage_offer_amount = real_ask_amount
    .multipliedBy(offer_pool)
    .dividedBy(ask_pool);

  const k = offer_pool.multipliedBy(ask_pool);

  const offer_amount = k
    .dividedBy(ask_pool.minus(real_ask_amount))
    .minus(offer_pool);

  const spread_amount = no_slippage_offer_amount.minus(offer_amount);
  const slippage = new BigNumber(1).minus(
    offer_amount.dividedBy(no_slippage_offer_amount)
  );

  // let offer_amount = k
  //   .dividedBy(ask_pool.minus(ask_asset.amount).dividedBy(one_minus_commission))
  //   .minus(offer_pool);

  // let before_commission_deduction =
  //   ask_asset.amount.dividedBy(one_minus_commission);
  // let spread_amount = offer_amount
  //   .multipliedBy(ask_pool.dividedBy(offer_pool))
  //   .minus(before_commission_deduction);
  // let commission_amount = before_commission_deduction.multipliedBy(fee);

  // const slippage = new BigNumber(100).minus(
  //   return_amount.dividedBy(no_slippage_amount).multipliedBy(100)
  // );

  return {
    offer_amount: offer_amount,
    commission_amount: commission_amount,
    spread_amount: spread_amount,
    slippage: slippage,
  };
};
