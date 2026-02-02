/**
 * SEARCH COMPONENT
 * 
 * Main search interface for LionGateOS Travels
 * Integrated with real Expedia Rapid APIs
 */

import React from 'react';
import { UnifiedSearchService } from '../services/search.services';
import { Hotel, CarRental, Activity } from '../types';
import { HotelResultCard } from './HotelResultCard';
import { CarResultCard } from './CarResultCard';
import { ActivityResultCard } from './ActivityResultCard';
import logo from '../assets/logo.png';
import './Search.css';

interface SearchFormData {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
}

export const Search: React.FC = () => {
  const [formData, setFormData] = React.useState<SearchFormData>({
    destination: '',
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
  });
  
  const [isSearching, setIsSearching] = React.useState(false);
  const [results, setResults] = React.useState<{
    hotels: Hotel[];
    cars: CarRental[];
    activities: Activity[];
  } | null>(null);
  
  const [activeTab, setActiveTab] = React.useState<'hotels' | 'cars' | 'activities'>('hotels');
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.destination || !formData.checkIn || !formData.checkOut) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsSearching(true);
    setResults(null);
    
    try {
      const searchResults = await UnifiedSearchService.searchAll({
        location: { destination: formData.destination },
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: {
          adults: formData.adults,
          children: formData.children || undefined,
        },
        currency: 'USD',
      });
      
      setResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleInputChange = (field: keyof SearchFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Get tomorrow's date as default check-in
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultCheckIn = tomorrow.toISOString().split('T')[0];
  
  // Get day after tomorrow as default check-out
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);
  const defaultCheckOut = dayAfter.toISOString().split('T')[0];
  
  return (
    <div className="travels-search">
      {/* Header with Logo */}
      <div className="travels-search-header">
        <img src={logo} alt="LionGateOS Travels" className="travels-logo" />
        <p className="travels-tagline">Plan your journey worldwide with real-time availability</p>
      </div>
      
      {/* Search Form */}
      <form className="travels-search-form" onSubmit={handleSearch}>
        <div className="travels-form-row">
          <div className="travels-form-field travels-form-field--large">
            <label htmlFor="destination">Where to?</label>
            <input
              id="destination"
              type="text"
              placeholder="City, hotel, or landmark"
              value={formData.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              className="travels-input"
              required
            />
          </div>
        </div>
        
        <div className="travels-form-row">
          <div className="travels-form-field">
            <label htmlFor="checkIn">Check-in</label>
            <input
              id="checkIn"
              type="date"
              value={formData.checkIn || defaultCheckIn}
              onChange={(e) => handleInputChange('checkIn', e.target.value)}
              min={defaultCheckIn}
              className="travels-input"
              required
            />
          </div>
          
          <div className="travels-form-field">
            <label htmlFor="checkOut">Check-out</label>
            <input
              id="checkOut"
              type="date"
              value={formData.checkOut || defaultCheckOut}
              onChange={(e) => handleInputChange('checkOut', e.target.value)}
              min={formData.checkIn || defaultCheckIn}
              className="travels-input"
              required
            />
          </div>
          
          <div className="travels-form-field travels-form-field--small">
            <label htmlFor="adults">Adults</label>
            <input
              id="adults"
              type="number"
              min="1"
              max="10"
              value={formData.adults}
              onChange={(e) => handleInputChange('adults', parseInt(e.target.value))}
              className="travels-input"
              required
            />
          </div>
          
          <div className="travels-form-field travels-form-field--small">
            <label htmlFor="children">Children</label>
            <input
              id="children"
              type="number"
              min="0"
              max="10"
              value={formData.children}
              onChange={(e) => handleInputChange('children', parseInt(e.target.value))}
              className="travels-input"
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="travels-search-btn"
          disabled={isSearching}
        >
          {isSearching ? 'Searching worldwide...' : 'Search'}
        </button>
      </form>
      
      {/* Loading State */}
      {isSearching && (
        <div className="travels-loading">
          <div className="travels-loading-spinner"></div>
          <p>Searching Expedia Rapid API...</p>
        </div>
      )}
      
      {/* Results */}
      {results && !isSearching && (
        <div className="travels-results">
          {/* Tabs */}
          <div className="travels-results-tabs">
            <button
              className={`travels-tab ${activeTab === 'hotels' ? 'travels-tab--active' : ''}`}
              onClick={() => setActiveTab('hotels')}
            >
              Hotels ({results.hotels.length})
            </button>
            <button
              className={`travels-tab ${activeTab === 'cars' ? 'travels-tab--active' : ''}`}
              onClick={() => setActiveTab('cars')}
            >
              Cars ({results.cars.length})
            </button>
            <button
              className={`travels-tab ${activeTab === 'activities' ? 'travels-tab--active' : ''}`}
              onClick={() => setActiveTab('activities')}
            >
              Activities ({results.activities.length})
            </button>
          </div>
          
          {/* Results Content */}
          <div className="travels-results-content">
            {activeTab === 'hotels' && (
              <div className="travels-results-list">
                {results.hotels.length === 0 ? (
                  <p className="travels-no-results">No hotels found. Try a different search.</p>
                ) : (
                  results.hotels.map(hotel => (
                    <HotelResultCard key={hotel.id} hotel={hotel} />
                  ))
                )}
              </div>
            )}
            
            {activeTab === 'cars' && (
              <div className="travels-results-list">
                {results.cars.length === 0 ? (
                  <p className="travels-no-results">No car rentals found. Try a different search.</p>
                ) : (
                  results.cars.map(car => (
                    <CarResultCard key={car.id} car={car} />
                  ))
                )}
              </div>
            )}
            
            {activeTab === 'activities' && (
              <div className="travels-results-list">
                {results.activities.length === 0 ? (
                  <p className="travels-no-results">No activities found. Try a different search.</p>
                ) : (
                  results.activities.map(activity => (
                    <ActivityResultCard key={activity.id} activity={activity} />
                  ))
                )}
              </div>
            )}
          </div>
          
          {/* Disclosure */}
          <div className="travels-disclosure">
            <p>
              <strong>Transparency Notice:</strong> Prices and availability are provided by Expedia. 
              LionGateOS Travels displays information only. Booking happens on Expedia. 
              We may earn an affiliate commission.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
