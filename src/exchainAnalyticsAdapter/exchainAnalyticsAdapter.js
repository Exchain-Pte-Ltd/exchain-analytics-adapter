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

import { logInfo, logWarn, logError } from '../src/utils.js';
import { getGlobal } from '../src/prebidGlobal.js';

/**
 * ExChain Analytics Module v3.2.10
 * 
 * Generates unique IOIDs for each auction cycle using Prebid's pre-generation pattern.
 * Implements auction-specific tracking to ensure uniqueness across multiple auctions.
 * 
 * Usage: Include in Prebid build with --modules=exchainAnalyticsAdapter
 * 
 * @maintainer admin@exchain.co
 * @version 3.2.10
 */

const MODULE_VERSION = '3.2.10';
const MODULE_NAME = 'exchainAnalyticsAdapter';

let moduleInitialized = false;
let prebidReady = false;
let currentAuctionId = null;

/**
 * Generates a secure UUIDv4
 * @returns {string | undefined} UUID string or undefined if crypto not available
 */
function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    arr[6] = (arr[6] & 0x0f) | 0x40;
    arr[8] = (arr[8] & 0x3f) | 0x80;
    return [...arr].map((b, i) => {
      const hex = b.toString(16).padStart(2, '0');
      if (i === 4 || i === 6 || i === 8 || i === 10) return '-' + hex;
      return hex;
    }).join('');
  }
  return undefined;
}

/**
 * Check if IOID already exists for the current auction cycle
 * @param {string} auctionId - Current auction ID to check against
 * @returns {boolean} True if IOID already generated for this auction
 */
function hasIOIDForCurrentAuction(auctionId) {
  if (!auctionId) return false;
  if (currentAuctionId !== auctionId) return false;
  
  const pbjs = getGlobal();
  if (!pbjs) return false;
  
  try {
    const ortb2 = pbjs.getConfig('ortb2') || {};
    const hasIOIDArray = ortb2.site?.ext?.data?.ioids?.length > 0;
    const hasIOIDKeyword = ortb2.site?.keywords?.includes('ioid=');
    
    return (hasIOIDArray || hasIOIDKeyword) && currentAuctionId === auctionId;
  } catch (error) {
    return false;
  }
}

/**
 * Generate and inject unique IOID for each auction cycle
 * @param {string} source - Source of the injection for logging
 * @param {string} auctionId - Current auction ID (optional, used for deduplication)
 */
function generateUniqueIOID(source = 'pre-generation', auctionId = null) {
  const pbjs = getGlobal();
  if (!pbjs) return false;

  if (auctionId && hasIOIDForCurrentAuction(auctionId)) {
    logInfo(`ExChain Analytics v${MODULE_VERSION}: IOID already generated for auction ${auctionId}, skipping from ${source}`);
    return false;
  }

  const ioid = generateUUID();
  if (!ioid) {
    logWarn(`ExChain Analytics v${MODULE_VERSION}: UUID generation failed during ${source}`);
    return false;
  }

  try {
    const ortb2 = pbjs.getConfig('ortb2') || {};
    
    ortb2.site = ortb2.site || {};
    ortb2.site.ext = ortb2.site.ext || {};
    ortb2.site.ext.data = ortb2.site.ext.data || {};
    
    ortb2.site.ext.data.ioids = [ioid];
    
    const ioidKeyword = `ioid=${ioid}`;
    if (ortb2.site.keywords) {
      const existingKeywords = ortb2.site.keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k && !k.startsWith('ioid='))
        .join(',');
      ortb2.site.keywords = existingKeywords ? `${existingKeywords},${ioidKeyword}` : ioidKeyword;
    } else {
      ortb2.site.keywords = ioidKeyword;
    }
    
    pbjs.setConfig({ ortb2 });
    
    if (auctionId) {
      currentAuctionId = auctionId;
    }
    
    logInfo(`ExChain Analytics v${MODULE_VERSION}: Generated unique IOID from ${source}:`, ioid, auctionId ? `(auction: ${auctionId})` : '');
    return true;
  } catch (error) {
    logError(`ExChain Analytics v${MODULE_VERSION}: Error generating unique IOID from ${source}:`, error);
    return false;
  }
}

/**
 * Creates a function wrapper that preserves all properties from the original function
 * @param {Function} originalFn - The original function to wrap
 * @param {Function} wrapper - The wrapper function
 * @returns {Function} The wrapped function with all original properties preserved
 */
function createPropertyPreservingWrapper(originalFn, wrapper) {
  try {
    Object.keys(originalFn).forEach(key => {
      wrapper[key] = originalFn[key];
    });
    
    const descriptors = Object.getOwnPropertyDescriptors(originalFn);
    Object.keys(descriptors).forEach(key => {
      if (key !== 'length' && key !== 'name' && key !== 'prototype') {
        try {
          Object.defineProperty(wrapper, key, descriptors[key]);
        } catch (e) {
          wrapper[key] = originalFn[key];
        }
      }
    });
    
    if (originalFn.prototype) {
      wrapper.prototype = originalFn.prototype;
    }
    
    Object.assign(wrapper, originalFn);
    
    return wrapper;
  } catch (error) {
    logWarn(`ExChain Analytics v${MODULE_VERSION}: Error preserving function properties:`, error);
    Object.keys(originalFn).forEach(key => {
      try {
        wrapper[key] = originalFn[key];
      } catch (e) {
        // Skip non-configurable properties
      }
    });
    return wrapper;
  }
}

/**
 * Hook into requestBids to ensure unique IOID exists before each auction starts
 */
function setupRequestBidsPreGeneration() {
  const pbjs = getGlobal();
  if (!pbjs || !pbjs.requestBids) return;

  try {
    const originalRequestBids = pbjs.requestBids;
    
    function wrappedRequestBids(requestObj) {
      let auctionId = null;
      if (requestObj && requestObj.auctionId) {
        auctionId = requestObj.auctionId;
      } else if (pbjs.getCurrentAuctionId) {
        auctionId = pbjs.getCurrentAuctionId();
      }
      
      generateUniqueIOID('requestBids-pre-generation', auctionId);
      
      return originalRequestBids.apply(this, arguments);
    }
    
    const propertyPreservedWrapper = createPropertyPreservingWrapper(originalRequestBids, wrappedRequestBids);
    pbjs.requestBids = propertyPreservedWrapper;
    
    logInfo(`ExChain Analytics v${MODULE_VERSION}: RequestBids pre-generation hook installed`);
    return true;
  } catch (error) {
    logError(`ExChain Analytics v${MODULE_VERSION}: Error setting up requestBids pre-generation:`, error);
    return false;
  }
}

/**
 * Pre-generate initial IOID when module loads
 */
function performImmediatePreGeneration() {
  const pbjs = getGlobal();
  if (!pbjs) return;
  
  try {
    if (pbjs.getConfig) {
      generateUniqueIOID('immediate-pre-generation');
    }
  } catch (error) {
    logError(`ExChain Analytics v${MODULE_VERSION}: Error in immediate pre-generation:`, error);
  }
}

/**
 * Initialize the module with pre-generation strategy
 */
function init() {
  if (moduleInitialized) {
    logInfo(`ExChain Analytics v${MODULE_VERSION}: Module already initialized`);
    return;
  }
  
  const pbjs = getGlobal();
  if (!pbjs) {
    logWarn(`ExChain Analytics v${MODULE_VERSION}: Prebid.js not available for pre-generation`);
    return;
  }
  
  try {
    performImmediatePreGeneration();
    setupRequestBidsPreGeneration();
    
    moduleInitialized = true;
    prebidReady = true;
    
    logInfo(`ExChain Analytics v${MODULE_VERSION}: Pre-generation strategy initialized successfully`);
    
    const ortb2 = pbjs.getConfig('ortb2') || {};
    const currentIOID = ortb2.site?.ext?.data?.ioids?.[0];
    logInfo(`ExChain Analytics v${MODULE_VERSION}: Initial ORTB2 IOID:`, currentIOID || 'None');
    
  } catch (error) {
    logError(`ExChain Analytics v${MODULE_VERSION}: Error during pre-generation initialization:`, error);
  }
}

/**
 * ExChain Analytics Module
 */
export const exchainAnalyticsModule = {
  name: MODULE_NAME,
  version: MODULE_VERSION,
  init: init,
  
  // Debug utilities for integration testing
  debug: {
    generateUniqueIOID,
    hasIOIDForCurrentAuction,
    isReady: () => prebidReady && moduleInitialized,
    getCurrentAuctionId: () => currentAuctionId
  }
};

/**
 * Multi-phase initialization strategy for Prebid compatibility
 */
function initializeModule() {
  const pbjs = getGlobal();
  
  if (pbjs && pbjs.getConfig && pbjs.setConfig) {
    init();
  }
  
  if (pbjs && pbjs.que) {
    pbjs.que.push(() => {
      if (!moduleInitialized) {
        init();
      }
    });
  }
  
  if (!moduleInitialized) {
    const pollForPrebid = setInterval(() => {
      const pbjs = getGlobal();
      if (pbjs && pbjs.getConfig && pbjs.setConfig && !moduleInitialized) {
        clearInterval(pollForPrebid);
        init();
      }
    }, 100);
    
    setTimeout(() => {
      clearInterval(pollForPrebid);
      if (!moduleInitialized) {
        logWarn(`ExChain Analytics v${MODULE_VERSION}: Failed to initialize after 10 seconds`);
      }
    }, 10000);
  }
}

// Register as a Prebid module
if (getGlobal() && getGlobal().installedModules) {
  getGlobal().installedModules.push(MODULE_NAME);
}

// Check for global configuration override
if (typeof window !== 'undefined' && window.exchainConfig) {
  if (window.exchainConfig.enabled === false) {
    logInfo(`ExChain Analytics v${MODULE_VERSION}: Disabled via global config`);
  } else {
    initializeModule();
  }
} else {
  initializeModule();
}

// Export for module system
export default exchainAnalyticsModule;