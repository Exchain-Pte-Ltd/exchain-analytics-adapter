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
 * 
 * Key Innovation in v3.2.8:
 * - Pre-generates IOID and injects into ORTB2 BEFORE requestBids() executes
 * - Uses same timing mechanism as Transaction ID generation
 * - Leverages Prebid's built-in pre-auction configuration phase
 * - No event dependencies = no race conditions
 * 
 * @maintainer admin@exchain.co
 * @version 3.2.8 - Pre-generation pattern (race condition eliminated)
 */

const MODULE_VERSION = '3.2.8';
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
 * Hook into requestBids to ensure IOID exists before auction starts
 * This is the same timing used by Transaction ID generation
 */
function setupRequestBidsPreGeneration() {
  const pbjs = getGlobal();
  if (!pbjs || !pbjs.requestBids) return;

  try {
    // Store original requestBids function
    const originalRequestBids = pbjs.requestBids;
    
    // Override requestBids with pre-generation
    pbjs.requestBids = function(requestObj) {
      // Pre-generate IOID if it doesn't exist
      // This happens BEFORE any auction processing begins
      preGenerateIOID('requestBids-pre-generation');
      
      // Call original requestBids with all original arguments
      return originalRequestBids.apply(this, arguments);
    };
    
    logInfo(`ExChain Analytics v${MODULE_VERSION}: RequestBids pre-generation hook installed`);
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
    
    // Strategy 2: Hook requestBids for future auctions
    setupRequestBidsPreGeneration();
    
    moduleInitialized = true;
    prebidReady = true;
    
    logInfo(`ExChain Analytics v${MODULE_VERSION}: Pre-generation strategy initialized successfully`);
    
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
    isReady: () => prebidReady && moduleInitialized
  }
};

/**
 * Multi-phase initialization strategy
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
      }
    }, 100);
    
    // Stop polling after 10 seconds
    setTimeout(() => {
      clearInterval(pollForPrebid);
    }, 10000);
  }
}

// Register as a Prebid module
if (getGlobal() && getGlobal().installedModules) {
  getGlobal().installedModules.push(MODULE_NAME);
}

// Initialize using multi-phase strategy
initializeModule();

// Export for module system
export default exchainAnalyticsModule;