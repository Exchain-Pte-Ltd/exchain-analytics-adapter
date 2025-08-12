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
 * ExChain Analytics Module - Pre-Generation Pattern (Eliminates Race Conditions)
 * 
 * ✅ SOLVED: Uses Prebid's native pre-generation pattern like Transaction IDs
 * ✅ No race conditions - IOID exists before auction starts
 * ✅ Follows same pattern as ortb2Imp.ext.tid
 * ✅ Hooks into requestBids preparation phase
 * ✅ Maintains standard module deployment process
 * ✅ NEW v3.2.9: Full Prebid 8 compatibility - preserves all function properties
 * 
 * Key Innovation in v3.2.9:
 * - Preserves ALL properties attached to requestBids by other modules
 * - Compatible with videoModule's "before" function in Prebid 8
 * - Maintains backward compatibility with Prebid 9/10
 * - Uses Object.assign and property descriptor copying for full preservation
 * 
 * @maintainer admin@exchain.co
 * @version 3.2.9 - Prebid 8 compatibility (preserves module properties)
 */

const MODULE_VERSION = '3.2.9';
const MODULE_NAME = 'exchainAnalyticsAdapter';

let moduleInitialized = false;
let prebidReady = false;

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
 * Check if IOID already exists in ORTB2
 * @returns {boolean} True if IOID already present
 */
function hasExistingIOID() {
  const pbjs = getGlobal();
  if (!pbjs) return false;
  
  try {
    const ortb2 = pbjs.getConfig('ortb2') || {};
    const hasIOIDArray = ortb2.site?.ext?.data?.ioids?.length > 0;
    const hasIOIDKeyword = ortb2.site?.keywords?.includes('ioid=');
    return hasIOIDArray || hasIOIDKeyword;
  } catch (error) {
    return false;
  }
}

/**
 * Pre-generate and inject IOID into ORTB2 (before any auctions)
 * This follows the same pattern as Transaction ID pre-generation
 * @param {string} source - Source of the injection for logging
 */
function preGenerateIOID(source = 'pre-generation') {
  const pbjs = getGlobal();
  if (!pbjs) return false;

  // Don't overwrite existing IOIDs
  if (hasExistingIOID()) {
    logInfo(`ExChain Analytics v${MODULE_VERSION}: IOID already exists, skipping pre-generation from ${source}`);
    return false;
  }

  const ioid = generateUUID();
  if (!ioid) {
    logWarn(`ExChain Analytics v${MODULE_VERSION}: UUID generation failed during ${source}`);
    return false;
  }

  try {
    // Get current ORTB2 or create new
    const ortb2 = pbjs.getConfig('ortb2') || {};
    
    // Ensure structure exists
    ortb2.site = ortb2.site || {};
    ortb2.site.ext = ortb2.site.ext || {};
    ortb2.site.ext.data = ortb2.site.ext.data || {};
    
    // Inject IOID in both locations (following Transaction ID pattern)
    ortb2.site.ext.data.ioids = [ioid];
    
    // Add to keywords
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
    
    // Set the updated ORTB2 config
    pbjs.setConfig({ ortb2 });
    
    logInfo(`ExChain Analytics v${MODULE_VERSION}: Pre-generated IOID from ${source}:`, ioid);
    return true;
  } catch (error) {
    logError(`ExChain Analytics v${MODULE_VERSION}: Error in pre-generation from ${source}:`, error);
    return false;
  }
}

/**
 * Creates a function wrapper that preserves ALL properties from the original function
 * This is crucial for Prebid 8 compatibility where modules attach properties like 'before'
 * @param {Function} originalFn - The original function to wrap
 * @param {Function} wrapper - The wrapper function
 * @returns {Function} The wrapped function with all original properties preserved
 */
function createPropertyPreservingWrapper(originalFn, wrapper) {
  try {
    // Method 1: Copy all enumerable properties
    Object.keys(originalFn).forEach(key => {
      wrapper[key] = originalFn[key];
    });
    
    // Method 2: Copy property descriptors (handles non-enumerable properties)
    const descriptors = Object.getOwnPropertyDescriptors(originalFn);
    Object.keys(descriptors).forEach(key => {
      if (key !== 'length' && key !== 'name' && key !== 'prototype') {
        try {
          Object.defineProperty(wrapper, key, descriptors[key]);
        } catch (e) {
          // Fallback for non-configurable properties
          wrapper[key] = originalFn[key];
        }
      }
    });
    
    // Method 3: Copy prototype if it exists
    if (originalFn.prototype) {
      wrapper.prototype = originalFn.prototype;
    }
    
    // Method 4: Use Object.assign as additional fallback
    Object.assign(wrapper, originalFn);
    
    return wrapper;
  } catch (error) {
    logWarn(`ExChain Analytics v${MODULE_VERSION}: Error preserving function properties:`, error);
    // Fallback: simple property copy
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
 * Hook into requestBids to ensure IOID exists before auction starts
 * This is the same timing used by Transaction ID generation
 * NEW: Now preserves ALL function properties for Prebid 8 compatibility
 */
function setupRequestBidsPreGeneration() {
  const pbjs = getGlobal();
  if (!pbjs || !pbjs.requestBids) return;

  try {
    // Store original requestBids function
    const originalRequestBids = pbjs.requestBids;
    
    // Log what properties exist on the original function (for debugging)
    const originalProperties = Object.keys(originalRequestBids);
    if (originalProperties.length > 0) {
      logInfo(`ExChain Analytics v${MODULE_VERSION}: Original requestBids has properties:`, originalProperties);
    }
    
    // Create wrapper function that calls our pre-generation logic
    function wrappedRequestBids(requestObj) {
      // Pre-generate IOID if it doesn't exist
      // This happens BEFORE any auction processing begins
      preGenerateIOID('requestBids-pre-generation');
      
      // Call original requestBids with all original arguments
      return originalRequestBids.apply(this, arguments);
    }
    
    // Preserve ALL properties from the original function
    // This is critical for Prebid 8 compatibility (videoModule's 'before' function, etc.)
    const propertyPreservedWrapper = createPropertyPreservingWrapper(originalRequestBids, wrappedRequestBids);
    
    // Replace the function
    pbjs.requestBids = propertyPreservedWrapper;
    
    // Verify properties were preserved (for debugging)
    const preservedProperties = Object.keys(pbjs.requestBids);
    if (originalProperties.length > 0) {
      const missingProperties = originalProperties.filter(prop => !(prop in pbjs.requestBids));
      if (missingProperties.length === 0) {
        logInfo(`ExChain Analytics v${MODULE_VERSION}: All ${originalProperties.length} properties preserved successfully`);
      } else {
        logWarn(`ExChain Analytics v${MODULE_VERSION}: Missing properties after override:`, missingProperties);
      }
    }
    
    logInfo(`ExChain Analytics v${MODULE_VERSION}: RequestBids pre-generation hook installed with property preservation`);
    return true;
  } catch (error) {
    logError(`ExChain Analytics v${MODULE_VERSION}: Error setting up requestBids pre-generation:`, error);
    return false;
  }
}

/**
 * Pre-generate IOID immediately when module loads (like Transaction IDs)
 * This ensures IOID exists even for immediate auctions
 */
function performImmediatePreGeneration() {
  const pbjs = getGlobal();
  if (!pbjs) return;
  
  try {
    // Immediately pre-generate IOID if Prebid is ready
    if (pbjs.getConfig) {
      preGenerateIOID('immediate-pre-generation');
    }
  } catch (error) {
    logError(`ExChain Analytics v${MODULE_VERSION}: Error in immediate pre-generation:`, error);
  }
}

/**
 * Validate that our function override preserves critical properties
 * This is particularly important for Prebid 8 compatibility
 * @returns {Object} Validation results
 */
function validateFunctionOverride() {
  const pbjs = getGlobal();
  if (!pbjs || !pbjs.requestBids) {
    return { valid: false, reason: 'pbjs.requestBids not available' };
  }
  
  const results = {
    valid: true,
    properties: [],
    issues: []
  };
  
  try {
    // Check for common properties that modules attach
    const criticalProperties = [
      'before',           // videoModule in Prebid 8
      'priceFloorHook',   // priceFloors module
      'userIdHook',       // userId module
      'consentHook',      // tcfControl module
      'length',           // Function.length
      'name'              // Function.name
    ];
    
    criticalProperties.forEach(prop => {
      if (prop in pbjs.requestBids) {
        results.properties.push({
          name: prop,
          type: typeof pbjs.requestBids[prop],
          exists: true
        });
      } else if (prop === 'before') {
        // 'before' is critical for videoModule
        results.issues.push(`Critical property '${prop}' missing - may break videoModule`);
      }
    });
    
    // Check if the function is still callable
    if (typeof pbjs.requestBids !== 'function') {
      results.valid = false;
      results.issues.push('requestBids is no longer a function');
    }
    
  } catch (error) {
    results.valid = false;
    results.issues.push(`Validation error: ${error.message}`);
  }
  
  return results;
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
    // Strategy 1: Immediate pre-generation (like Transaction IDs)
    performImmediatePreGeneration();
    
    // Strategy 2: Hook requestBids for future auctions (with property preservation)
    setupRequestBidsPreGeneration();
    
    moduleInitialized = true;
    prebidReady = true;
    
    logInfo(`ExChain Analytics v${MODULE_VERSION}: Pre-generation strategy initialized successfully (Prebid 8 compatible)`);
    
    // Show current state
    const ortb2 = pbjs.getConfig('ortb2') || {};
    const currentIOID = ortb2.site?.ext?.data?.ioids?.[0];
    logInfo(`ExChain Analytics v${MODULE_VERSION}: Current ORTB2 IOID:`, currentIOID || 'None');
    
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
  
  // Expose utilities for debugging
  debug: {
    hasExistingIOID,
    preGenerateIOID,
    validateFunctionOverride,
    isReady: () => prebidReady && moduleInitialized,
    
    // New debugging utilities for Prebid 8 compatibility
    checkRequestBidsProperties: () => {
      const pbjs = getGlobal();
      if (!pbjs || !pbjs.requestBids) return null;
      
      const props = {};
      Object.keys(pbjs.requestBids).forEach(key => {
        props[key] = typeof pbjs.requestBids[key];
      });
      return props;
    },
    
    testVideoModuleCompatibility: () => {
      const pbjs = getGlobal();
      if (!pbjs || !pbjs.requestBids) return { compatible: false, reason: 'requestBids not available' };
      
      if (typeof pbjs.requestBids.before === 'function') {
        try {
          // Don't actually call it, just check if it exists and is callable
          return { compatible: true, hasBeforeFunction: true };
        } catch (error) {
          return { compatible: false, reason: `before function error: ${error.message}` };
        }
      } else {
        return { compatible: true, hasBeforeFunction: false, note: 'No before function (normal for some configurations)' };
      }
    }
  }
};

/**
 * Multi-phase initialization strategy
 * Enhanced for better Prebid 8 compatibility detection
 */
function initializeModule() {
  const pbjs = getGlobal();
  
  // Phase 1: Try immediate initialization
  if (pbjs && pbjs.getConfig && pbjs.setConfig) {
    init();
  }
  
  // Phase 2: Queue for when Prebid is fully ready
  if (pbjs && pbjs.que) {
    pbjs.que.push(() => {
      if (!moduleInitialized) {
        init();
        
        // Post-initialization validation for Prebid 8
        setTimeout(() => {
          const validation = validateFunctionOverride();
          if (!validation.valid) {
            logWarn(`ExChain Analytics v${MODULE_VERSION}: Post-init validation issues:`, validation.issues);
          } else if (validation.properties.length > 0) {
            logInfo(`ExChain Analytics v${MODULE_VERSION}: Function properties preserved:`, validation.properties.map(p => `${p.name}(${p.type})`).join(', '));
          }
        }, 100);
      }
    });
  }
  
  // Phase 3: Fallback polling (last resort)
  if (!moduleInitialized) {
    const pollForPrebid = setInterval(() => {
      const pbjs = getGlobal();
      if (pbjs && pbjs.getConfig && pbjs.setConfig && !moduleInitialized) {
        clearInterval(pollForPrebid);
        init();
        
        // Validate after polling initialization
        setTimeout(() => {
          const validation = validateFunctionOverride();
          if (validation.issues.length > 0) {
            logWarn(`ExChain Analytics v${MODULE_VERSION}: Polling init validation issues:`, validation.issues);
          }
        }, 100);
      }
    }, 100);
    
    // Stop polling after 10 seconds
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
    // Initialize using multi-phase strategy
    initializeModule();
  }
} else {
  // Initialize using multi-phase strategy
  initializeModule();
}

// Export for module system
export default exchainAnalyticsModule;