import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import multiLogo from '../images/multi.png';
import React, { useState } from 'react';

const convertMinutesToHours = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60; 
    return `${hours} hrs ${minutes} mins`;
  };

  const convertTo12HourFormat = (timeString) => {
    const date = new Date(timeString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${formattedMinutes} ${ampm}`;
  };

const Return = () =>{
    const location = useLocation();
    const bookedFlights = location.state?.bookedFlights || [];
    const airlineLogos = location.state?.airlineLogos || []; 
    const navigate = useNavigate();


    const [openAccordionId, setOpenAccordionId] = useState(null);
  
    const toggleAccordion = (id) => {
        setOpenAccordionId((prevId) => (prevId === id ? null : id));
      };

      const handleChangeFlight = () => {
        navigate('/');
      };

    return (
        <div>
        <p className="max-w-2xl mx-auto p-4 font-bold text-left">Booked Flights</p>
        {console.log("Booked:", [bookedFlights][0])}
          {bookedFlights !== null ? (
        bookedFlights[0].legs.map((flight) => (
          <div key={flight.id} className="max-w-2xl mx-auto p-4">
            <div 
          className="flex flex-col sm:flex-row justify-between items-center border rounded-lg p-4 cursor-pointer hover:bg-gray-100"
          onClick={() => toggleAccordion(flight.id)}
            >
              {/* Airline Logo */}
              <div className="flex items-center mb-4 sm:mb-0">
                {flight.stopCount > 1 ? (
                  <img
                    src={multiLogo}
                    alt="Airline Logo"
                    className="w-10 h-10 mr-4"
                  />
                ) : (
                  <img
                    src={flight.carriers.marketing.length > 1 ? 
                      airlineLogos[flight.carriers.marketing[1].id].logoUrl :
                      airlineLogos[flight.carriers.marketing[0].id].logoUrl}
                    alt={flight.carriers.marketing.name}
                    className="w-10 h-10 mr-4"
                  />
                )}
                
                {openAccordionId === flight.id ? (
                  <div className="text-left">
                    <p className="font-bold">Return . {new Date(flight.departure).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                  </div>
    
                ) : (
                  <div className="text-left">
                    <p className="font-bold">{convertTo12HourFormat(flight.departure)} - {convertTo12HourFormat(flight.arrival)}</p>
                    <p className="text-sm text-gray-500">
                      {flight.stopCount > 1 && flight.carriers.marketing.length > 1 ? (
                        flight.carriers.marketing.map((airline, index) => (
                          <span key={airline.id}>
                            {airline.name}{index < flight.carriers.marketing.length - 1 && ', '}
                          </span>
                        ))
                      ) : (
                        flight.carriers.marketing.length > 1 ? (
                          <span>{flight.carriers.marketing.name}</span>
                        ) : (
                          <span>{flight.carriers.marketing[0].name}</span>
                        )
                      )}
                    </p>
                  </div>
                )}
              </div>
    
              {openAccordionId !== flight.id && (
                <>
                  <div className="text-left">
                    <p className="font-bold">
                      {convertMinutesToHours(
                        flight.segments.reduce((accumulator, segment) => accumulator + segment.durationInMinutes, 0)
                      )}
                    </p>
                    <p className="text-sm text-gray-500">{flight.origin.displayCode} - {flight.destination.displayCode}</p>
                  </div>    
    
                  <div className="text-left">
                    <p className="font-bold">{flight.stopCount < 2 ? (<span>{flight.stopCount} stop</span>) : (<span>{flight.stopCount} stops</span>)}</p>
                    <p className="text-sm text-gray-500">{flight.segments.slice(0,-1).map((stop, index) => (
                      <span key={index}>
                        {flight.stopCount === 1 ? (<span>{convertMinutesToHours(stop.durationInMinutes)} {stop.destination.displayCode}</span>) : (stop.destination.displayCode)}
                        {index < flight.segments.length - 2 && ', '}
                      </span>
                    ))}</p>
                  </div>
                </>
              )}
    
                {openAccordionId === flight.id ? (
                      <button onClick={()=>handleChangeFlight()} className="mt-2 bg-green-500 text-white p-2 mx-2 rounded">Change Flight</button>
                ) :("")}
    
    
              <div className="ml-4">
                <svg
                  className={`w-6 h-6 transform transition-transform ${openAccordionId === flight.id ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
    
            {/* Accordion Content */}
            {openAccordionId === flight.id && (
              <div className="border rounded-lg p-4 shadow-lg bg-white sm:flex-col sm:items-center">
                {flight.segments.map((segment, index) => (
    <div key={index} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-10">
      <div className="flex flex-col sm:flex-row items-center">
                      {/* Logo Container */}
                      {flight.stopCount > 1 && (
          <div className="flex items-center mb-4 sm:mb-0">
          <img
                            src={airlineLogos[segment.marketingCarrier.id].logoUrl} 
                            alt={flight.carriers.marketing.name}
                            className="w-8 h-8"
                          />
                        </div>
                      )}
                      
                      <div className="flex flex-row sm:flex-col items-center justify-center h-full mb-4 sm:mb-0 sm:mr-4">
                        <div className="flex flex-col items-center mb-2 hidden sm:block ">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
    
                        <div className="flex-grow border-l-2 border-dashed border-gray-400 hidden sm:block"></div>
    
                        <div className="flex flex-col items-center mt-2 hidden sm:block">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
    
                      <div className="flex flex-col justify-between h-full ml-2 sm:ml-4">
                        <p className="text-sm text-left -mt-1.5 font-bold">{convertTo12HourFormat(segment.departure)} . {segment.origin.name} Airport ({segment.origin.displayCode})</p>
                        
                        <p className="text-sm text-left my-2 sm:my-5">Travel Time: {convertMinutesToHours(segment.durationInMinutes)}</p>
                        
                        <p className="text-sm text-left -mb-1.5 font-bold">{convertTo12HourFormat(segment.arrival)} . {segment.destination.name} Airport ({segment.destination.displayCode})</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
        ) : (
            <p>No flights found</p>
            )}
            {bookedFlights !== null?
            <div className="flex flex-row mt-5">
                <button className="mx-auto max-w-2xl bg-blue-500 text-white p-2 rounded">Book Now!</button>
            </div>
            :
            ""
            }

      </div>
    )
}

export default Return;


