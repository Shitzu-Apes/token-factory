import '@near-wallet-selector/modal-ui/styles.css';
import { useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react';
import { providers } from 'near-api-js';
import { setupModal } from '@near-wallet-selector/modal-ui';
import { setupWalletSelector, Network, NetworkId } from '@near-wallet-selector/core';
import { SignMessageMethod, Wallet } from '@near-wallet-selector/core/src/lib/wallet';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupHereWallet } from '@near-wallet-selector/here-wallet';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
import { NFT_BASE_URL, NO_DEPOSIT, THIRTY_TGAS } from './constant';

interface UseNearWalletProps {
  createAccessKeyFor: string;
  network: Network | NetworkId;
}

interface CallMethodParams {
  contractId: string;
  method: string;
  args?: Record<string, any>;
  gas?: string;
  deposit?: string;
}

interface ViewMethodParams {
  contractId: string;
  method: string;
  args?: Record<string, any>;
}

export function useNearWallet({ createAccessKeyFor, network }: UseNearWalletProps) {
  const [selector, setSelector] = useState<Awaited<ReturnType<typeof setupWalletSelector>> | null>(
    null
  );
  const [wallet, setWallet] = useState<(Wallet & SignMessageMethod) | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);

  const provider = useMemo(() => {
    if (!selector) return null;
    return new providers.JsonRpcProvider({ url: selector.options.network.nodeUrl });
  }, [selector]);

  useEffect(() => {
    console.log('network', network)
    const startUp = async () => {
      const selector = await setupWalletSelector({
        network,
        modules: [setupMyNearWallet(), setupHereWallet(), setupMeteorWallet()]
      });
      setSelector(selector);

      const isSignedIn = selector.isSignedIn();
      if (isSignedIn) {
        const walletInstance = await selector.wallet();
        const accountId = selector.store.getState().accounts[0].accountId;
        setWallet(walletInstance);
        setAccountId(accountId);
      }
    };

    startUp();
  }, [network]);

  const isConnected = useCallback(() => !!wallet, [wallet]);

  const signIn = useCallback(async () => {
    if (!selector || !createAccessKeyFor) throw new Error('Contract ID not initialized');
    const description = 'Please select a wallet to sign in.';
    const modal = setupModal(selector, {
      contractId: createAccessKeyFor,
      description
    });
    modal.show();
  }, [selector, createAccessKeyFor]);

  const signOut = useCallback(async () => {
    if (!wallet || !accountId) throw new Error('Wallet or Account ID not initialized');
    await wallet.signOut();
    setWallet(null);
    setAccountId(null);
    window.location.replace(window.location.origin + window.location.pathname);
  }, [wallet, accountId]);

  const viewMethod = useCallback(
    async ({ contractId, method, args = {} }: ViewMethodParams) => {
      if (!provider) throw new Error('Provider not initialized');
      const res: any = await provider.query({
        request_type: 'call_function',
        account_id: contractId,
        method_name: method,
        args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
        finality: 'optimistic'
      });
      return JSON.parse(Buffer.from(res.result).toString());
    },
    [selector]
  );

  const callMethod = useCallback(
    async ({
      contractId,
      method,
      args = {},
      gas = THIRTY_TGAS,
      deposit = NO_DEPOSIT
    }: CallMethodParams) => {
      if (!wallet || !accountId) throw new Error('Wallet or Account ID not initialized');
      return await wallet.signAndSendTransaction({
        signerId: accountId,
        receiverId: contractId,
        actions: [
          {
            type: 'FunctionCall',
            params: {
              methodName: method,
              args,
              gas,
              deposit
            }
          }
        ]
      });
    },
    [wallet, accountId]
  );

  const getTransactionResult = useCallback(
    async (txhash: string) => {
      if (!selector) throw new Error('Selector not initialized');
      const { network } = selector.options;
      const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });
      const transaction = await provider.txStatus(txhash, accountId!); // Using accountId! to assert that accountId is not null here.
      return providers.getTransactionLastResult(transaction);
    },
    [selector, accountId]
  );

  const doesAccountExist = useCallback(
    async (accountId: string) => {
      if (!provider) throw new Error('Provider not initialized');

      try {
        await provider.query(`account/${accountId}`, '');

        return true;
      } catch {
        return false;
      }
    },
    [provider]
  );

  const [shitzuNFT, setShitzuNFT] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!accountId || !provider) {
        return;
      }

      const [shitzuNftId]: {
        token_id: string;
        owner_id: string;
        metadata: {
          title: string;
          description: string;
          media: string;
        };
      }[] = await viewMethod({
        contractId: import.meta.env.VITE_SHITZU_NFT_CONTRACT_ID!,
        method: 'nft_tokens_for_owner',
        args: {
          account_id: accountId,
          from_index: '0',
          limit: 1
        }
      });

      if (shitzuNftId) {
        setShitzuNFT(`${NFT_BASE_URL}/${shitzuNftId.metadata.media}`);
      }
    })();
  }, [accountId, provider]);

  return {
    shitzuNFT,
    wallet,
    provider,
    accountId,
    isConnected,
    signIn,
    signOut,
    viewMethod,
    callMethod,
    getTransactionResult,
    doesAccountExist
  };
}

export const NearWalletContext = createContext<ReturnType<typeof useNearWallet> | null>(null);

export const useNearWalletContext = () => {
  const context = useContext(NearWalletContext);
  if (!context) {
    throw new Error('useNearWalletContext must be used within a NearWalletProvider');
  }
  return context;
};
