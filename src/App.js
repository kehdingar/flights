import React from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import FlightSearch from './components/FlightSearch';

const App = () => {
  return (
    <Router>
      <FlightSearch />
    </Router>
  );
};

export default App;