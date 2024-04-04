import { useState } from 'react';
import ShitzuIcon from '~/assets/icons/shitzu.svg';
import ShitzuFace from '~/assets/icons/shitzu_face.svg';
import { useNearWalletContext } from '~/lib/useNearWallet';
import OptionsSection from '~/pages/components/OptionsSection/OptionsSection';
import { NFT_LINKS } from '~/lib/constant';

export default function Hero() {
  const wallet = useNearWalletContext();
  const [openModal, setOpenModal] = useState(false);
  return (
    <div>
      <div className="bg-primary-dark relative z-10">
        <div className="absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <img src={ShitzuFace} alt="hero-bg" className="w-full h-full object-contain" />
        </div>
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8 relative z-30">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Deploy Your Own Token.
              <br />
              And Join Us SHITZURIAN.
            </h2>
            <div className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white">
              This is a forked version of the original{' '}
              <a href="https://tkn.farm" target="_blank" rel="noreferrer">
                tkn.farm
              </a>{' '}
              project. presented by{' '}
              <a
                href="https://shitzuapes.xyz"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center"
              >
                <img
                  src={ShitzuIcon}
                  alt={'ShitzuIcon'}
                  width="40"
                  height="40"
                  className="w-10 h-10 mr-2"
                />
                <div>Shitzu</div>
              </a>
            </div>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <div
                className={`
                cursor-pointer rounded-md bg-gray-100 dark:bg-gray-800 px-3.5 py-2.5 text-sm font-semibold text-primary-dark dark:text-primary-light shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
              `}
                onClick={() => {
                  setOpenModal((prev) => !prev);
                }}
              >
                Deploy New Token
              </div>
              <a
                href="https://shitzuapes.xyz"
                target="_blank"
                className="text-sm font-semibold leading-6 text-white"
              >
                What is SHITZU? <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`px-8 py-4 relative
      ${openModal ? `block` : `hidden`}
      `}
      >
        <OptionsSection />

        {!wallet.shitzuNFT && (
          <div className={`absolute inset-0 bg-black bg-opacity-70 transition-all`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-lg p-8 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-center text-primary-light leading-relaxed">
                  Only Shitzu NFT holder can deploy token.
                  <br />
                  Check us out on NFT marketplace.
                </h2>
                <div className="flex gap-5 flex-wrap">
                  {NFT_LINKS.map(({ platform, link, logo }) => {
                    return (
                      <a
                        key={link}
                        className="mt-6 cursor-pointer rounded-lg w-[150px] text-center bg-primary-dark px-3 py-2 text-lg font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white hover:bg-primary-light"
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <div className="flex items-center justify-center">
                          <img src={logo} className="w-6 h-6 mr-2" alt={platform} />
                          {platform}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
