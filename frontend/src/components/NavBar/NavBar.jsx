import styles from './NavBar.module.css';
import TelegramIcon from '../../assets/icons/TelegramIcon.svg';
import TwitterIcon from '../../assets/icons/TwitterIcon.svg';
import TelegramDarkIcon from '../../assets/icons/TelegramDarkIcon.svg';
import TwitterDarkIcon from '../../assets/icons/TwitterDarkIcon.svg';
import ShitzuIcon from '../../assets/icons/shitzu.svg';
import LightSwitcher from '../elements/LightSwitcher';
import { AppConsumer } from '../../context/AppContext';

const NavBar = () => {
  return (
    <AppConsumer>
      {({ isDarkMode, toggleDarkMode }) => (
        <div className={styles.root}>
          <div>
            <div className={styles.headerBlock}>TOKEN FARM</div>
          </div>
          <div>
            <div className={styles.listBlock}>
              This is a forked version of the original{' '}
              <a href="tkn.farm" target="_blank">
                tkn.farm
              </a>{' '}
              with many bug fixes and some modernizations. Proudly presented by
              <a href="https://shitzuapes.xyz" target="_blank" rel="noreferrer">
                <img src={ShitzuIcon} alt={'ShitzuIcon'} width="28" height="28" /> Shitzu
              </a>
            </div>
          </div>
          <div className={styles.bottomBlock}>
            <div className="flexCenter">
              <LightSwitcher handleCheck={toggleDarkMode} checked={isDarkMode} />
            </div>
            <hr className="margin-40-0-0" />
            <ul>
              <li>
                <a href="https://twitter.com/ShitzuCommunity" target="_blank" rel="noreferrer">
                  <img src={isDarkMode ? TwitterDarkIcon : TwitterIcon} alt={'TwitterIcon'} />
                </a>
              </li>
              <li>
                <a href="https://t.me/Shitzu_Community" target="_blank" rel="noreferrer">
                  <img src={isDarkMode ? TelegramDarkIcon : TelegramIcon} alt={'TelegramIcon'} />
                </a>
              </li>
            </ul>
            <div className={styles.bottomBodyText}>{'©2024 TokenFarm & Shitzu Apes'}</div>
          </div>
        </div>
      )}
    </AppConsumer>
  );
};

export default NavBar;
