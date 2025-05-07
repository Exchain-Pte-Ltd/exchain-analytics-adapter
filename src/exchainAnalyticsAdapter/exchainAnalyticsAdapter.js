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
 * at the impression level (`ortb2Imp.ext.ioid`) in bid requests. Additionally, it aggregates the current auction's
 * identifiers within the `ortb2.site.ext.data.ioids` and includes them in the site's keywords field.
 *
 * @maintainer admin@exchain.co
 */

import { getGlobal } from './prebidGlobal.js';
export const MODULE_NAME = 'ExchainAnalyticsAdapter';

// Function to get a reference to the global pbjs object
function getPbjs() {
    return getGlobal();
}

export const exchainPrebidModule = {
    /**
     * Used to link submodule with config
     * @type {string}
     */
    name: MODULE_NAME,

    // Storage for current auction cycle IOIDs
    currentIoids: [],

    // Flag to prevent multiple initialization
    initialized: false,

    /**
     * Initialize the module
     */
    init: function() {
        if (this.initialized) return;

        const pbjs = getPbjs();
        if (!pbjs) return;

        // Set initialization flag
        this.initialized = true;

        // Initialize the module components
        this.earlyInitialization();
        this.registerStandardEvents();
    },

    /**
     * Early initialization to set up ortb2 structure
     * and intercept key Prebid.js functions
     */
    earlyInitialization: function() {
        const pbjs = getPbjs();
        if (!pbjs) return;

        // Pre-initialize ortb2 structure
        const ortb2 = pbjs.getConfig('ortb2') || {};
        ortb2.site = ortb2.site || {};
        ortb2.site.ext = ortb2.site.ext || {};
        ortb2.site.ext.data = ortb2.site.ext.data || {};
        ortb2.site.ext.data.ioids = [];

        pbjs.setConfig({ ortb2 });

        // Intercept requestBids function
        this.interceptRequestBids(pbjs);
    },

    /**
     * Intercept the requestBids function to add IOIDs before bid requests are created
     */
    interceptRequestBids: function(pbjs) {
        if (!pbjs || typeof pbjs.requestBids !== 'function') return;

        const originalRequestBids = pbjs.requestBids;
        const self = this;

        pbjs.requestBids = function(config) {
            // Process each ad unit and generate IOIDs
            if (config && config.adUnits && Array.isArray(config.adUnits)) {
                self.processAdUnits(config.adUnits);
            } else if (pbjs.adUnits && Array.isArray(pbjs.adUnits)) {
                self.processAdUnits(pbjs.adUnits);
            }

            // Update global ortb2 with current IOIDs
            self.updateGlobalOrtb2(pbjs);

            // Call the original function
            return originalRequestBids.call(pbjs, config);
        };
    },

    /**
     * Register for standard Prebid.js events as a fallback
     */
    registerStandardEvents: function() {
        const pbjs = getPbjs();
        if (!pbjs) return;

        pbjs.que.push(() => {
            if (typeof pbjs.on === 'function') {
                pbjs.on('beforeRequestBids', this.onBeforeBids.bind(this));
                pbjs.on('adUnitAdded', this.onAdUnitAdded.bind(this));
            } else if (typeof pbjs.onEvent === 'function') {
                pbjs.onEvent('beforeRequestBids', this.onBeforeBids.bind(this));
            }
        });
    },

    /**
     * Process ad units and generate IOIDs
     */
    processAdUnits: function(adUnits) {
        if (!adUnits || !Array.isArray(adUnits) || adUnits.length === 0) return;

        // Reset current IOIDs for this auction cycle
        this.currentIoids = [];

        // Generate and inject IOIDs
        adUnits.forEach(adUnit => {
            if (!adUnit) return;

            const uuid = this.generateUUID();
            if (!uuid) return;

            // Add to current IOIDs
            this.currentIoids.push(uuid);

            // Set at impression level
            if (!adUnit.ortb2Imp) adUnit.ortb2Imp = {};
            if (!adUnit.ortb2Imp.ext) adUnit.ortb2Imp.ext = {};
            adUnit.ortb2Imp.ext.ioid = uuid;

            // Inject into bidder-specific params and ortb2
            if (adUnit.bids && Array.isArray(adUnit.bids)) {
                adUnit.bids.forEach(bid => {
                    if (!bid) return;

                    // Add to bidder params if supported
                    if (!bid.params) bid.params = {};
                    bid.params.ioid = uuid;

                    // Add to bidder-specific ortb2
                    if (!bid.ortb2) bid.ortb2 = {};
                    if (!bid.ortb2.site) bid.ortb2.site = {};
                    if (!bid.ortb2.site.ext) bid.ortb2.site.ext = {};
                    if (!bid.ortb2.site.ext.data) bid.ortb2.site.ext.data = {};

                    // Make sure ioids array exists
                    if (!bid.ortb2.site.ext.data.ioids) {
                        bid.ortb2.site.ext.data.ioids = [];
                    }

                    // Add the IOID to bidder-specific config
                    if (!bid.ortb2.site.ext.data.ioids.includes(uuid)) {
                        bid.ortb2.site.ext.data.ioids.push(uuid);
                    }

                    // Also add to bidder-specific keywords
                    if (!bid.ortb2.site.keywords) {
                        bid.ortb2.site.keywords = `ioid=${uuid}`;
                    } else if (!bid.ortb2.site.keywords.includes(`ioid=${uuid}`)) {
                        bid.ortb2.site.keywords += `,ioid=${uuid}`;
                    }
                });
            }
        });
    },

    /**
     * Update global ortb2 config with current IOIDs
     */
    updateGlobalOrtb2: function(pbjs) {
        if (!pbjs) pbjs = getPbjs();
        if (!pbjs || !this.currentIoids || this.currentIoids.length === 0) return;

        // Get current ortb2 config
        const ortb2 = pbjs.getConfig('ortb2') || {};

        // Ensure structures exist
        ortb2.site = ortb2.site || {};
        ortb2.site.ext = ortb2.site.ext || {};
        ortb2.site.ext.data = ortb2.site.ext.data || {};

        // Update with current IOIDs
        ortb2.site.ext.data.ioids = [...this.currentIoids];

        // Update keywords as well
        const ioidKeywords = this.currentIoids.map(id => `ioid=${id}`).join(',');
        if (ortb2.site.keywords) {
            ortb2.site.keywords += ',' + ioidKeywords;
        } else {
            ortb2.site.keywords = ioidKeywords;
        }

        // Apply the config update
        pbjs.setConfig({ ortb2 });

        // Try to update any existing bidderRequests directly
        this.updateExistingBidderRequests(pbjs);
    },

    /**
     * Update any in-progress bidderRequests
     */
    updateExistingBidderRequests: function(pbjs) {
        if (!pbjs || !this.currentIoids || this.currentIoids.length === 0) return;

        // Try to access active auctions
        if (pbjs.requestBids && typeof pbjs.requestBids.getAuctions === 'function') {
            const auctions = pbjs.requestBids.getAuctions();
            if (auctions && Array.isArray(auctions)) {
                auctions.forEach(auction => {
                    if (auction && auction.bidderRequests && Array.isArray(auction.bidderRequests)) {
                        auction.bidderRequests.forEach(req => {
                            if (!req.ortb2) req.ortb2 = {};
                            if (!req.ortb2.site) req.ortb2.site = {};
                            if (!req.ortb2.site.ext) req.ortb2.site.ext = {};
                            if (!req.ortb2.site.ext.data) req.ortb2.site.ext.data = {};
                            req.ortb2.site.ext.data.ioids = [...this.currentIoids];
                        });
                    }
                });
            }
        }
    },

    /**
     * Fallback handler for beforeRequestBids event
     */
    onBeforeBids: function(adUnits) {
        // Process ad units if we haven't already
        if (!this.currentIoids || this.currentIoids.length === 0) {
            this.processAdUnits(adUnits);
            this.updateGlobalOrtb2();
        }
    },

    /**
     * Handler for adUnitAdded event
     */
    onAdUnitAdded: function(adUnit) {
        if (!adUnit) return;

        // Generate and add IOID for this ad unit
        const uuid = this.generateUUID();
        if (!uuid) return;

        // Add to current IOIDs
        this.currentIoids.push(uuid);

        // Set at impression level
        if (!adUnit.ortb2Imp) adUnit.ortb2Imp = {};
        if (!adUnit.ortb2Imp.ext) adUnit.ortb2Imp.ext = {};
        adUnit.ortb2Imp.ext.ioid = uuid;

        // Update global ortb2 to include the new IOID
        this.updateGlobalOrtb2();
    },

    /**
     * Generates UUID
     * @returns {string | undefined}
     */
    generateUUID: function() {
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
};

// Initialize the module
const pbjs = getPbjs();
if (pbjs) {
    pbjs.que.push(() => {
        exchainPrebidModule.init();
    });
}
