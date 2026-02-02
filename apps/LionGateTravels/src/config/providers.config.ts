/**
 * PROVIDER CONFIGURATION
 * 
 * Configure API providers for LionGateOS Travels
 * Keys should be provided by environment or LionGateOS Core
 */

import { configureExpedia } from './providers/expedia/expedia.api';

/**
 * Initialize providers with API keys
 * Call this on app startup
 */
export function initializeProviders() {
  // Expedia Rapid API Configuration
  // Keys should come from environment variables or LionGateOS Core
  const expediaConfig = {
    apiKey: process.env.REACT_APP_EXPEDIA_API_KEY || '',
    apiSecret: process.env.REACT_APP_EXPEDIA_API_SECRET || '',
    affiliateId: process.env.REACT_APP_EXPEDIA_AFFILIATE_ID || 'liongateos',
  };
  
  // Configure Expedia if keys are available
  if (expediaConfig.apiKey) {
    configureExpedia(expediaConfig);
    console.log('✓ Expedia Rapid API configured');
  } else {
    console.warn('⚠ Expedia API keys not found - using mock data');
    console.warn('  Set REACT_APP_EXPEDIA_API_KEY in .env file');
  }
}

/**
 * Check if real providers are configured
 */
export function hasRealProviders(): boolean {
  return !!process.env.REACT_APP_EXPEDIA_API_KEY;
}
