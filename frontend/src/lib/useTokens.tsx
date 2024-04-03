import { useEffect, useState } from 'react';
import { useNearWallet } from './useNearWallet';
import { ContractName, localStorageKeyCachedTokens } from './constant';
import { TokenArgs } from '../pages/Tokens/components/OptionsSection/OptionsSection';

export function useTokens(wallet: ReturnType<typeof useNearWallet>) {
  const [tokens, setTokens] = useState<TokenArgs[]>([]);

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
        console.log({ i, numTokens });
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

  return { tokens };
}
