import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaShip, FaPhone, FaTimes, FaUser, FaEnvelope, FaCalendarAlt, FaCommentAlt, FaCheckCircle } from 'react-icons/fa';
import Navbar from '../Navbar';
import Footer from '../Footer';

const cruiseHighlights = [
  { title: "Cruise Dining", img: "/images/dining.jpg" },
  { title: "Cruise Party", img: "/images/party.jpg" },
  { title: "Cruise Entertainment", img: "/images/entertainment.jpg" }
];

const reviewers = [
  { id: 1, image: "/images/reviewer1.jpg", isActive: true },
  { id: 2, image: "/images/reviewer2.jpg", isActive: false },
  { id: 3, image: "/images/reviewer3.jpg", isActive: false },
  { id: 4, image: "/images/reviewer4.jpg", isActive: false },
  { id: 5, image: "/images/reviewer5.jpg", isActive: false }
];

const CombinedStyles = () => (
  <style jsx global>{`
    .itinerary-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 1rem;
      background-color: transparent;
    }

    .cruise-header {
      background: linear-gradient(to right, #ffffff, #f8faff);
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 8px 24px rgba(149, 157, 165, 0.1);
      margin-bottom: 1.5rem;
      position: relative;
      border: 1px solid rgba(230, 235, 245, 0.8);
    }

    .header-top {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .destination-text {
      font-size: 1.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, #1e4799 0%, #1e88e5 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.02em;
    }

    .arrow-icon {
      color: #1e88e5;
      font-size: 1.5rem;
      font-weight: bold;
      opacity: 0.8;
    }

    .duration {
      background: #e8f3ff;
      color: #1e88e5;
      font-size: 0.875rem;
      font-weight: 600;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      margin-left: 0.75rem;
    }

    .booking-info {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      color: #4a5568;
      font-size: 0.938rem;
    }

    .booking-info-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0;
      border-bottom: 1px dashed rgba(203, 213, 225, 0.5);
    }

    .booking-info-item:last-child {
      border-bottom: none;
    }

    .price-section {
      position: absolute;
      top: 2rem;
      right: 2rem;
      text-align: right;
    }

    .select-room-btn {
      background: linear-gradient(135deg, #1e4799 0%, #1e88e5 100%);
      color: white;
      padding: 0.875rem 2.5rem;
      border-radius: 50px;
      border: none;
      cursor: pointer;
      font-weight: 600;
      font-size: 1rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(30, 71, 153, 0.2);
    }

    .select-room-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(30, 71, 153, 0.3);
    }

    .itinerary-section {
      background: linear-gradient(to right, #ffffff, #f8faff);
      border-radius: 12px;
      padding: 2.5rem;
      box-shadow: 0 8px 24px rgba(149, 157, 165, 0.1);
      border: 1px solid rgba(230, 235, 245, 0.8);
    }

    .itinerary-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1a202c;
      margin-bottom: 0.5rem;
    }

    .itinerary-subtitle {
      color: #718096;
      font-size: 1rem;
      margin-bottom: 2rem;
    }

    .day-box {
      background: linear-gradient(135deg, #1e4799 0%, #1e88e5 100%);
      color: white;
      width: 64px;
      height: 64px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      font-size: 0.875rem;
      box-shadow: 0 4px 12px rgba(30, 71, 153, 0.2);
    }

    .day-box span:last-child {
      font-size: 1.5rem;
      font-weight: 700;
      margin-top: 0.125rem;
    }

    .day-content {
      flex: 1;
      padding-left: 0.5rem;
    }

    .day-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1a202c;
      margin-bottom: 0.375rem;
    }

    .day-subtitle {
      color: #1e88e5;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 0.75rem;
      letter-spacing: 0.05em;
      background: #e8f3ff;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      display: inline-block;
    }

    .day-description {
      color: #4a5568;
      font-size: 0.938rem;
      line-height: 1.6;
    }

    .view-more {
      color: #1e88e5;
      font-size: 0.938rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1.5rem;
      background: #e8f3ff;
      border: none;
      cursor: pointer;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      transition: all 0.3s ease;
    }

    .view-more:hover {
      background: #d1e9ff;
      transform: translateX(4px);
    }

    .view-more svg {
      width: 16px;
      height: 16px;
      margin-top: 2px;
    }

    @media (max-width: 768px) {
      .cruise-header {
        padding: 1.5rem;
      }

      .price-section {
        position: static;
        margin-top: 1.5rem;
        text-align: left;
      }

      .select-room-btn {
        width: 100%;
      }

      .header-top {
        flex-wrap: wrap;
      }

      .destination-text {
        font-size: 1.25rem;
      }

      .itinerary-section {
        padding: 1.5rem;
      }

      .day-box {
        width: 56px;
        height: 56px;
      }
    }

    .highlights-section {
      background: linear-gradient(to right, #ffffff, #f8faff);
      border-radius: 12px;
      padding: 3rem;
      box-shadow: 0 8px 24px rgba(149, 157, 165, 0.1);
      margin-top: 1.5rem;
      border: 1px solid rgba(230, 235, 245, 0.8);
    }

    .highlights-section h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1a202c;
      text-align: center;
      margin-bottom: 2rem;
    }

    .highlights-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    .highlight-card {
      border-radius: 12px;
      overflow: hidden;
      height: 200px;
      box-shadow: 0 8px 24px rgba(149, 157, 165, 0.1);
      position: relative;
    }

    .highlight-card::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 50%;
      background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
      pointer-events: none;
    }

    .highlight-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .highlight-card:hover img {
      transform: scale(1.05);
    }

    .reviews-section {
      background: #D1EFFF;
      border-radius: 12px;
      padding: 3.5rem 2.5rem;
      box-shadow: 0 8px 24px rgba(149, 157, 165, 0.1);
      margin-top: 1.5rem;
      text-align: center;
      border: 1px solid rgba(230, 235, 245, 0.8);
    }

    .reviews-section h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1a202c;
      margin-bottom: 2rem;
    }

    .review-quote {
      font-size: 4rem;
      background: linear-gradient(135deg, #1e4799 0%, #1e88e5 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1;
      margin-bottom: 1.5rem;
      opacity: 0.8;
    }

    .review-text {
      font-size: 1.125rem;
      color: #4a5568;
      line-height: 1.8;
      max-width: 800px;
      margin: 0 auto 2rem;
    }

    .reviewer-name {
      font-size: 1.125rem;
      font-weight: 700;
      color: #1a202c;
      margin-bottom: 0.25rem;
    }

    .reviewer-position {
      font-size: 0.875rem;
      color: #718096;
      margin-bottom: 2rem;
    }

    .reviewer-images {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 2rem;
    }

    .reviewer-image {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid transparent;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(149, 157, 165, 0.1);
    }

    .reviewer-image.active {
      border-color: #1e88e5;
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(30, 71, 153, 0.2);
    }

    .reviewer-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    @media (max-width: 768px) {
      .highlights-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .highlight-card {
        height: 180px;
      }

      .reviews-section {
        padding: 2rem 1rem;
      }

      .review-text {
        font-size: 1rem;
        padding: 0 1rem;
      }
    }
  `}</style>
);

const Itinerary = () => {
  const [searchParams] = useSearchParams();
  const cruiseId = searchParams.get('cruise');
  const cruiseLine = searchParams.get('cruiseLine');
  const [showCallbackPopup, setShowCallbackPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeField, setActiveField] = useState(null);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log("Form submitted:", formData);
    setFormSubmitted(true);
    
    // Reset form after 3 seconds and close popup
    setTimeout(() => {
      setFormSubmitted(false);
      setShowCallbackPopup(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        preferredDate: '',
        message: ''
      });
    }, 3000);
  };
  
  const handleFocus = (field) => {
    setActiveField(field);
  };
  
  const handleBlur = () => {
    setActiveField(null);
  };
  
  return (
    <>
      <Navbar />
      
      {/* Hero Header Image */}
      <div className="relative w-full">
        <img 
          src="/images/Rectangle 1434 (1).png" 
          alt="Cruise Itinerary" 
          className="w-full h-[400px] object-cover object-center brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60 flex flex-col items-center justify-center px-4">
          <h1 className="text-4xl md:text-6xl text-white font-bold text-center mb-4 drop-shadow-lg">
            {cruiseLine || 'Royal Caribbean'} Itinerary
          </h1>
          <p className="text-xl md:text-2xl text-white text-center max-w-3xl mx-auto font-light drop-shadow-md">
            Explore your upcoming cruise adventure day by day
          </p>
        </div>
      </div>

      <div className="itinerary-container">
        <CombinedStyles />
        
        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <Link 
            to="/cruises" 
            className="bg-[#0066b2] hover:bg-[#005091] text-white font-medium py-2 px-4 rounded-md transition-colors"
            style={{ 
              backgroundColor: '#0066b2',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: '500',
              display: 'inline-block'
            }}
          >
            Back to Cruises
          </Link>
        </div>
        
        {/* Cruise Header */}
        <div className="cruise-header">
          <div className="header-top">
            <span className="destination-text">Miami</span>
            <span className="arrow-icon">≫</span>
            <span className="destination-text">Florida</span>
            <span className="duration">2N/3D</span>
          </div>

          <div className="booking-info">
            <div className="booking-info-item">
              <FaShip size={16} color="#1e88e5" />
              <span>Embarkation:</span>
              <span style={{ fontWeight: 600 }}>Jan 13th, 4:30 PM</span>
            </div>
            <div className="booking-info-item">
              <FaShip size={16} color="#1e88e5" />
              <span>Disembarkation:</span>
              <span style={{ fontWeight: 600 }}>Jan 17th, 7:30 PM</span>
            </div>
            <div className="booking-info-item">
              <span>Cruise Line:</span>
              <span style={{ fontWeight: 600 }}>{cruiseLine || 'Royal Caribbean'}</span>
            </div>
            <div className="booking-info-item">
              <span>Visiting Ports:</span>
              <span style={{ fontWeight: 600 }}>Miami | Florida</span>
            </div>
          </div>

          <div className="price-section">
            <div style={{ color: '#4a5568', fontSize: '0.938rem', marginBottom: '0.25rem' }}>Starting from</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1a202c', marginBottom: '0.25rem' }}>$200</div>
            <div style={{ fontSize: '0.813rem', color: '#718096', marginBottom: '1rem' }}>
              Excl. Tax Per Person in Double Occupancy
            </div>
            <button 
              className="select-room-btn"
              onClick={() => setShowCallbackPopup(true)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <FaPhone size={16} /> Request Call Back
            </button>
          </div>
        </div>

        {/* Itinerary Section */}
        <div className="itinerary-section">
          <h2 className="itinerary-title">Itinerary</h2>
          <p className="itinerary-subtitle">Day wise details of your package</p>

          {/* Day 1 */}
          <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '2rem' }}>
            <div className="day-box">
              <span>Day</span>
              <span>1</span>
            </div>
            <div className="day-content">
              <h3 className="day-title">Miami Port</h3>
              <p className="day-subtitle">WELCOME ONBOARD</p>
              <p className="day-description">
                Just as you step aboard the Empress — the top cruise in India — also known as 'A City on the Sea,' you'll be greeted with a warm welcome. Once settled, dive right in and explore the many offerings lined up for you aboard our cruise ship.
              </p>
            </div>
          </div>

          {/* Day 2 */}
          <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '2rem' }}>
            <div className="day-box">
              <span>Day</span>
              <span>2</span>
            </div>
            <div className="day-content">
              <h3 className="day-title">At Sea</h3>
              <p className="day-subtitle">DAY AT SEA</p>
              <p className="day-description">
                Just as you step aboard the Empress — the top cruise in India — also known as 'A City on the Sea,' you'll be greeted with a warm welcome. Once settled, dive right in and explore the many offerings lined up for you aboard our cruise ship.
              </p>
            </div>
          </div>

          {/* Day 3 */}
          <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div className="day-box">
              <span>Day</span>
              <span>3</span>
            </div>
            <div className="day-content">
              <h3 className="day-title">Florida Port</h3>
              <p className="day-subtitle">ARRIVED IN Florida</p>
            </div>
          </div>

          <button className="view-more">
            View Full Itinerary
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Cruise Highlights */}
        <div className="highlights-section">
          <h2 className="text-2xl font-bold text-center">Your Cruise Highlight</h2>
          <div className="highlights-grid">
            {cruiseHighlights.map((highlight, index) => (
              <div key={index} className="highlight-card">
                <img src={highlight.img} alt={highlight.title} />
              </div>
            ))}
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="reviews-section">
          <h2>Customer Reviews</h2>
          <div className="review-quote">"</div>
          <p className="review-text">
            The tours in this website are great. I had been really enjoy with my family! The team is very professional and taking care of the customers. Will surely recommend to my freind to join this company!
          </p>
          <div className="reviewer-name">Ali Tufan</div>
          <div className="reviewer-position">Product Manager, Apple Inc.</div>
          
          <div className="reviewer-images">
            {reviewers.map((reviewer) => (
              <div 
                key={reviewer.id} 
                className={`reviewer-image ${reviewer.isActive ? 'active' : ''}`}
              >
                <img src={reviewer.image} alt={`Reviewer ${reviewer.id}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Callback Request Popup */}
      {showCallbackPopup && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowCallbackPopup(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-0 relative overflow-hidden animate-fadeIn"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            style={{
              animation: 'fadeIn 0.3s ease-out',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div className="bg-gradient-to-r from-[#0066b2] to-[#1e88e5] pt-8 pb-12 px-6 text-white relative">
              <button 
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                onClick={() => setShowCallbackPopup(false)}
                aria-label="Close popup"
              >
                <FaTimes size={20} />
              </button>
              
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-4">
                  <FaPhone className="text-[#0066b2]" size={18} />
                </div>
                <h2 className="text-2xl font-bold">Request a Call Back</h2>
              </div>
              
              <p className="opacity-90 text-sm">
                Our cruise expert will contact you to discuss {cruiseLine || 'Royal Caribbean'} options
              </p>
              
              <div className="absolute -bottom-6 left-0 right-0 h-12 bg-white rounded-t-[50%]"></div>
            </div>
            
            <div className="px-6 pb-6 pt-4">
              {formSubmitted ? (
                <div className="text-center py-10 px-4 animate-fadeIn" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaCheckCircle className="text-green-500" size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">Thank You!</h2>
                  <p className="text-gray-600 mb-6">
                    Your call back request has been received. Our travel expert will contact you shortly.
                  </p>
                  <div className="w-16 h-1 bg-green-500 mx-auto"></div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 pt-3">
                  <div className={`transition-all duration-200 ${activeField === 'name' ? 'transform -translate-y-1' : ''}`}>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
                      Full Name*
                    </label>
                    <div className={`relative rounded-lg transition-all duration-300 ${activeField === 'name' ? 'ring-2 ring-[#0066b2]' : 'ring-1 ring-gray-200'}`}>
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaUser className={`transition-colors ${activeField === 'name' ? 'text-[#0066b2]' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('name')}
                        onBlur={handleBlur}
                        required
                        className="w-full bg-gray-50 pl-12 pr-4 py-3 border-none rounded-lg focus:outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  
                  <div className={`transition-all duration-200 ${activeField === 'email' ? 'transform -translate-y-1' : ''}`}>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                      Email Address*
                    </label>
                    <div className={`relative rounded-lg transition-all duration-300 ${activeField === 'email' ? 'ring-2 ring-[#0066b2]' : 'ring-1 ring-gray-200'}`}>
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaEnvelope className={`transition-colors ${activeField === 'email' ? 'text-[#0066b2]' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('email')}
                        onBlur={handleBlur}
                        required
                        className="w-full bg-gray-50 pl-12 pr-4 py-3 border-none rounded-lg focus:outline-none"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className={`transition-all duration-200 ${activeField === 'phone' ? 'transform -translate-y-1' : ''}`}>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="phone">
                      Phone Number*
                    </label>
                    <div className={`relative rounded-lg transition-all duration-300 ${activeField === 'phone' ? 'ring-2 ring-[#0066b2]' : 'ring-1 ring-gray-200'}`}>
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaPhone className={`transition-colors ${activeField === 'phone' ? 'text-[#0066b2]' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('phone')}
                        onBlur={handleBlur}
                        required
                        className="w-full bg-gray-50 pl-12 pr-4 py-3 border-none rounded-lg focus:outline-none"
                        placeholder="+1 (123) 456-7890"
                      />
                    </div>
                  </div>
                  
                  <div className={`transition-all duration-200 ${activeField === 'preferredDate' ? 'transform -translate-y-1' : ''}`}>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="preferredDate">
                      Preferred Call Time
                    </label>
                    <div className={`relative rounded-lg transition-all duration-300 ${activeField === 'preferredDate' ? 'ring-2 ring-[#0066b2]' : 'ring-1 ring-gray-200'}`}>
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaCalendarAlt className={`transition-colors ${activeField === 'preferredDate' ? 'text-[#0066b2]' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type="text"
                        id="preferredDate"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('preferredDate')}
                        onBlur={handleBlur}
                        className="w-full bg-gray-50 pl-12 pr-4 py-3 border-none rounded-lg focus:outline-none"
                        placeholder="E.g. Weekdays after 2 PM"
                      />
                    </div>
                  </div>
                  
                  <div className={`transition-all duration-200 ${activeField === 'message' ? 'transform -translate-y-1' : ''}`}>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="message">
                      Additional Information
                    </label>
                    <div className={`relative rounded-lg transition-all duration-300 ${activeField === 'message' ? 'ring-2 ring-[#0066b2]' : 'ring-1 ring-gray-200'}`}>
                      <div className="absolute top-3 left-0 pl-4 flex items-start pointer-events-none">
                        <FaCommentAlt className={`transition-colors ${activeField === 'message' ? 'text-[#0066b2]' : 'text-gray-400'}`} />
                      </div>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('message')}
                        onBlur={handleBlur}
                        rows="3"
                        className="w-full bg-gray-50 pl-12 pr-4 py-3 border-none rounded-lg focus:outline-none resize-none"
                        placeholder="Any specific questions or requirements?"
                      ></textarea>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#0066b2] to-[#1e88e5] text-white font-bold py-4 px-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mt-6"
                  >
                    <FaPhone size={16} /> Request Call Back
                  </button>
                  
                  <p className="text-xs text-center text-gray-500 mt-4">
                    By submitting this form, you agree to our <a href="#" className="text-[#0066b2]">Terms & Conditions</a> and <a href="#" className="text-[#0066b2]">Privacy Policy</a>
                  </p>
                </form>
              )}
            </div>
          </div>
          
          <style jsx global>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fadeIn {
              animation: fadeIn 0.3s ease-out forwards;
            }
          `}</style>
        </div>
      )}
      
      <Footer />
    </>
  );
};

export default Itinerary; 