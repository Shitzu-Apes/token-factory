import { TPool } from './useTokens';

const USDC_CONTRACT = '17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1';

export function getNearUSDPrice(pools: TPool) {
  if (USDC_CONTRACT in pools) {
    return BigInt(pools[USDC_CONTRACT].price);
  } else {
    return null;
  }
}

export function trySettingItemToLocalStorage(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(key, value);

    return true;
  } catch (e) {
    console.error(e);

    return false;
  }
}
