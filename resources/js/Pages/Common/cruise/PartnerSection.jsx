import React from 'react';
import './PartnerSection.css';

const PartnerSection = () => {
  const partners = [
    { name: "Diners Club", logo: "https://www.dinersclub.com/content/dam/diners-club/about-us/diners-club-logo-stacked.svg" },
    { name: "Discover", logo: "https://www.discover.com/company/images/newsroom/media-downloads/discover.png" },
    { name: "American Express", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png" },
    { name: "Mastercard", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" },
    { name: "ARC", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Airlines_Reporting_Corporation_%28ARC%29_logo.svg/1200px-Airlines_Reporting_Corporation_%28ARC%29_logo.svg.png" },
    { name: "UATP", logo: "https://uatp.com/wp-content/uploads/2021/05/UATP-LOGO_BLUE.png" },
    { name: "Visa", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1200px-Visa_Inc._logo.svg.png" }
  ];

  return (
    <section className="partner-section">
      <div className="container">
        <h2 className="section-title">Valued Partners</h2>
        <div className="partner-logos">
          {partners.map((partner, index) => (
            <div key={index} className="partner-logo-container">
              <img 
                src={partner.logo}
                alt={partner.name}
                className="partner-logo"
                style={{ height: '60px', objectFit: 'contain', margin: '0 10px' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;