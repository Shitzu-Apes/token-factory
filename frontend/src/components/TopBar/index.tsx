import { Colors } from '../../assets/colors/colors';
import SearchIcon from '../../assets/icons/SearchIcon.svg';
import Button from '../elements/Button';
import SearchBarFade from '../elements/SearchBarFade';

export default function TopBar({
  handleSearch,
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
  return (
    <div className={`flex padding-20-40 ${isDarkMode && 'background-color-black'}`}>
      <div className="flexBasis80">
        <SearchBarFade
          value={''}
          icon={SearchIcon}
          handleSearch={handleSearch}
          isDarkMode={isDarkMode}
        />
      </div>
      <div className="flexBasis20 flexCenter">
        {isConnected ? (
          <Button
            text="Log out"
            onClick={requestSignOut}
            backgroundColor={Colors.black}
            width={150}
            height={40}
          />
        ) : (
          <Button
            text="Log in"
            onClick={requestSignIn}
            backgroundColor={isDarkMode ? Colors.blue : Colors.black}
            width={150}
            height={40}
          />
        )}
      </div>
    </div>
  );
}
