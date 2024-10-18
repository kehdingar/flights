import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Departure from './Departure';
import Return from './Return';

const FlightSearch = () => {
  const navigate = useNavigate();
  const [originSkyId, setOriginSkyId] = useState('ABV');
  const [destinationSkyId, setDestinationSkyId] = useState('DXB');
  const [originEntityId, setOriginEntityId] = useState('128668198');
  const [destinationEntityId, setDestinationEntityId] = useState('95673506');
  const [date, setDate] = useState();
  const [returnDate, setReturnDate] = useState();
  const [cabinClass, setCabinClass] = useState('economy');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [sortBy, setSortBy] = useState('best');
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]); 
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [dataError, setDataError] = useState(null); 
  const location = useLocation(); 


  const fetchOriginCityDetails = async (originCity) => {
    try {
      const response = await axios.get(`https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport`, {
        params: {
          query: originCity,
          locale: 'en-US'
        },
        headers: {
          'X-RapidAPI-Key': '9d957b647dmsh61b8df5bedf7854p16d406jsn69ff88bf3b76',
          'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com',
        },          
      });
      setOriginSkyId(response.data.originSkyId);
      setOriginEntityId(response.data.originEntityId);
      setOriginSuggestions(response.data.data || []);
      setShowOriginSuggestions(true);
    } catch (error) {
      console.error("Error fetching Sky IDs:", error);
    }
  };

  const handleOriginSelection = (suggestion) => {
    setOriginSkyId(suggestion.skyId); 
    setOriginEntityId(suggestion.entityId);
    setShowOriginSuggestions(false); 
  };  
  
  const handleDestinationSelection = (suggestion) => {
    console.log("id",suggestion)
    setDestinationSkyId(suggestion.skyId);
    setDestinationEntityId(suggestion.entityId); 
    setShowDestinationSuggestions(false); 
  };

  const fetchDestinationCityDetails = async (destinationCity) => {
    try {
      const response = await axios.get(`https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport`, {
        params: {
          query: destinationCity,
          locale: 'en-US'
        },
        headers: {
          'X-RapidAPI-Key': '9d957b647dmsh61b8df5bedf7854p16d406jsn69ff88bf3b76',
          'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com',
        },        
      });

      setDestinationSkyId(response.data.destinationSkyId);
      setDestinationEntityId(response.data.destinationEntityId);
      setDestinationSuggestions(response.data.data || []); 
      setShowDestinationSuggestions(true);
    } catch (error) {
      console.error("Error fetching Sky IDs:", error);
    }
  };

  // Hide dropdown list for origins and destinations when clicked outside the list
  const handleGeneralclick = () =>{
    setShowOriginSuggestions(false)
    setShowDestinationSuggestions(false)
  }

  useEffect(() => {
    // Attach the event listener to the window
    window.addEventListener('click', handleGeneralclick);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('click', handleGeneralclick);
    };
  }, []);  


  const fetchFlights = async () => {
    setLoading(true);
    setDataError(null);
    try {
      const response = await axios.get('https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlightsComplete', {
        params: {
          originSkyId: originSkyId,
          destinationSkyId: destinationSkyId,
          originEntityId: originEntityId,
          destinationEntityId: destinationEntityId,
          date: date,
          returnDate: returnDate,
          cabinClass: cabinClass,
          adults: adults,
          childrens: children,
          infants: infants,
          sortBy: sortBy,
          currency: 'USD',
          market: 'en-US',
          countryCode: 'US',
        },
        headers: {
          'X-RapidAPI-Key': '9d957b647dmsh61b8df5bedf7854p16d406jsn69ff88bf3b76',
          'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com',
        },
      });

      if (response.data.status){
        const logoMap = {};
        const logos = response.data.data.filterStats.carriers;
        logos.forEach(logo => {
          logoMap[logo.id] = logo;
        });

        const flightsData = response.data;
        const itinerariesData = response.data.data.itineraries;
    
        // Navigate to departure page after fetching flights
        navigate('/departure', {
          state: {
            flights: flightsData,
            itineraries: itinerariesData,
            airlineLogos: logoMap,
          }
        });
      }else{
        console.log(response.data.message)
        setDataError(...response.data.message)
      }
    } catch (error) {
      console.error(error);
    }finally {
      setLoading(false);
    }
  };
  return (
<div className="p-4 max-w-full bg-white shadow-md rounded-lg lg:px-40 md:px-40">
  <h1 className="text-2xl font-bold mb-6 text-center">Flight Search</h1>

  <div className="relative mb-4">
    <label className="block text-sm font-medium mb-1 text-gray-600" htmlFor="originSkyId">Origin Sky ID:</label>
    <input 
      id="originSkyId"
      type="text" 
      value={originSkyId} 
      onChange={(e) => fetchOriginCityDetails(e.target.value)} 
      placeholder="Origin Sky ID" 
      className="border rounded-md p-3 w-full" 
    />
    {showOriginSuggestions && (
      <ul className="absolute border bg-white w-full rounded-md z-10 max-h-40 overflow-y-auto shadow-lg">
        {originSuggestions.map((suggestion, index) => (
          <li 
            key={index} 
            onClick={() => handleOriginSelection(suggestion)} 
            className="cursor-pointer hover:bg-gray-200 p-2"
          >
            {suggestion.presentation.suggestionTitle}
          </li>
        ))}
      </ul>
    )}
  </div>

  <div className="relative mb-4">
    <label className="block text-sm font-medium mb-1 text-gray-600" htmlFor="destinationSkyId">Destination Sky ID:</label>
    <input 
      id="destinationSkyId"
      type="text" 
      value={destinationSkyId} 
      onChange={(e) => fetchDestinationCityDetails(e.target.value)} 
      placeholder="Destination Sky ID" 
      className="border rounded-md p-3 w-full" 
    />
    {showDestinationSuggestions && (
      <ul className="absolute border bg-white w-full rounded-md z-10 max-h-40 overflow-y-auto shadow-lg">
        {destinationSuggestions.map((suggestion, index) => (
          <li 
            key={index} 
            onClick={() => handleDestinationSelection(suggestion)} 
            className="cursor-pointer hover:bg-gray-200 p-2"
          >
            {suggestion.presentation.suggestionTitle}
          </li>
        ))}
      </ul>
    )}
  </div>

  <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
    <div className="w-full mb-4 sm:mb-0">
      <label className="block text-sm font-medium mb-1 text-gray-600" htmlFor="departureDate">Departure Date:</label>
      <input 
        id="departureDate"
        type="date" 
        value={date} 
        onChange={(e) => setDate(e.target.value)} 
        className="border rounded-md p-3 w-full" 
      />
    </div>
    <div className="w-full">
      <label className="block text-sm font-medium mb-1 text-gray-600" htmlFor="returnDate">Return Date: (optional)</label>
      <input 
        id="returnDate"
        type="date" 
        value={returnDate} 
        onChange={(e) => setReturnDate(e.target.value)} 
        className="border rounded-md p-3 w-full" 
      />
    </div>
  </div>

  <div className="mb-4">
    <label className="block text-sm font-medium mb-1 text-gray-600" htmlFor="cabinClass">Cabin Class: (optional)</label>
    <select 
      id="cabinClass"
      value={cabinClass} 
      onChange={(e) => setCabinClass(e.target.value)} 
      className="border rounded-md p-3 w-full"
    >
      <option value="economy">Economy</option>
      <option value="premium_economy">Premium Economy</option>
      <option value="business">Business</option>
      <option value="first">First</option>
    </select>
  </div>

  <div className="mb-4">
    <label className="block text-sm font-medium mb-1 text-gray-600" htmlFor="sortBy">Sort By: (optional)</label>
    <select 
      id="sortBy"
      value={sortBy} 
      onChange={(e) => setSortBy(e.target.value)} 
      className="border rounded-md p-3 w-full"
    >
      <option value="best">Best</option>
      <option value="price_high">Cheapest</option>
      <option value="fastest">Fastest</option>
      <option value="outbound_take_off_time">Outbound Take Off Time</option>
      <option value="outbound_landing_time">Outbound Landing Time</option>
      <option value="return_take_off_time">Return Take Off Time</option>
      <option value="return_landing_time">Return Landing Time</option>
    </select> 
  </div>

  <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
    <div className="w-full mb-4 sm:mb-0">
      <label className="block text-sm font-medium mb-1 text-gray-600" htmlFor="adults">Adults (12+ years): (optional)</label>
      <input 
        id="adults"
        type="number" 
        min="1" 
        max="12" 
        value={adults} 
        onChange={(e) => setAdults(e.target.value)} 
        placeholder="" 
        className="border rounded-md p-3 w-full" 
      />
    </div>
    
    <div className="w-full">
      <label className="block text-sm font-medium mb-1 text-gray-600" htmlFor="children">Children (2-12 years): (optional)</label>
      <input 
        id="children"
        type="number" 
        min="0" 
        max="10" 
        value={children} 
        onChange={(e) => setChildren(e.target.value)} 
        placeholder="" 
        className="border rounded-md p-3 w-full" 
      />
    </div>
  </div>

  <div className="">
    <label className="block text-sm font-medium mb-1 text-gray-600" htmlFor="infants">Infants (Under 2 years): (optional)</label>
    <input 
      id="infants"
      type="number" 
      min="0" 
      max="10" 
      value={infants} 
      onChange={(e) => setInfants(e.target.value)} 
      placeholder=""
      className="border rounded-md p-3 w-full" 
    />
  </div>
        {
        dataError && (
        Object.entries(dataError).map(([key, value]) => (
          <p key={key} className="bg-red-500 text-white text-center p-1 block rounded-md">Error: {value} {key}</p>
        ))
      )}

  <div className="text-center">
    <button 
      onClick={fetchFlights} 
      className="bg-blue-400 text-white font-bold py-2 px-4 mt-5 rounded-md hover:bg-blue-600 transition-all"
      >
      Search Flights
    </button>
  </div>
         {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mb-2"></div>
            <p className="text-white">Fetching Data...</p>
          </div>
    )}

  <div>
    {location.pathname === '/departure' && <Departure />}
    {location.pathname === '/return' && <Return />}
  </div>
</div>

  );
};

export default FlightSearch;