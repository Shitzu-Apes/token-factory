import { useEffect, useState } from 'react';
import { Colors } from '../../assets/colors/colors';
import { useNearWalletContext } from '../../lib/useNearWallet';
import Button from '../elements/Button';
import { NFT_BASE_URL } from '../../lib/constant';
import { UserIcon } from '@heroicons/react/20/solid';

export default function TopBar({
  requestSignIn,
  isConnected,
  requestSignOut,
  isDarkMode
}: {
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  requestSignIn: () => void;
  isDarkMode: boolean;
  isConnected: boolean;
  requestSignOut: () => void;
}) {
  const wallet = useNearWalletContext();

  const [shitzuNftMedia, setShitzuNftMedia] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!wallet.accountId || !wallet.provider) {
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
      }[] = await wallet.viewMethod({
        contractId: 'shitzu.bodega-lab.near',
        method: 'nft_tokens_for_owner',
        args: {
          account_id: wallet.accountId,
          from_index: '0',
          limit: 1
        }
      });

      setShitzuNftMedia(`${NFT_BASE_URL}/${shitzuNftId.metadata.media}`);
    })();
  }, [wallet.accountId, wallet.provider]);

  return (
    <div className={`flex px-2 py-2`}>
      <div className="ml-auto pr-5">
        {isConnected ? (
          <div className="flex items-center">
            <div>
              {shitzuNftMedia ? (
                <img className="inline-block h-9 w-9 rounded-full" src={shitzuNftMedia} alt="" />
              ) : (
                <UserIcon className="h-9 w-9 rounded-full" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {wallet.accountId}
              </p>
              <div
                className="cursour-pointer text-xs font-medium text-gray-500 group-hover:text-gray-700"
                onClick={requestSignOut}
              >
                Log Out
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="cursor-pointer rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={requestSignIn}
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
}
