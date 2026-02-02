/**
 * CAR & ACTIVITY RESULT CARDS
 */

import React from 'react';
import { CarRental, Activity } from '../types';
import './ResultCards.css';

export { ActivityResultCard };

// ============================================================================
// CAR RESULT CARD
// ============================================================================

interface CarProps {
  car: CarRental;
}

export const CarResultCard: React.FC<CarProps> = ({ car }) => {
  return (
    <div className="travels-result-card">
      <div className="travels-result-content">
        <h3 className="travels-result-title">
          {car.vehicle.make} {car.vehicle.model || car.category}
        </h3>
        
        <div className="travels-result-subtitle">{car.vendor}</div>
        
        <div className="travels-car-specs">
          <span>🚗 {car.vehicle.type}</span>
          <span>👥 {car.vehicle.passengers} passengers</span>
          <span>🧳 {car.vehicle.luggage} bags</span>
          <span>⚙️ {car.vehicle.transmission}</span>
        </div>
        
        {car.features.length > 0 && (
          <div className="travels-result-amenities">
            {car.features.map((feature, i) => (
              <span key={i} className="travels-amenity-tag">{feature}</span>
            ))}
          </div>
        )}
        
        <div className="travels-car-location">
          📍 Pickup/Dropoff: {car.location.pickup}
        </div>
        
        <div className="travels-car-mileage">
          🛣️ {car.mileage}
        </div>
      </div>
      
      <div className="travels-result-action">
        <div className="travels-result-price">
          <span className="travels-price-amount">
            ${car.price.amount.toFixed(0)}
          </span>
          <span className="travels-price-unit">total</span>
        </div>
        
        <a
          href={car.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="travels-book-btn"
        >
          View on Expedia
        </a>
      </div>
    </div>
  );
};

// ============================================================================
// ACTIVITY RESULT CARD
// ============================================================================

interface ActivityProps {
  activity: Activity;
}

export const ActivityResultCard: React.FC<ActivityProps> = ({ activity }) => {
  const hours = Math.floor(activity.duration / 60);
  const minutes = activity.duration % 60;
  const durationText = hours > 0
    ? `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`
    : `${minutes}m`;
  
  return (
    <div className="travels-result-card">
      {activity.images.length > 0 && (
        <div className="travels-result-image">
          <img src={activity.images[0]} alt={activity.name} />
          <div className="travels-result-badge">{activity.category}</div>
        </div>
      )}
      
      <div className="travels-result-content">
        <h3 className="travels-result-title">{activity.name}</h3>
        
        <div className="travels-result-location">
          📍 {activity.location.name}
        </div>
        
        {activity.rating && (
          <div className="travels-result-rating">
            ⭐ {activity.rating.toFixed(1)}
            {activity.reviewCount && (
              <span className="travels-result-reviews">
                ({activity.reviewCount.toLocaleString()} reviews)
              </span>
            )}
          </div>
        )}
        
        <div className="travels-activity-duration">
          ⏱️ Duration: {durationText}
        </div>
        
        {activity.highlights.length > 0 && (
          <div className="travels-activity-highlights">
            {activity.highlights.slice(0, 3).map((highlight, i) => (
              <div key={i} className="travels-highlight">✓ {highlight}</div>
            ))}
          </div>
        )}
        
        <div className="travels-activity-policy">
          {activity.cancellationPolicy}
        </div>
      </div>
      
      <div className="travels-result-action">
        <div className="travels-result-price">
          <span className="travels-price-amount">
            ${activity.price.amount.toFixed(0)}
          </span>
          <span className="travels-price-unit">per person</span>
        </div>
        
        <a
          href={activity.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="travels-book-btn"
        >
          View on Expedia
        </a>
      </div>
    </div>
  );
};
