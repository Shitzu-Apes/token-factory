import TelegramIcon from '../../assets/icons/TelegramIcon.svg';
import TwitterIcon from '../../assets/icons/TwitterIcon.svg';

export default function Footer() {
  return (
    <footer className="bg-black text-gray-200">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <a
            href={'https://twitter.com/shitzucommunity'}
            className={'rounded-md py-2 text-sm font-medium'}
            target="_blank"
          >
            <img src={TwitterIcon} alt="Twitter" className="h-6 w-6 text-primary" />
          </a>
          <a
            href={'https://t.me/Shitzu_Community'}
            className={'rounded-md py-2 text-sm font-medium'}
            target="_blank"
          >
            <img src={TelegramIcon} alt="Telegram" className="h-6 w-6 text-primary" />
          </a>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-sm leading-5 text-gray-300">&copy; Shitzu Community</p>
        </div>
      </div>
    </footer>
  );
}
