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
 * This module adds UUID to bid
 * @module modules/exchainAnalyticsAdapter
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

  /**
   * Adds UUID to bid
   */
  onBidCatch: function(bids) {
    bids.forEach(bid => {
      bid.ortb2Imp.ext.tid = this.generateUUID();
    });
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
