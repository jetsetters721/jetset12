import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FaMapMarkerAlt, FaCalendar, FaArrowLeft, FaShip, FaSearch } from 'react-icons/fa';
// import './cruise-cards.css';
import cruiseLineData from './data/cruiselines.json';
import Navbar from '../Navbar';
import Footer from '../Footer';

const CruiseCards = () => {
  const [searchParams] = useSearchParams();
  const cruiseLineParam = searchParams.get('cruiseLine');
  const destinationParam = searchParams.get('destination');
  const countryParam = searchParams.get('country');
  
  const [title, setTitle] = useState("All Cruises");

  // Sample cruise data - in a real app this would be from an API
  const cruisesData = [
    {
      id: 1,
      title: "7 Night Caribbean Cruise",
      cruiseLine: "Royal Caribbean",
      departing: "Miami, Florida",
      destination: "Caribbean",
      portsOfCall: "Cozumel, Mexico • George Town, Grand Cayman • Falmouth, Jamaica",
      sailingDates: "January 2025 • February 2025 • March 2025",
      image: "/images/royal-caribbean.jpg",
    },
    {
      id: 2,
      title: "5 Night Mediterranean Cruise",
      cruiseLine: "Norwegian Cruise Line",
      departing: "Barcelona, Spain",
      destination: "Mediterranean",
      portsOfCall: "Naples, Italy • Rome (Civitavecchia), Italy • Florence/Pisa (Livorno), Italy",
      sailingDates: "April 2025 • May 2025 • June 2025",
      image: "/images/norwegian.jpg",
    },
    {
      id: 3,
      title: "10 Night Alaska Cruise",
      cruiseLine: "Celebrity Cruises",
      departing: "Vancouver BC, Canada",
      destination: "Vancouver BC",
      country: "Canada",
      portsOfCall: "Ketchikan, Alaska • Juneau, Alaska • Skagway, Alaska • Glacier Bay National Park",
      sailingDates: "June 2025 • July 2025 • August 2025",
      image: "/images/celebrity.jpg",
    },
    {
      id: 4,
      title: "4 Night Bahamas Cruise",
      cruiseLine: "Disney Cruise Line",
      departing: "Port Canaveral, Florida",
      destination: "Bahamas",
      portsOfCall: "Nassau, Bahamas • Disney Castaway Cay",
      sailingDates: "January 2025 • February 2025 • March 2025",
      image: "/images/disney.jpg",
    },
    {
      id: 5,
      title: "7 Night Japan Cruise",
      cruiseLine: "Princess Cruises",
      destination: "Tokyo",
      country: "Japan",
      departing: "Tokyo (Yokohama), Japan",
      portsOfCall: "Kobe, Japan • Busan, South Korea • Nagasaki, Japan",
      sailingDates: "May 2025 • June 2025 • July 2025",
      image: "/images/princess.jpg",
    },
    {
      id: 6,
      title: "7 Night Mediterranean Cruise",
      cruiseLine: "MSC Cruises",
      destination: "Santorini",
      country: "Greece",
      departing: "Piraeus (Athens), Greece",
      portsOfCall: "Santorini, Greece • Mykonos, Greece • Kusadasi, Turkey",
      sailingDates: "June 2025 • July 2025 • August 2025",
      image: "/images/msc.jpg",
    },
  ];

  // Filter cruises based on query parameters
  const [filteredCruises, setFilteredCruises] = useState(cruisesData);

  useEffect(() => {
    let filtered = cruisesData;
    let filterTitle = "All Cruises";

    if (cruiseLineParam) {
      filtered = filtered.filter(cruise => 
        cruise.cruiseLine.toLowerCase() === cruiseLineParam.toLowerCase()
      );
      filterTitle = `${cruiseLineParam} Cruises`;
    }

    if (destinationParam) {
      filtered = filtered.filter(cruise => 
        cruise.destination?.toLowerCase() === destinationParam.toLowerCase() ||
        cruise.portsOfCall?.toLowerCase().includes(destinationParam.toLowerCase())
      );
      filterTitle = `Cruises to ${destinationParam}`;
    }

    if (countryParam) {
      filtered = filtered.filter(cruise => 
        cruise.country?.toLowerCase() === countryParam.toLowerCase() ||
        cruise.portsOfCall?.toLowerCase().includes(countryParam.toLowerCase())
      );
      if (!destinationParam) {
        filterTitle = `Cruises to ${countryParam}`;
      }
    }

    setFilteredCruises(filtered);
    setTitle(filterTitle);
  }, [cruiseLineParam, destinationParam, countryParam]);

  return (
    <>
      <Navbar />
      
      {/* Enhanced Hero Section */}
      <div className="w-full">
        <div className="relative">
          <img 
            src="/images/Rectangle 1434.png" 
            alt="Cruise Header" 
            className="w-full h-[500px] object-cover object-center brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60 flex flex-col items-center justify-center px-4">
            <h1 className="text-4xl md:text-6xl text-white font-bold text-center mb-4 drop-shadow-lg">{title}</h1>
            <p className="text-xl md:text-2xl text-white text-center max-w-3xl mx-auto font-light drop-shadow-md">
              Discover incredible cruise vacations to breathtaking destinations around the world
            </p>
            <div className="flex flex-wrap justify-center mt-8 gap-4">
              <Link to="/" className="bg-white hover:bg-gray-100 text-[#0066b2] font-medium py-3 px-6 rounded-md transition-colors flex items-center gap-2">
                <FaSearch /> Explore More Destinations
              </Link>
              <Link to="/itinerary" className="bg-[#0066b2] hover:bg-[#005091] text-white font-medium py-3 px-6 rounded-md transition-colors flex items-center gap-2">
                <FaShip /> View All Itineraries
              </Link>
            </div>
          </div>
        </div>
        
        {/* Main Content Section */}
        <div className="max-w-[1400px] mx-auto p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 mt-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Available Cruises</h2>
              <p className="text-gray-600 mt-2">Find your perfect cruise vacation from our curated selection</p>
            </div>
            <Link to="/" className="mt-4 md:mt-0 bg-[#0066b2] hover:bg-[#005091] text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-2">
              <FaArrowLeft size={14} /> Back to Home
            </Link>
          </div>

          {filteredCruises.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-gray-100 rounded-full">
                <FaSearch size={30} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">No cruises found matching your criteria</h2>
              <p className="mb-8 text-gray-600 max-w-md mx-auto">Try searching with different parameters or view all available cruises.</p>
              <Link to="/cruises" className="bg-[#0066b2] hover:bg-[#005091] text-white font-medium py-3 px-8 rounded-md transition-colors inline-flex items-center gap-2">
                <FaShip /> View All Cruises
              </Link>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredCruises.map((cruise) => (
                <div
                  key={cruise.id}
                  className="bg-white rounded-[24px] overflow-hidden flex flex-col md:flex-row shadow-xl relative transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                >
                  <div className="w-full md:w-2/5 h-[300px] md:h-[450px]">
                    <img
                      src={cruise.image || "/placeholder.svg"}
                      alt={cruise.cruiseLine}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-[#0066b2]/90 text-white py-1 px-3 rounded-full text-sm font-medium">
                      {cruise.cruiseLine}
                    </div>
                  </div>

                  <div
                    className="w-full md:w-3/5 p-6 md:p-10 flex flex-col justify-center"
                  >
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">{cruise.title}</h2>
                    <div className="flex items-center text-gray-500 mb-6">
                      <FaShip className="mr-2" />
                      <span className="text-lg">{cruise.cruiseLine}</span>
                    </div>

                    <div className="space-y-6 md:space-y-6 mb-8">
                      <div className="flex items-start">
                        <div className="w-8 h-8 mr-4 mt-1 text-[#0066b2] bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4"
                          >
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                        </div>
                        <div>
                          <span className="block text-gray-800 font-semibold mb-1">Departing From</span>
                          <span className="text-gray-600">{cruise.departing}</span>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-8 h-8 mr-4 mt-1 text-[#0066b2] bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4"
                          >
                            <path d="M18 8C18 4.5 15 3 12 3C9 3 6 4.5 6 8C6 11.5 3 10 3 16L4.5 17.5H19.5L21 16C21 10 18 11.5 18 8Z"></path>
                            <path d="M12 20V17.5"></path>
                          </svg>
                        </div>
                        <div>
                          <span className="block text-gray-800 font-semibold mb-1">Ports of Call</span>
                          <span className="text-gray-600">{cruise.portsOfCall}</span>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-8 h-8 mr-4 mt-1 text-[#0066b2] bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4"
                          >
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                        </div>
                        <div>
                          <span className="block text-gray-800 font-semibold mb-1">Sailing Dates</span>
                          <span className="text-gray-600">{cruise.sailingDates}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Link
                        to={`/itinerary?cruise=${cruise.id}&cruiseLine=${encodeURIComponent(cruise.cruiseLine)}`}
                        className="bg-[#0066b2] hover:bg-[#005091] text-white font-medium py-3 px-8 rounded-md transition-colors inline-flex items-center"
                      >
                        View Itinerary
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Additional Trust Elements */}
          <div className="mt-20 mb-12">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Why Book With Us</h3>
              <p className="text-gray-600">Industry-leading service and satisfaction</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#0066b2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className="font-bold text-lg mb-2">Secure Booking</h4>
                <p className="text-gray-600">Your personal and payment information is always protected</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#0066b2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="font-bold text-lg mb-2">Best Price Guarantee</h4>
                <p className="text-gray-600">We'll match or beat any comparable cruise offer</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#0066b2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-lg mb-2">24/7 Support</h4>
                <p className="text-gray-600">Our travel experts are here for you before, during, and after your trip</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CruiseCards; 