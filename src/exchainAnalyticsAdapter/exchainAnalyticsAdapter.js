/*
 * Copyright 2025 EXCHAIN PTE. LTD.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * ExChain Analytics Adapter - Production Version
 * 
 * ✅ This is the PRODUCTION-READY version for commercial publishers
 * ✅ Clean, minimal code with standard Prebid.js event handling
 * ✅ No testing environment hooks or excessive logging
 * ✅ Self-contained - no external dependencies required
 * 
 * This module generates a single IOID per auction cycle and places it in:
 * - ortb2.site.ext.data.ioids (array with single element)
 * - ortb2.site.keywords (appended as "ioid={uuid}")
 * 
 * Key Features:
 * - Single IOID per auction (not per impression)
 * - Global ORTB2 placement only (no impression-level injection)
 * - Standard Prebid event timing (beforeRequestBids)
 * - No state persistence between auctions
 * - Minimal complexity for maximum reliability
 * 
 * @maintainer admin@exchain.co
 * @version 3.3 - Self-contained production ready
 */

export const MODULE_NAME = 'ExchainAnalyticsAdapter';

/**
 * Get reference to the global Prebid.js instance
 * @returns {Object|undefined} Global pbjs object or undefined if not available
 */
function getGlobal() {
  return window.pbjs || window.top.pbjs;
}

/**
 * Generates a secure UUIDv4
 * @returns {string | undefined} UUID string or undefined if crypto not available
 */
function generateUUID() {
  // Use crypto for secure random numbers
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);

    // Set the version to 4 (UUIDv4)
    arr[6] = (arr[6] & 0x0f) | 0x40;
    // Set the variant to RFC 4122
    arr[8] = (arr[8] & 0x3f) | 0x80;

    // Convert array to hexadecimal string format
    return [...arr].map((b, i) => {
      const hex = b.toString(16).padStart(2, '0');
      if (i === 4 || i === 6 || i === 8 || i === 10) return '-' + hex;
      return hex;
    }).join('');
  }
  
  return undefined;
}

/**
 * ExChain Analytics Module - Production Version
 * Generates one IOID per auction and places it in global ORTB2 locations
 */
export const exchainPrebidModule = {
  /**
   * Module name for registration
   * @type {string}
   */
  name: MODULE_NAME,

  /**
   * Initialize the analytics adapter
   * Registers event handler for beforeRequestBids
   */
  init: function() {
    const pbjs = getGlobal();
    if (!pbjs) {
      console.warn('ExChain Analytics: Prebid.js not available');
      return;
    }
    
    try {
      // Register for beforeRequestBids event
      pbjs.onEvent('beforeRequestBids', this.onBeforeRequestBids.bind(this));
    } catch (error) {
      console.error('ExChain Analytics: Error setting up event handlers:', error);
    }
  },

  /**
   * Handle beforeRequestBids event
   * Generates single IOID and injects into global ORTB2
   * 
   * @param {Object} bidRequestConfig - Prebid bid request configuration
   */
  onBeforeRequestBids: function(bidRequestConfig) {
    this.generateAndInjectIOID();
  },

  /**
   * Generate UUID and inject into ORTB2 - main logic
   */
  generateAndInjectIOID: function() {
    // Generate single UUID for this entire auction
    const ioid = generateUUID();
    if (!ioid) {
      console.warn('ExChain Analytics: UUID generation failed, skipping IOID injection');
      return;
    }

    // Inject IOID into global ORTB2 locations
    this.injectGlobalIOID(ioid);
  },

  /**
   * Inject IOID into global ORTB2 locations
   * Places IOID in exactly two locations:
   * 1. ortb2.site.ext.data.ioids (array with single element)
   * 2. ortb2.site.keywords (appended string)
   * 
   * @param {string} ioid - The UUID to inject
   */
  injectGlobalIOID: function(ioid) {
    const pbjs = getGlobal();
    if (!pbjs || !ioid) return;

    try {
      // Get current ORTB2 configuration
      const ortb2 = pbjs.getConfig('ortb2') || {};
      
      // Ensure site structure exists
      ortb2.site = ortb2.site || {};
      ortb2.site.ext = ortb2.site.ext || {};
      ortb2.site.ext.data = ortb2.site.ext.data || {};

      // 1. Inject into ortb2.site.ext.data.ioids as single-element array
      ortb2.site.ext.data.ioids = [ioid];

      // 2. Inject into ortb2.site.keywords
      const ioidKeyword = `ioid=${ioid}`;
      
      if (ortb2.site.keywords) {
        // Preserve existing keywords, remove old IOIDs, add new IOID
        const existingKeywords = ortb2.site.keywords
          .split(',')
          .map(k => k.trim())
          .filter(k => k && !k.startsWith('ioid='))
          .join(',');
        
        ortb2.site.keywords = existingKeywords ? `${existingKeywords},${ioidKeyword}` : ioidKeyword;
      } else {
        ortb2.site.keywords = ioidKeyword;
      }

      // Apply the configuration update
      pbjs.setConfig({ ortb2 });

    } catch (error) {
      console.error('ExChain Analytics: Error injecting IOID into global ORTB2:', error);
    }
  }
};

// Export for analytics adapter interface
export default exchainPrebidModule;
