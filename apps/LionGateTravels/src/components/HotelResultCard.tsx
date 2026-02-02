/**
 * HOTEL RESULT CARD
 * 
 * Display component for hotel search results
 * Shows real Expedia data with affiliate handoff
 */

import React from 'react';
import { Hotel } from '../types';
import './ResultCards.css';

interface Props {
  hotel: Hotel;
}

export const HotelResultCard: React.FC<Props> = ({ hotel }) => {
  return (
    <div className="travels-result-card">
      {/* Image */}
      {hotel.images.length > 0 && (
        <div className="travels-result-image">
          <img src={hotel.images[0]} alt={hotel.name} />
          {hotel.provider === 'expedia' && (
            <div className="travels-result-badge">Expedia</div>
          )}
        </div>
      )}
      
      {/* Content */}
      <div className="travels-result-content">
        <h3 className="travels-result-title">{hotel.name}</h3>
        
        <div className="travels-result-location">
          📍 {hotel.location.city || hotel.location.address}
        </div>
        
        {hotel.rating && (
          <div className="travels-result-rating">
            ⭐ {hotel.rating.toFixed(1)}
            {hotel.reviewCount && (
              <span className="travels-result-reviews">
                ({hotel.reviewCount.toLocaleString()} reviews)
              </span>
            )}
          </div>
        )}
        
        {hotel.amenities.length > 0 && (
          <div className="travels-result-amenities">
            {hotel.amenities.slice(0, 4).map((amenity, i) => (
              <span key={i} className="travels-amenity-tag">{amenity}</span>
            ))}
            {hotel.amenities.length > 4 && (
              <span className="travels-amenity-tag">+{hotel.amenities.length - 4} more</span>
            )}
          </div>
        )}
        
        {hotel.description && (
          <p className="travels-result-description">
            {hotel.description.length > 150
              ? `${hotel.description.substring(0, 150)}...`
              : hotel.description
            }
          </p>
        )}
      </div>
      
      {/* Price & Action */}
      <div className="travels-result-action">
        <div className="travels-result-price">
          <span className="travels-price-amount">
            ${hotel.price.amount.toFixed(0)}
          </span>
          <span className="travels-price-unit">
            {hotel.price.perNight ? '/night' : ''}
          </span>
        </div>
        
        <a
          href={hotel.affiliateUrl}
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
