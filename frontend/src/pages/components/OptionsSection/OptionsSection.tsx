import { ArrowTopRightOnSquareIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { useNotifications } from '@web3-onboard/react';
import { FC, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import {
  MaxAccountIdLen,
  MaxU128,
  MinAccountIdLen,
  NO_DEPOSIT,
  ValidAccountRe,
  ValidTokenIdRe,
  OneNear,
  ThirtyTGas,
  TGas
} from '~/lib/constant';
import { imageFileToBase64 } from '~/lib/imageFileToBase64';
import { useNearWalletContext } from '~/lib/useNearWallet';

type FungibleTokenMetadata = {
  spec: 'ft-1.0.0';
  name: string;
  symbol: string;
  icon: string;
  decimals: number;
};

export type TokenArgs = {
  owner_id: string;
  total_supply: string;
  metadata: FungibleTokenMetadata;
};

const defaultTokenArgs = (
  accountId: string
): TokenArgs & {
  dao_tip: string;
  tokenSymbolStatus: 'idle' | 'loading' | 'valid' | 'invalid';
  ownerStatus: 'idle' | 'loading' | 'valid' | 'invalid';
} => ({
  owner_id: accountId,
  total_supply: '1000000000',
  metadata: {
    spec: 'ft-1.0.0',
    name: '',
    symbol: '',
    icon: '',
    decimals: 18
  },
  dao_tip: '1000000',
  tokenSymbolStatus: 'idle',
  ownerStatus: 'idle'
});

// tailwind css version of form-control form-control-large
const inputClass =
  'block w-full px-3 py-2 mt-1 text-base leading-normal text-gray-700 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:shadow-outline focus:border-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:border-blue-600 dark:focus:shadow-outline';

// Show input box as success state in tailwind css
const inputValidClass =
  'block w-full px-3 py-2 mt-1 text-base leading-normal text-gray-700 bg-white border border-green-300 rounded-lg appearance-none focus:outline-none focus:shadow-outline focus:border-green-300 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:border-green-600 dark:focus:shadow-outline';

// Show input box as error state in tailwind css
const inputInvalidClass =
  'block w-full px-3 py-2 mt-1 text-base leading-normal text-gray-700 bg-white border border-red-300 rounded-lg appearance-none focus:outline-none focus:shadow-outline focus:border-red-300 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:border-red-600 dark:focus:shadow-outline';

const fromYocto = (a: bigint) => (a ? (Number(a) / Number(OneNear)).toFixed(6) : '0');

const OptionsSection: FC = () => {
  const wallet = useNearWalletContext();

  const [_, customNotification] = useNotifications();

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const base64 = await imageFileToBase64(acceptedFiles[0]);
      setTokenArgs((prevArgs) => ({
        ...prevArgs,
        metadata: {
          ...prevArgs.metadata,
          icon: base64
        }
      }));
    },
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg']
    }
  });

  const [tokenArgs, setTokenArgs] = useState<ReturnType<typeof defaultTokenArgs>>(
    defaultTokenArgs(wallet.accountId || '')
  );

  const [requiredDeposit, setRequiredDeposit] = useState<bigint>(BigInt(0));

  useEffect(() => {
    (async () => {
      if (wallet.accountId) {
        await validateOwnerAccount(wallet.accountId);
      }
    })();
  }, [wallet.accountId]);

  async function validateOwnerAccount(accountId: string) {
    if (accountId) {
      const exist = await wallet.doesAccountExist(accountId);
      setTokenArgs((prevArgs) => ({
        ...prevArgs,
        owner_id: accountId,
        ownerStatus: exist ? 'valid' : 'invalid'
      }));
    }
  }

  async function doesTokenExist(tokenId: string) {
    let exist = false;
    try {
      const description = await wallet.viewMethod({
        contractId: import.meta.env.VITE_CONTRACT_ID!,
        method: 'get_token',
        args: {
          token_id: tokenId
        }
      });
      exist = description !== null;
    } catch {
      // ignore
    }

    setTokenArgs((prevArgs) => ({
      ...prevArgs,
      tokenSymbolStatus: exist ? 'invalid' : 'valid'
    }));
  }

  const isValidAccountId = (accountId: string) => {
    return (
      accountId.length >= MinAccountIdLen &&
      accountId.length <= MaxAccountIdLen &&
      accountId.match(ValidAccountRe)
    );
  };

  const isValidTokenId = (tokenId: string) => {
    tokenId = tokenId.toLowerCase();
    return (
      tokenId.match(ValidTokenIdRe) &&
      isValidAccountId(tokenId + '.' + import.meta.env.VITE_CONTRACT_ID!)
    );
  };

  const tokenIdClass = () => {
    if (
      !tokenArgs.metadata.symbol ||
      (isValidTokenId(tokenArgs.metadata.symbol) && tokenArgs.tokenSymbolStatus === 'loading')
    ) {
      return inputClass;
    } else if (
      isValidTokenId(tokenArgs.metadata.symbol) &&
      tokenArgs.tokenSymbolStatus === 'valid'
    ) {
      return inputValidClass;
    } else {
      return inputInvalidClass;
    }
  };

  const ownerIdClass = () => {
    if (
      !tokenArgs.owner_id ||
      (isValidAccountId(tokenArgs.owner_id) && tokenArgs.ownerStatus === 'loading')
    ) {
      return inputClass;
    } else if (isValidAccountId(tokenArgs.owner_id) && tokenArgs.ownerStatus === 'valid') {
      return inputValidClass;
    } else {
      return inputInvalidClass;
    }
  };

  useEffect(() => {
    (async () => {
      if (!wallet.accountId) return;
      if (
        !tokenArgs.owner_id ||
        (isValidAccountId(tokenArgs.owner_id) && tokenArgs.ownerStatus === 'loading')
      )
        return;

      const args = {
        owner_id: tokenArgs.owner_id,
        total_supply: (
          BigInt(tokenArgs.total_supply) *
          BigInt(10) ** BigInt(tokenArgs.metadata.decimals)
        ).toString(),
        metadata: tokenArgs.metadata
      };

      const required_deposit = await wallet.viewMethod({
        contractId: import.meta.env.VITE_CONTRACT_ID!,
        method: 'get_required_deposit',
        args: {
          account_id: wallet.accountId,
          args
        }
      });

      setRequiredDeposit(BigInt(required_deposit));
    })();
  }, [tokenArgs, wallet.accountId]);

  async function createToken() {
    if (!wallet.wallet) return;
    if (!wallet.shitzuNFT) return;
    if (!tokenArgs.owner_id) {
      return customNotification({
        eventCode: 'createToken',
        type: 'error',
        message: 'Missing owner id'
      });
    }

    const args = {
      owner_id: tokenArgs.owner_id,
      total_supply: (
        BigInt(tokenArgs.total_supply) *
        BigInt(10) ** BigInt(tokenArgs.metadata.decimals)
      ).toString(),
      metadata: tokenArgs.metadata
    };

    const actions: Parameters<
      typeof wallet.wallet.signAndSendTransactions
    >[0]['transactions'][number]['actions'] = [];

    if (requiredDeposit > BigInt(0)) {
      actions.push({
        type: 'FunctionCall',
        params: {
          methodName: 'storage_deposit',
          args: {},
          gas: ThirtyTGas,
          deposit: requiredDeposit.toString()
        }
      });
    }

    actions.push({
      type: 'FunctionCall',
      params: {
        methodName: 'create_token',
        args: { args },
        gas: (BigInt(150) * TGas).toString(),
        deposit: NO_DEPOSIT
      }
    });

    if (tokenArgs.dao_tip !== '0' && tokenArgs.owner_id === wallet.accountId) {
      actions.push({
        type: 'FunctionCall',
        params: {
          methodName: 'ft_transfer',
          args: {
            receiver_id: 'shitzu.sputnik-dao.near',
            amount: tokenArgs.dao_tip,
            memo: `Tip for creating token ${tokenArgs.metadata.symbol}`
          },
          gas: (BigInt(15) * TGas).toString(),
          deposit: '1'
        }
      });
    }

    const { update } = customNotification({
      eventCode: 'createToken',
      type: 'pending',
      message: 'Creating your token...'
    });
    try {
      const res = await wallet.wallet?.signAndSendTransactions({
        transactions: [
          {
            receiverId: import.meta.env.VITE_CONTRACT_ID!,
            actions
          }
        ]
      });
      let hash: string | undefined;
      if (typeof res === 'object') {
        hash = res[0].transaction_outcome.id;
      }
      update({
        eventCode: 'createTokenSuccess',
        type: 'success',
        message: 'Token creation succeeded! Click here',
        onClick: () => window.open(`${import.meta.env.VITE_EXPLORER_URL}/txns/${hash}`, '_blank'),
        autoDismiss: 15_000
      });
    } catch (err) {
      console.error(err);
      update({
        eventCode: 'createTokenError',
        type: 'error',
        message: 'Token creation failed!',
        autoDismiss: 5_000
      });
      throw err;
    }
  }

  // Decoy
  useEffect(() => {
    if (wallet.shitzuNFT) return;

    const interval = setInterval(() => {
      setTokenArgs(defaultTokenArgs(''));
    }, 5000);

    return () => clearInterval(interval);
  }, [wallet.shitzuNFT]);

  return (
    <div>
      <div className="dark:text-white flex flex-col gap-3">
        <div className="form-group">
          <label htmlFor="tokenName">Token Name</label>
          <div className="input-group">
            <input
              type="text"
              className={`${inputClass} dark:bg-gray-800 dark:text-white focus:dark:bg-gray-800 focus:dark:text-white`}
              id="tokenName"
              placeholder="Epic Moon Rocket"
              value={tokenArgs.metadata.name}
              onChange={(e) => {
                const tokenName = e.target.value;
                setTokenArgs((prevArgs) => ({
                  ...prevArgs,
                  metadata: {
                    ...prevArgs.metadata,
                    name: tokenName
                  }
                }));
              }}
            />
          </div>
          <small>The token name may be used to display the token in the UI</small>
        </div>

        <div className="form-group">
          <label htmlFor="tokenId">Token Symbol</label>
          <div className="input-group">
            <input
              type="text"
              className={
                inputClass +
                ' ' +
                tokenIdClass() +
                ' dark:bg-gray-800 dark:text-white focus:dark:bg-gray-800 focus:dark:text-white'
              }
              id="tokenId"
              placeholder="MOON"
              value={tokenArgs.metadata.symbol}
              onChange={async (e) => {
                const tokenId = e.target.value;
                setTokenArgs((prevArgs) => ({
                  ...prevArgs,
                  metadata: {
                    ...prevArgs.metadata,
                    symbol: tokenId
                  },
                  tokenSymbolStatus: 'loading'
                }));

                await doesTokenExist(tokenId);
              }}
            />
          </div>
          {tokenArgs.tokenSymbolStatus === 'invalid' && (
            <div>
              <small>
                <b>Token Symbol already exists.</b>
              </small>
            </div>
          )}
          <small>
            It&apos;ll be used to identify the token and to create an Account ID for the token{' '}
            <code>
              {tokenArgs.metadata.symbol
                ? tokenArgs.metadata.symbol.toLowerCase() + '.' + import.meta.env.VITE_CONTRACT_ID!
                : ''}
            </code>
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="totalSupply">Total Supply</label>
          <div className="input-group">
            <input
              type="number"
              className={`${inputClass} dark:bg-gray-800 dark:text-white focus:dark:bg-gray-800 focus:dark:text-white`}
              id="totalSupply"
              placeholder="1000000000"
              value={+tokenArgs.total_supply}
              onChange={(e) => {
                const validateTotalSupply = (value: string) => {
                  const num = BigInt(value + '0'.repeat(tokenArgs.metadata.decimals));
                  if (num > BigInt(0) && num <= BigInt(MaxU128)) {
                    return value;
                  } else {
                    return '1';
                  }
                };
                const totalSupply = validateTotalSupply(e.target.value);

                setTokenArgs((prevArgs) => ({
                  ...prevArgs,
                  total_supply: totalSupply
                }));
              }}
            />
          </div>
          <small>This is a total number of tokens to mint.</small>
        </div>

        <div className="form-group">
          <label htmlFor="tokenDecimals">Token Decimals</label>
          <div className="input-group">
            <input
              type="number"
              className={`${inputClass} dark:bg-gray-800 dark:text-white focus:dark:bg-gray-800 focus:dark:text-white`}
              id="tokenDecimals"
              placeholder="18"
              value={tokenArgs.metadata.decimals}
              onChange={(e) => {
                const decimals = Math.max(0, Math.min(24, parseInt(e.target.value)));

                setTokenArgs((prevArgs) => ({
                  ...prevArgs,
                  metadata: {
                    ...prevArgs.metadata,
                    decimals
                  }
                }));
              }}
            />
          </div>
          <small>
            Tokens operate on integer numbers.
            <code>1 / 10**{tokenArgs.metadata.decimals}</code> is the smallest fractional value of
            the new token.
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="tokenIcon">Token Icon</label>
          <div className="input-group">
            <div>
              {tokenArgs.metadata.icon ? (
                <div className="flex items-center">
                  <img
                    className="rounded token-icon"
                    style={{ marginRight: '1em' }}
                    src={tokenArgs.metadata.icon}
                    alt="Token Icon"
                  />

                  <XMarkIcon
                    className="h-8 w-8 text-red-500 cursor-pointer"
                    onClick={() =>
                      setTokenArgs((prevArgs) => ({
                        ...prevArgs,
                        metadata: {
                          ...prevArgs.metadata,
                          icon: ''
                        }
                      }))
                    }
                  />
                </div>
              ) : (
                <div className="w-full">
                  <div {...getRootProps({ className: 'dropzone max-w-xl' })}>
                    <label className="flex justify-center w-full h-32 px-4 transition bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                      <span className="flex items-center space-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <span className="font-medium text-gray-600 dark:text-gray-200">
                          Drop files to Attach, or{' '}
                          <span className="text-blue-600 underline">browse</span>
                        </span>
                      </span>
                      <input {...getInputProps()} />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="ownerId">Owner Account ID</label>
          <div className="input-group">
            <input
              type="text"
              className={
                inputClass +
                ' ' +
                ownerIdClass() +
                ' dark:bg-gray-800 dark:text-white focus:dark:bg-gray-800 focus:dark:text-white'
              }
              id="ownerId"
              placeholder={wallet.accountId || ''}
              value={tokenArgs.owner_id}
              onChange={async (e) => {
                const rawAccountId = e.target.value || wallet.accountId || '';
                setTokenArgs((prevArgs) => ({
                  ...prevArgs,
                  owner_id: rawAccountId,
                  ownerStatus: 'loading'
                }));
                await validateOwnerAccount(rawAccountId);
              }}
            />
          </div>
          {tokenArgs.ownerStatus === 'invalid' && (
            <div>
              <small>
                <b>Account doesn&apos;t exists.</b>
              </small>
            </div>
          )}
          <small>This account will own the total supply of the newly created token</small>
        </div>

        <div className="form-group">
          <label htmlFor="daoTip">
            Tip to{' '}
            <a
              href="https://near.org/astraplusplus.ndctools.near/widget/home?tab=proposals&daoId=shitzu.sputnik-dao.near&page=dao"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-dark dark:text-primary-light underline"
            >
              Shitzu DAO <ArrowTopRightOnSquareIcon className="h-4 w-4 inline" />
            </a>
          </label>
          <div className={`input-group ${tokenArgs.owner_id !== wallet.accountId && 'hidden'}`}>
            <input
              type="number"
              className={`${inputClass} dark:bg-gray-800 dark:text-white focus:dark:bg-gray-800 focus:dark:text-white`}
              id="daoTip"
              placeholder="10000000"
              disabled={tokenArgs.owner_id !== wallet.accountId}
              value={+tokenArgs.dao_tip}
              onChange={(e) => {
                const validateTip = (value: string) => {
                  const num = BigInt(value + '0'.repeat(tokenArgs.metadata.decimals));
                  const totalSupply = BigInt(
                    tokenArgs.total_supply + '0'.repeat(tokenArgs.metadata.decimals)
                  );
                  if (num > BigInt(0) && num <= BigInt(MaxU128) && num <= totalSupply) {
                    return value;
                  } else {
                    return '1';
                  }
                };
                const dao_tip = validateTip(e.target.value);

                setTokenArgs((prevArgs) => ({
                  ...prevArgs,
                  dao_tip
                }));
              }}
            />
          </div>
          {tokenArgs.owner_id !== wallet.accountId && (
            <div>
              <small className="text-yellow-600">
                <b>Token creator need to be owner in order to donate.</b>
              </small>
            </div>
          )}
        </div>

        <div className="form-group">
          <div>
            <button
              className="cursor-pointer rounded-md text-gray-800 px-3.5 py-2.5 text-sm font-semibold bg-primary-dark shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
"
              onClick={createToken}
            >
              Create Token ({fromYocto(requiredDeposit)} Ⓝ)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionsSection;
