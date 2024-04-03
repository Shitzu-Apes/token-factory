import { useEffect, useState } from 'react';
import { useNearWallet } from './useNearWallet';
import {
  ContractName,
  RefContractId,
  SimplePool,
  localStorageKeyCachedTokens,
  wNEAR
} from './constant';
import { TokenArgs } from '../pages/Tokens/components/OptionsSection/OptionsSection';

type TPool = {
  [token_contract: string]: {
    price: number;
    liquidity: bigint;
    fee: number;
    index: number;
  };
};

export function useTokens(wallet: ReturnType<typeof useNearWallet>) {
  const [tokens, setTokens] = useState<TokenArgs[]>([]);
  const [pools, setPools] = useState<TPool>({});

  useEffect(() => {
    (async () => {
      if (wallet.provider === null) return;
      const numTokens = await wallet.viewMethod({
        contractId: ContractName,
        method: 'get_number_of_tokens',
        args: {}
      });

      const cachedTokens: any[] = JSON.parse(
        window.localStorage.getItem(localStorageKeyCachedTokens) || '[]'
      );

      const limit = 100;
      const getTokensPromises = [];
      for (let i = cachedTokens.length; i < numTokens; i += limit) {
        getTokensPromises.push(
          wallet.viewMethod({
            contractId: ContractName,
            method: 'get_tokens',
            args: { from_index: i, limit }
          })
        );
      }

      const tokens = [...cachedTokens, ...(await Promise.all(getTokensPromises)).flat()];

      if (tokens.length > cachedTokens.length) {
        window.localStorage.setItem(localStorageKeyCachedTokens, JSON.stringify(tokens));
      }

      setTokens(tokens as TokenArgs[]);
    })();
  }, [wallet.provider]);

  useEffect(() => {
    (async () => {
      if (wallet.provider === null) return;
      if (tokens.length === 0) return;
      const numPools = await wallet.viewMethod({
        contractId: RefContractId,
        method: 'get_number_of_pools',
        args: {}
      });

      const promises = [];
      const limit = 1_000;
      for (let i = 0; i < numPools; i += limit) {
        promises.push(
          wallet.viewMethod({
            contractId: RefContractId,
            method: 'get_pools',
            args: { from_index: i, limit }
          })
        );
      }

      const rawPools: {
        pool_kind: string;
        token_account_ids: string[];
        amounts: string[];
        total_fee: string;
        shares_total_supply: string;
      }[] = (await Promise.all(promises)).flat();

      const pools: {
        [token_contract: string]: {
          price: number;
          liquidity: bigint;
          fee: number;
          index: number;
        };
      } = {};

      rawPools.forEach((pool, i) => {
        if (pool.pool_kind === SimplePool) {
          const nearIdx = pool.token_account_ids.indexOf(wNEAR);
          const token_contract = pool.token_account_ids[1 - nearIdx];
          if (nearIdx === -1) return;

          const nearAmount = BigInt(pool.amounts[nearIdx]);
          const tokenAmount = BigInt(pool.amounts[1 - nearIdx]);

          if (token_contract === 'intel.tkn.near') {
            console.log({ nearAmount, tokenAmount });
          }

          if (nearAmount === BigInt(0) || tokenAmount === BigInt(0)) return;

          const liquidity = BigInt(2) * nearAmount;

          if (token_contract in pools && pools[token_contract].liquidity > liquidity) return;

          const fee = Number(pool.total_fee);
          const price = Number(nearAmount) / Number(tokenAmount);

          pools[token_contract] = {
            price,
            liquidity,
            fee,
            index: i
          };
        }
      });

      setPools(pools);
    })();
  }, [tokens]);

  return { tokens, pools };
}