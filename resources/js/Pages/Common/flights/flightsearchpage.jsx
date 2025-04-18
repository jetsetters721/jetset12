import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, ArrowUpDown, Filter, X, Calendar, ArrowRight, ChevronLeft, ChevronRight, Plane } from "lucide-react";
import FlightSearchForm from "./flight-search-form";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { 
  defaultSearchData, 
  cheapFlights, 
  destinations,
  sourceCities,
  specialFares
} from "./data.js";

export default function FlightSearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState(defaultSearchData);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("price");
  const [dateRange, setDateRange] = useState([]);
  const [filters, setFilters] = useState({
    price: [0, 20000],
    stops: "any",
    airlines: []
  });
  const [error, setError] = useState(null);
  const [expandedFlights, setExpandedFlights] = useState({});

  // Generate date range based on current date
  useEffect(() => {
    const today = new Date();
    const dates = [];
    
    // Find the lowest price for highlighting
    let lowestPrice = Number.MAX_VALUE;
    let lowestPriceIndex = 0;
    
    for (let i = -3; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Generate a price based on cheap flights data for more realistic values
      const price = cheapFlights[Math.floor(Math.random() * cheapFlights.length)].price;
      const numericPrice = parseInt(price.replace(/[^\d]/g, ""));
      
      if (numericPrice < lowestPrice) {
        lowestPrice = numericPrice;
        lowestPriceIndex = i + 3; // Adjust index to 0-based array
      }
      
      const formattedDate = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      dates.push({
        date: formattedDate,
        day: dayName,
        price: price,
        lowestPrice: i + 3 === lowestPriceIndex,
        selected: i === 0 // Initially select today
      });
    }
    
    setDateRange(dates);
    
    // Generate flight data based on search parameters or default data
    const flightData = location.state?.searchData ? generateFlights(location.state.searchData) : [];
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      setFlights(flightData);
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [location.state]);
  
  // Update search params when location state changes
  useEffect(() => {
    if (location.state?.searchData) {
      setSearchParams(location.state.searchData);
    }
  }, [location.state]);
  
  // Generate flights based on search params
  const generateFlights = (searchParams) => {
    // In a real app, this would be replaced with an API call to get flight data
    
    // Use the cheapFlights data from data.js to generate more realistic flights
    const flightList = [];
    
    // Generate 15-20 flights
    const numFlights = 15 + Math.floor(Math.random() * 6);
    
    // Airline data with codes for generating flight numbers
    const airlineCodes = {
      'IndiGo': 'IGO',
      'Air India': 'AIC',
      'SpiceJet': 'SJT',
      'GoAir': 'GAI',
      'Vistara': 'VTI',
      'AirAsia India': 'IAD'
    };
    
    // List of airlines to use
    const airlines = [
      { name: 'IndiGo', code: 'IGO' },
      { name: 'Air India', code: 'AIC' },
      { name: 'SpiceJet', code: 'SJT' },
      { name: 'GoAir', code: 'GAI' },
      { name: 'Vistara', code: 'VTI' },
      { name: 'AirAsia India', code: 'IAD' }
    ];
    
    for (let i = 0; i < numFlights; i++) {
      // Get a random flight from cheapFlights for price data
      const baseFlightData = cheapFlights[Math.floor(Math.random() * cheapFlights.length)];
      const stops = Math.random() > 0.6 ? '0' : (Math.random() > 0.5 ? '1' : '2');
      const isDirect = stops === '0';
      
      const durationInMinutes = isDirect ? 
        120 + Math.floor(Math.random() * 180) : 
        240 + Math.floor(Math.random() * 240);
      
      const hours = Math.floor(durationInMinutes / 60);
      const minutes = durationInMinutes % 60;
      const duration = `${hours}h ${minutes}m`;
      
      // Generate departure time between 6 AM and 11 PM
      const departureHour = 6 + Math.floor(Math.random() * 18);
      const departureMinute = Math.floor(Math.random() * 60);
      const departureTime = `${departureHour.toString().padStart(2, '0')}:${departureMinute.toString().padStart(2, '0')}`;
      
      // Calculate arrival time based on departure and duration
      const departTimeObj = new Date();
      departTimeObj.setHours(departureHour, departureMinute, 0);
      const arriveTimeObj = new Date(departTimeObj.getTime() + durationInMinutes * 60 * 1000);
      const arrivalTime = `${arriveTimeObj.getHours().toString().padStart(2, '0')}:${arriveTimeObj.getMinutes().toString().padStart(2, '0')}`;
      
      // Get a random airline
      const airlineData = airlines[Math.floor(Math.random() * airlines.length)];
      
      const flight = {
        id: `FL-${1000 + i}`,
        airline: airlineData,
        flightNumber: `${airlineData.code}${100 + Math.floor(Math.random() * 900)}`,
        departureTime,
        arrivalTime,
        departureAirport: {
          name: searchParams.from || 'Mumbai',
          code: searchParams.from ? searchParams.from.substring(0, 3).toUpperCase() : 'BOM'
        },
        arrivalAirport: {
          name: searchParams.to || 'Delhi',
          code: searchParams.to ? searchParams.to.substring(0, 3).toUpperCase() : 'DEL'
        },
        duration,
        stops,
        price: baseFlightData.price,
        aircraft: ['Boeing 737', 'Airbus A320', 'Boeing 777', 'Airbus A380'][Math.floor(Math.random() * 4)],
        class: ['Economy', 'Premium Economy', 'Business'][Math.floor(Math.random() * 3)],
        baggage: ['15 kg', '20 kg', '25 kg', '30 kg'][Math.floor(Math.random() * 4)],
        inFlightServices: Math.random() > 0.5 ? 'Meal & Entertainment' : 'Snacks & Wi-Fi'
      };
      
      flightList.push(flight);
    }
    
    return flightList;
  };

  // Handle search form submission
  const handleSearch = (searchData) => {
    setLoading(true);
    setSearchParams(searchData);
    
    // Simulate API call delay
    setTimeout(() => {
      const flightData = generateFlights(searchData);
      setFlights(flightData);
      setLoading(false);
    }, 1500);
  };
  
  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value
    });
  };
  
  // Apply filters to flights
  const getFilteredFlights = () => {
    return flights.filter(flight => {
      // Filter by price
      const flightPrice = parseInt(flight.price.replace(/[^\d]/g, ""));
      if (flightPrice < filters.price[0] || flightPrice > filters.price[1]) {
        return false;
      }
      
      // Filter by stops
      if (filters.stops !== "any" && flight.stops !== filters.stops) {
        return false;
      }
      
      // Filter by airlines
      if (filters.airlines.length > 0) {
        const airlineName = typeof flight.airline === 'string' ? flight.airline : flight.airline.name;
        if (!filters.airlines.includes(airlineName)) {
          return false;
        }
      }
      
      return true;
    }).sort((a, b) => {
      // Sort by selected order
      const aPrice = parseInt(a.price.replace(/[^\d]/g, ""));
      const bPrice = parseInt(b.price.replace(/[^\d]/g, ""));
      
      if (sortOrder === "price") {
        return aPrice - bPrice;
      } else if (sortOrder === "-price") {
        return bPrice - aPrice;
      } else if (sortOrder === "duration") {
        const aDuration = a.duration.split("h")[0] * 60 + parseInt(a.duration.split("h")[1]);
        const bDuration = b.duration.split("h")[0] * 60 + parseInt(b.duration.split("h")[1]);
        return aDuration - bDuration;
      } else if (sortOrder === "departure") {
        return a.departureTime.localeCompare(b.departureTime);
      } else if (sortOrder === "arrival") {
        return a.arrivalTime.localeCompare(b.arrivalTime);
      }
      
      return 0;
    });
  };

  // Handle date navigation in the date bar
  const handleDateNavigate = (direction) => {
    // In a real app, this would adjust the date range shown in the date selector
    console.log("Navigate date range:", direction);
  };

  // Handle date selection in the date bar
  const handleDateSelect = (date) => {
    // In a real app, this would update the search with the selected date
    console.log("Selected date:", date);
    
    // Update the date range to mark the selected date
    setDateRange(prev => 
      prev.map(item => ({
        ...item,
        selected: item.date === date
      }))
    );
  };

  // Toggle an airline in the filter
  const toggleAirlineFilter = (airline) => {
    const updatedAirlines = filters.airlines.includes(airline)
      ? filters.airlines.filter(a => a !== airline)
      : [...filters.airlines, airline];
    
    handleFilterChange('airlines', updatedAirlines);
  };

  // Get unique airlines from available flights
  const getUniqueAirlines = () => {
    return [...new Set(flights.map(flight => 
      typeof flight.airline === 'string' ? flight.airline : flight.airline.name
    ))];
  };

  // Handle booking a flight
  const handleBookFlight = (flight) => {
    // Create a booking reference to pass to the confirmation page
    const bookingReference = {
      flight: flight,
      passengers: parseInt(searchParams.travelers) || 1,
      tripType: searchParams.tripType,
      departDate: searchParams.departDate,
      returnDate: searchParams.returnDate,
      bookingId: `JET${Math.floor(Math.random() * 100000)}`
    };
    
    // Navigate to the booking confirmation page with flight details
    navigate('/flights/booking-confirmation', { 
      state: { bookingDetails: bookingReference } 
    });
  };

  const filteredFlights = getFilteredFlights();

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      
      {/* Enhanced Header Section with Background Image */}
      <div className="relative px-4 py-12 bg-gradient-to-r from-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=2070&auto=format&fit=crop" 
            alt="Clouds from airplane window" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/80"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center mb-3">
              <div className="h-0.5 w-10 bg-blue-400 mr-3"></div>
              <span className="text-blue-300 uppercase tracking-wider text-sm font-medium">Flight Search</span>
              <div className="h-0.5 w-10 bg-blue-400 ml-3"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-center">Find Your Perfect Flight</h1>
            <p className="text-blue-200 text-center max-w-2xl mb-6">Compare prices, schedules, and amenities from top airlines to book the best deal for your trip</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20 transform hover:scale-[1.01] transition-transform duration-300">
            <FlightSearchForm 
              initialData={searchParams}
              onSearch={handleSearch}
            />
          </div>
        </div>
      </div>
      
      {/* Enhanced Date Navigation Bar */}
      <div className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-20">
        <div className="container mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center justify-between">
            <button 
              className="p-2 rounded-full hover:bg-blue-50 transition-colors group"
              onClick={() => handleDateNavigate(-1)}
            >
              <ChevronLeft className="h-5 w-5 text-gray-700 group-hover:text-blue-600" />
            </button>
            
            <div className="flex-1 grid grid-cols-7 gap-1">
              {dateRange.map((item, index) => (
                <div 
                  key={index}
                  onClick={() => handleDateSelect(item.date)}
                  className={`cursor-pointer text-center px-2 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                    item.selected 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md' 
                      : 'hover:bg-blue-50'
                  }`}
                >
                  <p className={`text-xs font-bold ${item.selected ? 'text-blue-100' : 'text-blue-500'}`}>{item.day}</p>
                  <p className={`text-sm font-medium ${item.selected ? 'text-white' : 'text-gray-700'}`}>{item.date}</p>
                  <p className={`text-xs font-medium ${
                    item.lowestPrice 
                      ? 'text-green-400' 
                      : item.selected ? 'text-white' : 'text-gray-500'
                  }`}>
                    {item.price}
                  </p>
                </div>
              ))}
            </div>
            
            <button 
              className="p-2 rounded-full hover:bg-blue-50 transition-colors group"
              onClick={() => handleDateNavigate(1)}
            >
              <ChevronRight className="h-5 w-5 text-gray-700 group-hover:text-blue-600" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 min-h-screen pb-12 pt-8">
        <div className="container mx-auto max-w-6xl px-4">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-md p-8">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-500" />
              </div>
              <p className="mt-6 text-gray-600 font-medium">Searching for the best flights...</p>
              <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Enhanced Filter Sidebar */}
              <div className="w-full md:w-1/4">
                <div className="bg-white rounded-xl shadow-md border border-gray-200 sticky top-24 overflow-hidden">
                  {/* Filter Header */}
                  <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-4 text-white relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/10"></div>
                    <div className="absolute -right-1 top-8 h-8 w-8 rounded-full bg-white/10"></div>
                    <h3 className="text-lg font-bold flex items-center relative z-10">
                      <Filter className="h-5 w-5 mr-2" />
                      Filters
                    </h3>
                  </div>
                  
                  {/* Price Range */}
                  <div className="p-5 border-b border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-4">Price Range</h4>
                    <div className="px-2">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-blue-600">₹{filters.price[0]}</span>
                        <span className="text-sm font-medium text-blue-600">₹{filters.price[1]}</span>
                      </div>
                      
                      <input
                        type="range"
                        min="0"
                        max="50000"
                        step="1000"
                        value={filters.price[1]}
                        onChange={(e) => handleFilterChange('price', [filters.price[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>

                  {/* Stops */}
                  <div className="p-5 border-b border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-4">Stops</h4>
                    <div className="space-y-2">
                      <label className="flex items-center p-2 hover:bg-blue-50 rounded-md transition-colors cursor-pointer">
                        <input 
                          type="radio" 
                          name="stops"
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" 
                          checked={filters.stops === "any"}
                          onChange={() => handleFilterChange('stops', "any")}
                        />
                        <span className="ml-2 text-gray-700">Any number of stops</span>
                      </label>
                      
                      <label className="flex items-center p-2 hover:bg-blue-50 rounded-md transition-colors cursor-pointer">
                        <input 
                          type="radio" 
                          name="stops"
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" 
                          checked={filters.stops === "0"}
                          onChange={() => handleFilterChange('stops', "0")}
                        />
                        <span className="ml-2 text-gray-700">Non-stop only</span>
                      </label>
                      
                      <label className="flex items-center p-2 hover:bg-blue-50 rounded-md transition-colors cursor-pointer">
                        <input 
                          type="radio" 
                          name="stops"
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" 
                          checked={filters.stops === "1"}
                          onChange={() => handleFilterChange('stops', "1")}
                        />
                        <span className="ml-2 text-gray-700">1 stop max</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Airlines */}
                  <div className="p-5">
                    <h4 className="font-medium text-gray-800 mb-4">Airlines</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {getUniqueAirlines().map(airline => (
                        <label key={airline} className="flex items-center p-2 hover:bg-blue-50 rounded-md transition-colors cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                            checked={filters.airlines.includes(airline)}
                            onChange={() => toggleAirlineFilter(airline)}
                          />
                          <span className="ml-2 text-gray-700">{airline}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Reset Filters */}
                  <div className="p-5 border-t border-gray-200 bg-gray-50">
                    <button
                      onClick={() => {
                        setFilters({
                          price: [0, 20000],
                          stops: "any",
                          airlines: []
                        });
                      }}
                      className="w-full py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Results */}
              <div className="w-full md:w-3/4">
                {/* Sort Controls */}
                <div className="bg-white rounded-xl shadow-md p-5 mb-6 border border-gray-200">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="mb-4 md:mb-0">
                      <p className="text-gray-600">
                        <span className="font-bold text-blue-600 text-lg">{filteredFlights.length}</span> 
                        <span className="text-gray-700"> flights found</span>
                        {searchParams.from && searchParams.to && (
                          <span className="inline-flex items-center ml-2">
                            <span className="font-medium text-gray-800">{searchParams.from}</span>
                            <ArrowRight className="h-4 w-4 mx-1 text-gray-500" />
                            <span className="font-medium text-gray-800">{searchParams.to}</span>
                          </span>
                        )}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-700 font-medium">Sort by:</span>
                      <div className="relative">
                        <select
                          value={sortOrder}
                          onChange={(e) => setSortOrder(e.target.value)}
                          className="appearance-none pl-3 pr-10 py-2 bg-blue-50 border border-blue-200 rounded-lg text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="price">Price - Low to High</option>
                          <option value="-price">Price - High to Low</option>
                          <option value="duration">Duration - Shortest</option>
                          <option value="departure">Departure - Earliest</option>
                          <option value="arrival">Arrival - Earliest</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Flight Cards */}
                {filteredFlights.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-10 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-6">
                      <Plane className="h-10 w-10 text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">No flights found</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">We couldn't find any flights matching your criteria. Try adjusting your search filters or dates.</p>
                    <button 
                      onClick={() => {
                        setFilters({
                          price: [0, 20000],
                          stops: "any",
                          airlines: []
                        });
                      }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md inline-flex items-center"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredFlights.map((flight, index) => (
                      <div 
                        key={index} 
                        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                      >
                        {/* Top section with airline and price */}
                        <div className="p-5">
                          <div className="flex flex-col md:flex-row items-center justify-between">
                            {/* Airline and Flight Info */}
                            <div className="flex items-center mb-4 md:mb-0">
                              <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-lg mr-4 overflow-hidden shadow-sm">
                                <img 
                                  src={`https://www.gstatic.com/flights/airline_logos/70px/${flight.airline.code}_padded.png`} 
                                  alt={flight.airline.name}
                                  className="w-10 h-10 object-contain"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/40?text=✈️';
                                  }}
                                />
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900 text-lg">{flight.airline.name}</h3>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <span className="font-medium text-blue-600">{flight.flightNumber}</span>
                                  <span className="mx-2">•</span>
                                  <span>{flight.aircraft}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Price and Book Button */}
                            <div className="flex flex-col items-end">
                              <div className="text-right mb-3">
                                <div className="text-3xl font-bold text-blue-600 flex items-center">
                                  {flight.price}
                                  {Math.random() > 0.7 && (
                                    <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-green-100 text-green-700 rounded-full">DEAL</span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500">per passenger</div>
                              </div>
                              <button 
                                onClick={() => handleBookFlight(flight)}
                                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md font-medium"
                              >
                                Book Now
                              </button>
                            </div>
                          </div>
                          
                          {/* Flight Details */}
                          <div className="mt-8 flex items-center">
                            {/* Departure */}
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-800">{flight.departureTime}</div>
                              <div className="text-sm font-medium text-blue-600">{flight.departureAirport.code}</div>
                              <div className="text-xs text-gray-500 max-w-[140px] truncate">{flight.departureAirport.name}</div>
                            </div>
                            
                            {/* Flight Path */}
                            <div className="flex-1 mx-6">
                              <div className="text-xs text-center text-gray-600 mb-2 font-medium">{flight.duration}</div>
                              <div className="relative flex items-center">
                                <div className="h-1 flex-1 bg-gray-300 rounded"></div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                  <div className="bg-white p-1 rounded-full shadow-sm">
                                    <Plane className="text-blue-500 h-5 w-5 transform rotate-90" />
                                  </div>
                                </div>
                                
                                {/* Stops indicators */}
                                {flight.stops !== "0" && (
                                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mt-1">
                                    <div className="h-2 w-2 rounded-full bg-orange-500 "></div>
                                  </div>
                                )}
                              </div>
                              <div className="text-xs text-center mt-2">
                                {flight.stops === "0" ? (
                                  <span className="text-green-600 font-bold px-2 py-0.5 bg-green-50 rounded-full">Nonstop</span>
                                ) : (
                                  <span className="text-orange-600 font-bold px-2 py-0.5 bg-orange-50 rounded-full">
                                    {flight.stops} {parseInt(flight.stops) === 1 ? "stop" : "stops"}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Arrival */}
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-800">{flight.arrivalTime}</div>
                              <div className="text-sm font-medium text-blue-600">{flight.arrivalAirport.code}</div>
                              <div className="text-xs text-gray-500 max-w-[140px] truncate">{flight.arrivalAirport.name}</div>
                            </div>
                          </div>
                          
                          {/* Additional Details Toggle */}
                          <div className="mt-5 pt-4 border-t border-gray-200">
                            <button 
                              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 focus:outline-none font-medium"
                              onClick={() => setExpandedFlights(prev => ({
                                ...prev,
                                [index]: !prev[index]
                              }))}
                            >
                              <span>{expandedFlights[index] ? 'Hide details' : 'Show flight details'}</span>
                              <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-300 ${expandedFlights[index] ? 'transform rotate-180' : ''}`} />
                            </button>
                          </div>
                          
                          {/* Enhanced Expanded Details */}
                          {expandedFlights[index] && (
                            <div className="mt-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-5 border border-blue-100 overflow-hidden transition-all duration-300 ease-in-out animate-fadeIn">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                  <div className="text-xs text-blue-600 uppercase font-bold mb-1.5">Class</div>
                                  <div className="text-base font-medium text-gray-800">{flight.class}</div>
                                </div>
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                  <div className="text-xs text-blue-600 uppercase font-bold mb-1.5">Baggage Allowance</div>
                                  <div className="text-base font-medium text-gray-800">{flight.baggage}</div>
                                </div>
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                  <div className="text-xs text-blue-600 uppercase font-bold mb-1.5">In-flight Services</div>
                                  <div className="text-base font-medium text-gray-800">{flight.inFlightServices || "Standard service"}</div>
                                </div>
                              </div>
                              
                              {/* Additional amenities */}
                              <div className="mt-5 flex flex-wrap gap-2">
                                {Math.random() > 0.5 && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">In-flight Wi-Fi</span>
                                )}
                                {Math.random() > 0.5 && (
                                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Vegetarian Meal</span>
                                )}
                                {Math.random() > 0.5 && (
                                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Entertainment System</span>
                                )}
                                {Math.random() > 0.5 && (
                                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Power Outlet</span>
                                )}
                                {Math.random() > 0.5 && (
                                  <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-medium">Extra Legroom</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Enhanced Pagination */}
                {filteredFlights.length > 0 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="inline-flex items-center gap-1 bg-white rounded-lg shadow-md p-1.5">
                      <button className="p-2 rounded-md text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-50">
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      
                      <button className="w-9 h-9 rounded-md bg-blue-600 text-white font-medium flex items-center justify-center shadow-sm">
                        1
                      </button>
                      
                      <button className="w-9 h-9 rounded-md text-gray-700 hover:bg-blue-50 font-medium flex items-center justify-center">
                        2
                      </button>
                      
                      <button className="w-9 h-9 rounded-md text-gray-700 hover:bg-blue-50 font-medium flex items-center justify-center">
                        3
                      </button>
                      
                      <button className="p-2 rounded-md text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
