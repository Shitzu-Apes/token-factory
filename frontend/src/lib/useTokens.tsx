import { useEffect, useState } from 'react';
import { useNearWallet } from './useNearWallet';
import {
  SimplePool,
  localStorageKeyCachedTokens,
} from './constant';
import { TokenArgs } from '~/pages/components/OptionsSection/OptionsSection';

export type TPool = {
  [token_contract: string]: {
    price: number;
    liquidity: bigint;
    fee: number;
    index: number;
    shares_total_supply: string;
    locked: [
      string,
      {
        amount: string;
        duration_ns: string;
        timestamp: string;
      }
    ][];
  };
};

export function useTokens(wallet: ReturnType<typeof useNearWallet>) {
  const [tokens, setTokens] = useState<TokenArgs[]>([]);

  const [tokenIdx, setTokenIdx] = useState<{
    [token: string]: number;
  }>({});
  const [pools, setPools] = useState<TPool>({});

  useEffect(() => {
    (async () => {
      if (wallet.provider === null) return;
      const numTokens = await wallet.viewMethod({
        contractId: import.meta.env.VITE_CONTRACT_ID!,
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
            contractId: import.meta.env.VITE_CONTRACT_ID!,
            method: 'get_tokens',
            args: { from_index: i, limit }
          })
        );
      }

      const newTokens = (await Promise.all(getTokensPromises)).flat();
      for (let i = 0; i < newTokens.length; i++) {
        newTokens[i].index = i + cachedTokens.length;
      }

      const tokens = [...cachedTokens, ...newTokens];

      const tokenIdx: { [token: string]: number } = {};
      for (let i = 0; i < tokens.length; i++) {
        tokenIdx[tokens[i].metadata.symbol] = tokens[i].index;
      }
      setTokenIdx(tokenIdx);

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
        contractId: import.meta.env.VITE_REF_CONTRACT_ID!,
        method: 'get_number_of_pools',
        args: {}
      });

      const promises = [];
      const limit = 1_000;
      for (let i = 0; i < numPools; i += limit) {
        promises.push(
          wallet.viewMethod({
            contractId: import.meta.env.VITE_REF_CONTRACT_ID!,
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

      const pools: TPool = {};

      rawPools.forEach((pool, i) => {
        if (pool.pool_kind === SimplePool) {
          const nearIdx = pool.token_account_ids.indexOf(import.meta.env.VITE_WNEAR_ID!);
          const token_contract = pool.token_account_ids[1 - nearIdx];
          if (nearIdx === -1) return;

          const nearAmount = BigInt(pool.amounts[nearIdx]);
          const tokenAmount = BigInt(pool.amounts[1 - nearIdx]);

          if (nearAmount === BigInt(0) || tokenAmount === BigInt(0)) return;

          const liquidity = BigInt(2) * nearAmount;

          if (token_contract in pools && pools[token_contract].liquidity > liquidity) return;

          const fee = Number(pool.total_fee);
          const price = Number(nearAmount) / Number(tokenAmount);

          pools[token_contract] = {
            price,
            liquidity,
            fee,
            shares_total_supply: pool.shares_total_supply,
            index: i,
            locked: []
          };
        }
      });

      const lockedPromises = [];
      for (let [tkn, pool] of Object.entries(pools)) {
        lockedPromises.push(
          wallet
            .viewMethod({
              contractId: `${pool.index}.lock-lp.near`,
              method: 'get_lockups',
              args: { skip: '0', take: '100' }
            })
            .then((locked) => {
              pools[tkn] = {
                ...pool,
                locked
              };
            })
            .catch(() => {
              return;
            })
        );
      }
      await Promise.all(lockedPromises);

      setPools(pools);
    })();
  }, [tokens]);

  return { tokens, pools, tokenIdx };
}
