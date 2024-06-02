import { useState, useEffect } from 'react';
import styles from './App.module.scss';
import { addUser, updateUserCoins, getUser, getAllUsers, clearDB } from './Database/db';
import { countries } from './Database/countries';
import Leaderboard from './Components/Leaderboard/Leaderboard';
import populateDB from './Database/populateDB';
import { UserOutlined, TrophyOutlined, LogoutOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import buttonSvg from './assets/button.png';
import moneySvg from './assets/money.png';

function App() {
  const [coinCount, setCoinCount] = useState<number>(0);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [currentView, setCurrentView] = useState<string>('coin');

  useEffect(() => {
    const initializeApp = async () => {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
        const user = await getUser(storedUserId);
        if (user) {
          setCoinCount(user.coins);
          setSelectedCountry(user.country);
        }
      } else {
        const newUserId = 'You';
        localStorage.setItem('userId', newUserId);
        setUserId(newUserId);
      }
    };

    initializeApp();
  }, []);

  const handleButtonClick = async () => {
    const newCoinCount = coinCount + 1;
    setCoinCount(newCoinCount);
    if (userId && selectedCountry) {
      await updateUserCoins(userId, newCoinCount);
    }
  };

  const handleCountryChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const users = await getAllUsers();
    if (users.length === 0) {
      await populateDB();
    }
    const country = event.target.value;
    setSelectedCountry(country);
    if (userId) {
      await addUser({ userid: userId, country, coins: 0 });
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('userId');
    await clearDB(); // Clear the IndexedDB database
    setSelectedCountry(null);
    setCoinCount(0);
    setUserId('');
    setCurrentView('coin');
  };

  const renderContent = () => {
    if (!selectedCountry) {
      return (
        <div className={styles.countrySelection}>
          <h1>Select Your Country</h1>
          <select onChange={handleCountryChange} defaultValue="">
            <option value="" disabled>
              Choose your country
            </option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (currentView === 'coin') {
      return (
        <div>
          <div className={styles.score}>
            <img src={moneySvg} alt="money" className={styles.scoreImg} />
            <h1>{coinCount}</h1>
          </div>
          <p>Country: {selectedCountry}</p>
          <img src={buttonSvg} alt="Click to earn coins" className={styles.clickButton} onClick={handleButtonClick} />
        </div>
      );
    }

    if (currentView === 'leaderboard') {
      return <Leaderboard />;
    }

    return null;
  };

  return (
    <div className={styles.app}>
      {renderContent()}
      {selectedCountry && (
        <div className={styles.menu}>
          <Button ghost className={styles.btn} onClick={() => setCurrentView('coin')} shape="circle" icon={<UserOutlined className={styles.icon} />} />
          <Button ghost className={`${styles.btn} ${styles.invisible}`} onClick={handleLogout} shape="circle" icon={<LogoutOutlined className={styles.icon} />} />
          <Button ghost className={styles.btn} onClick={() => setCurrentView('leaderboard')} shape="circle" icon={<TrophyOutlined className={styles.icon} />} />
        </div>
      )}
    </div>
  );
}

export default App;
