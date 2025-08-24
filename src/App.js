import React, { useState, useEffect } from 'react';
import './App.css';

// A helper function to get the Julian Day Number for a given date.
// The Julian Day Number (JDN) is a continuous count of days since noon on January 1, 4713 BC.
// This is a common and accurate way to handle date calculations in astronomy.
const getJulianDate = (date) => {
  const time = date.getTime();
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  const JD = (time / 86400000) - (date.getTimezoneOffset() / 1440) + 2440587.5;
  return JD;
};

// A helper function to get the moon's age and phase name based on the Julian Day.
const getMoonPhase = (date) => {
  const JD = getJulianDate(date);
  // The Julian Day of a known new moon (January 6, 2000, 18:14 UTC).
  const newMoonJD = 2451549.5019;
  
  // Calculate the moon's age in days since the last new moon.
  const moonAge = (JD - newMoonJD) % 29.53058867;

  // An object to map the moon age to a phase label and icon (using emojis).
  const phases = [
    { name: "New Moon", emoji: "🌑" },
    { name: "Waxing Crescent", emoji: "🌒" },
    { name: "First Quarter", emoji: "🌓" },
    { name: "Waxing Gibbous", emoji: "🌔" },
    { name: "Full Moon", emoji: "🌕" },
    { name: "Waning Gibbous", emoji: "🌖" },
    { name: "Last Quarter", emoji: "🌗" },
    { name: "Waning Crescent", emoji: "🌘" },
  ];

  // The phase index is based on the moon's age, with a full cycle of 8 phases.
  const phaseIndex = Math.floor(moonAge * 8 / 29.53058867);
  return phases[phaseIndex] || phases[0]; // Return the correct phase or New Moon as a fallback.
};

function App() {
  const [todayMoonPhase, setTodayMoonPhase] = useState({});
  const [nextSevenDays, setNextSevenDays] = useState([]);
  const [showSevenDays, setShowSevenDays] = useState(false);
  const [searchDate, setSearchDate] = useState('');
  const [searchedMoonPhase, setSearchedMoonPhase] = useState(null);

  // useEffect runs when the component first mounts to calculate the initial moon phase.
  useEffect(() => {
    // Calculate and set today's moon phase.
    const today = new Date();
    setTodayMoonPhase(getMoonPhase(today));
    
    // Calculate the moon phases for the next 7 days.
    const phases = [];
    for (let i = 1; i <= 7; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      phases.push({
        date: nextDay.toLocaleDateString(),
        ...getMoonPhase(nextDay)
      });
    }
    setNextSevenDays(phases);
  }, []); // The empty array ensures this effect runs only once on mount.

  // A handler to toggle the display of the next 7 days.
  const handleToggleSevenDays = () => {
    setShowSevenDays(!showSevenDays);
  };

  // A handler for when the search date input changes.
  const handleDateChange = (event) => {
    setSearchDate(event.target.value);
  };

  // A handler to find the moon phase for the selected date.
  const handleSearch = () => {
    if (searchDate) {
      const date = new Date(searchDate);
      const moonPhase = getMoonPhase(date);
      setSearchedMoonPhase({
        date: date.toLocaleDateString(),
        ...moonPhase
      });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Moon Phase Tracker</h1>
      </header>
      <main className="App-main">
        <div className="current-phase-container">
          <p className="date-label">Today's Date: {new Date().toLocaleDateString()}</p>
          <div className="moon-display">
            <span className="moon-emoji">{todayMoonPhase.emoji}</span>
            <p className="phase-label">{todayMoonPhase.name}</p>
          </div>
          <button className="seven-day-btn" onClick={handleToggleSevenDays}>
            {showSevenDays ? "Hide Next 7 Days" : "Show Next 7 Days"}
          </button>
        </div>

        {showSevenDays && (
          <div className="next-seven-days-container">
            <h2>Next 7 Days</h2>
            <div className="moon-grid">
              {nextSevenDays.map((phase, index) => (
                <div key={index} className="moon-card">
                  <p className="card-date">{phase.date}</p>
                  <span className="moon-emoji-small">{phase.emoji}</span>
                  <p className="card-label">{phase.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New search feature section */}
        <div className="search-container">
          <h2>Search a Specific Date</h2>
          <div className="search-input-group">
            <input 
              type="date" 
              value={searchDate} 
              onChange={handleDateChange} 
              className="date-input" 
            />
            <button className="search-btn" onClick={handleSearch}>
              Search
            </button>
          </div>
          {searchedMoonPhase && (
            <div className="moon-display-search">
              <p className="date-label">Date: {searchedMoonPhase.date}</p>
              <div className="moon-display">
                <span className="moon-emoji-search">{searchedMoonPhase.emoji}</span>
                <p className="phase-label-search">{searchedMoonPhase.name}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
