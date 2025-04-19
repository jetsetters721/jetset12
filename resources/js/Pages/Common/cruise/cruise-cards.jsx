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
  const [filteredCruises, setFilteredCruises] = useState([]);

  useEffect(() => {
    // Filter cruises based on search parameters
    let filtered = cruiseLineData.cruiseLines;

    if (cruiseLineParam) {
      filtered = filtered.filter(cruise => 
        cruise.name.toLowerCase().includes(cruiseLineParam.toLowerCase())
      );
      setTitle(`${cruiseLineParam} Cruises`);
    }

    if (destinationParam) {
      filtered = filtered.filter(cruise => 
        cruise.destinations.some(dest => 
          dest.toLowerCase().includes(destinationParam.toLowerCase())
        )
      );
      setTitle(`${destinationParam} Cruises`);
    }

    if (countryParam) {
      filtered = filtered.filter(cruise => 
        cruise.departurePorts.some(port => 
          port.toLowerCase().includes(countryParam.toLowerCase())
        )
      );
      setTitle(`Cruises from ${countryParam}`);
    }

    setFilteredCruises(filtered);
  }, [cruiseLineParam, destinationParam, countryParam]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      
      <div className="pt-[80px]"> {/* Add padding-top to account for fixed Navbar */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/cruises" className="flex items-center text-blue-600 hover:text-blue-800">
              <FaArrowLeft className="mr-2" />
              Back to Search
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            <div className="w-[100px]"></div> {/* Spacer for alignment */}
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {filteredCruises.length === 0 ? (
            <div className="text-center py-12">
              <FaSearch className="text-gray-400 text-5xl mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">No cruises found</h2>
              <p className="text-gray-500">Try adjusting your search criteria</p>
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
                      src={cruise.image}
                      alt={cruise.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-[#0066b2]/90 text-white py-1 px-3 rounded-full text-sm font-medium">
                      {cruise.name}
                    </div>
                  </div>

                  <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col justify-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                      {cruise.duration} {cruise.description}
                    </h2>
                    <div className="flex items-center text-gray-500 mb-6">
                      <FaShip className="mr-2" />
                      <span className="text-lg">{cruise.name}</span>
                    </div>

                    <div className="space-y-6 md:space-y-6 mb-8">
                      <div className="flex items-start">
                        <div className="w-8 h-8 mr-4 mt-1 text-[#0066b2] bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                          <FaMapMarkerAlt />
                        </div>
                        <div>
                          <span className="block text-gray-800 font-semibold mb-1">Destinations</span>
                          <span className="text-gray-600">{cruise.destinations.join(', ')}</span>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-8 h-8 mr-4 mt-1 text-[#0066b2] bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                          <FaCalendar />
                        </div>
                        <div>
                          <span className="block text-gray-800 font-semibold mb-1">Departure Ports</span>
                          <span className="text-gray-600">{cruise.departurePorts.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="text-2xl font-bold text-blue-600">
                        {cruise.price}
                      </div>
                      <Link
                        to={`/itinerary?cruiseId=${cruise.id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CruiseCards; 