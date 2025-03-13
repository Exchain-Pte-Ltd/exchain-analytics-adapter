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
 * Exchain Analytics Adapter Module
 *
 * This Prebid.js analytics adapter automatically generates and appends a unique, secure, and anonymous identifier (IOID)
 * at the impression level (`ortb2Imp.ext.ioid`) in bid requests. Additionally, it aggregates these identifiers
 * globally within the `ortb2.site.ext.data.ioids` and includes them in the site's keywords field. This enhances bid request
 * tracking, streamlines analytics, reduces bidstream bloat, and addresses common programmatic challenges related to
 * duplicated or ambiguous transaction IDs.
 *
 * Features:
 * - Secure and performant UUIDv4 generation.
 * - Impression-level and global IOID management for enhanced analytics.
 * - Seamless integration with existing Prebid.js adapters.
 *
 * @maintainer admin@exchain.co
 */

export const MODULE_NAME = 'ExchainAnalyticsAdapter';

const pbjs = window.pbjs;

export const exchainPrebidModule = {
  /**
   * Used to link submodule with config
   * @type {string}
   */
  name: MODULE_NAME,

  /**
   * Binds onBidCatch methods on beforeRequestBids event
   */
  onPbjsReady: function() {
    pbjs.onEvent('beforeRequestBids', this.onBidCatch.bind(this));
  },

  // Temporary storage for global IOIDs
  globalIoids: new Set(),

  addToGlobalIoids(uuid) {
     this.globalIoids.add(uuid);
  },

  /**
   * Adds UUID to bid
   */
  onBidCatch: function(bids) {
    bids.forEach(bid => {
      const uuid = this.generateUUID();

      // Update impression-level identifier (ioid)
      if (bid.ortb2Imp && bid.ortb2Imp.ext) {
      // deprecated field for backward compatibility
          bid.ortb2Imp.ext.tid = uuid;
          bid.ortb2Imp.ext.ioid = uuid;
      }
      // Collect all generated IOIDs globally
      this.addToGlobalIoids(uuid);
    });
    // After collecting IOIDs, insert into global ortb2
    this.insertGlobalIoidsToGlobalOrtB2();
  },


   insertGlobalIoidsToGlobalOrtB2: function() {
       const ortb2 = pbjs.getConfig('ortb2') || {};
       ortb2.site = ortb2.site || {};
       ortb2.site.ext = ortb2.site.ext || {};
       ortb2.site.ext.data = ortb2.site.ext.data || {};

       // Insert IOIDs into the global data object
       ortb2.site.ext.data.ioids = Array.from(this.globalIoids);

       // Append IOIDs to keywords string for adapters that require it
       const ioidKeywords = Array.from(this.globalIoids).map(id => `ioid=${id}`).join(',');

       if (ortb2.site.keywords) {
         ortb2.site.keywords += ',' + ioidKeywords;
       } else {
         ortb2.site.keywords = ioidKeywords;
       }

       pbjs.setConfig({ ortb2 });

       // Clear the Set to free memory
       this.globalIoids.clear();
   },

  /**
   * Generates UUID
   * @returns {string | undefined}
   */
  generateUUID: function() {
    // Use crypto for secure random numbers
    // Works in most browsers
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
  }
};

pbjs.que.push(function() {
  exchainPrebidModule.onPbjsReady();
});
