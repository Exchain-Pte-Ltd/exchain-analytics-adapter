# Exchain Analytics Adapter

[![Latest Release](https://img.shields.io/github/v/release/Exchain-Pte-Ltd/exchain-analytics-adapter)](https://github.com/Exchain-Pte-Ltd/exchain-analytics-adapter/releases/tag/v3.2.0)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE.md)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Exchain-Pte-Ltd/exchain-analytics-adapter.git
cd exchain-analytics-adapter

# Build the adapter
npm install
npm run build

# Include in your HTML
<script src="./dist/main.js"></script>
```

## Overview

Welcome to the **Exchain Analytics Adapter** repository! This custom Prebid.js module provides a unique solution for enhancing tracking and analytics in programmatic advertising by appending a tamper-proof identifier to bid requests. It serves as both the **Exchain Impression Opportunity Identifier (IOID) Module** and the **Exchain Analytics Adapter**, offering a streamlined integration for publishers.

- **Module Name:** Exchain Impression Opportunity Identifier Module (Exchain IOID Module) / Exchain Analytics Adapter
- **Module Type:** Analytics Adapter
- **Maintainer:** [admin@exchain.co](mailto:admin@exchain.co)
- **Purpose:** To generate an anonymous, unique, and tamper-proof identifier (UUID) appended to RTB ad requests, addressing challenges in bidstream bloat, sustainability, and wasted ad spend while enabling enhanced tracking and analytics.

## Key Features

✅ **Production-ready code** - Clean, minimal code optimized for reliability and performance  
✅ **Currently in beta testing** - Live testing with select publishers before general release  
✅ **Single IOID per auction** - More efficient than per-impression approach  
✅ **Global ORTB2 placement** in two standard locations:
- `ortb2.site.ext.data.ioids` (array with single element)
- `ortb2.site.keywords` (appended as "ioid={uuid}")

✅ **Self-contained** - No external dependencies required  
✅ **Standard integration** - Uses Prebid.js `beforeRequestBids` event  
✅ **Secure generation** - Utilizes crypto APIs for reliable UUID creation

## How It Works

The Exchain IOID is an anonymous, unique, and tamper-proof identifier that is appended to RTB ad requests by publishers. This solution tackles programmatic ecosystem challenges by reducing bidstream bloat, improving sustainability, and minimizing wasted ad spend. The adapter automatically generates and appends a UUID to bid requests, leveraging secure cryptographic APIs and integrating seamlessly with Prebid.js.

## 🔒 Privacy & Data Protection

**Privacy-First Design**: The Exchain Analytics Adapter is built with privacy protection as a core principle.

- **🚫 No personal data collection** - This module does not collect, store, or process any personally identifiable information (PII)
- **🎲 Random per-auction identifiers** - IOIDs are cryptographically random UUIDs generated fresh for each auction
- **🛡️ No user tracking or profiling capabilities** - IOIDs cannot be used to track users across sessions, sites, or devices
- **⏱️ Session-scoped only** - Identifiers are not persistent and do not create user profiles
- **🔐 Privacy regulation compliant** - Compatible with GDPR, CCPA, and other privacy frameworks
- **📊 Analytics-focused** - Designed solely for auction-level analytics and optimization, not user-level tracking

**Technical Privacy Features:**
- Identifiers are generated client-side using secure random number generation
- No cookies, local storage, or persistent identifiers are created
- No data is transmitted to external servers for IOID generation
- Each auction receives a completely unique, non-correlatable identifier

## Installation & Integration

### 1. Include Prebid.js

```html
<script src="https://cdn.jsdelivr.net/npm/prebid.js@latest/dist/not-for-prod/prebid.js"></script>
```

⚠️ **Note:** Do not use this URL in production. Refer to [Prebid.js Getting Started Documentation](https://docs.prebid.org/dev-docs/getting-started.html) for production setup.

### 2. Build and Include the Adapter

```bash
# Clone and build
git clone https://github.com/Exchain-Pte-Ltd/exchain-analytics-adapter.git
cd exchain-analytics-adapter
npm install
npm run build
```

```html
<!-- Include the generated adapter -->
<script src="./dist/main.js"></script>
```

### 3. Verify Installation (Optional)

Open the `example/index.html` file in your browser and check the console for verification logs:

```
🚀 ExChain Analytics Adapter v3.2 Demo Starting...
✅ ExChain IOID successfully generated!
📍 IOID in ortb2.site.ext.data.ioids: ["abc123-def4-5678-90ab-cdef12345678"]
🔤 IOID in ortb2.site.keywords: "ioid=abc123-def4-5678-90ab-cdef12345678"
```

## 📖 Configuration & Usage

### Basic Configuration

The ExChain Analytics Adapter requires **no configuration** - it works automatically once included. Simply include the script and it will:

1. **Auto-initialize** when Prebid.js is ready
2. **Generate IOIDs** automatically before each auction
3. **Inject IOIDs** into standard ORTB2 locations

### Complete Implementation Example

```html
<!DOCTYPE html>
<html>
<head>
    <!-- 1. Include Prebid.js -->
    <script src="https://cdn.jsdelivr.net/npm/prebid.js@latest/dist/not-for-prod/prebid.js"></script>
    
    <!-- 2. Include ExChain Analytics Adapter -->
    <script src="./dist/main.js"></script>
    
    <!-- 3. Include Google Publisher Tag (if using GAM) -->
    <script src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
</head>
<body>
    <!-- 4. Your ad slot -->
    <div id="div-gpt-ad-1234567890-0" style="width: 300px; height: 250px;"></div>

    <script>
        // 5. Configure your ad units (standard Prebid setup)
        var adUnits = [{
            code: 'div-gpt-ad-1234567890-0',
            mediaTypes: {
                banner: {
                    sizes: [[300, 250]]
                }
            },
            bids: [{
                bidder: 'appnexus',  // Replace with your bidders
                params: {
                    placementId: 13144370  // Your placement ID
                }
            }]
        }];

        // 6. Standard Prebid.js auction setup
        pbjs.que.push(function() {
            pbjs.addAdUnits(adUnits);
            pbjs.requestBids({
                bidsBackHandler: function() {
                    // IOIDs are automatically added by this point
                    googletag.cmd.push(function() {
                        pbjs.setTargetingForGPTAsync();
                        googletag.pubads().refresh();
                    });
                }
            });
        });

        // 7. Google Ad Manager setup (if using GAM)
        googletag.cmd.push(function() {
            googletag.defineSlot('/your-ad-unit-path', [300, 250], 'div-gpt-ad-1234567890-0')
                .addService(googletag.pubads());
            googletag.pubads().enableSingleRequest();
            googletag.enableServices();
        });
    </script>
</body>
</html>
```

### IOID Data Locations

After the adapter runs, IOIDs are automatically placed in these ORTB2 locations:

#### 1. ortb2.site.ext.data.ioids (Array)
```javascript
// Access via Prebid.js
const ortb2 = pbjs.getConfig('ortb2');
console.log(ortb2.site.ext.data.ioids); 
// Output: ["abc123-def4-5678-90ab-cdef12345678"]
```

#### 2. ortb2.site.keywords (String)
```javascript
// Access via Prebid.js
const ortb2 = pbjs.getConfig('ortb2');
console.log(ortb2.site.keywords); 
// Output: "existing,keywords,ioid=abc123-def4-5678-90ab-cdef12345678"
```

### Integration with Different Bidders

The adapter works with **all Prebid.js bidders** automatically. No bidder-specific configuration needed.

#### Supported Bidders (Partial List)
- AppNexus/Xandr
- Google Ad Exchange (AdX)  
- Amazon TAM/UAM
- Index Exchange
- PubMatic
- Rubicon Project
- OpenX
- All other Prebid.js compatible bidders

### Advanced Configuration Options

#### Module Configuration
```javascript
// Global configuration (set before including the adapter script)
window.exchainConfig = {
  enabled: true  // Set to false to disable the module
};
```

#### Manual Initialization with Configuration
```javascript
// If you need to manually control initialization
import { exchainPrebidModule } from './dist/main.js';

// Initialize manually with configuration
pbjs.que.push(function() {
    exchainPrebidModule.init({
        enabled: true  // Set to false to disable
    });
});
```

#### Version Information & Debugging
```javascript
// Access module version for debugging
import { exchainPrebidModule } from './dist/main.js';
console.log('ExChain Analytics Version:', exchainPrebidModule.version);

// Check module initialization status
pbjs.que.push(function() {
    // The module will log initialization status to console:
    // "ExChain Analytics v3.2.0: Successfully initialized"
    // OR
    // "ExChain Analytics v3.2.0: Module disabled via configuration"
});
```

#### Conditional Loading
```javascript
// Example: Only load ExChain Analytics in production
window.exchainConfig = {
  enabled: window.location.hostname === 'your-production-domain.com'
};
```

#### Verification & Debugging
```javascript
// Check if IOIDs are being generated
pbjs.onEvent('beforeRequestBids', function() {
    setTimeout(function() {
        const ortb2 = pbjs.getConfig('ortb2');
        if (ortb2?.site?.ext?.data?.ioids?.length > 0) {
            console.log('✅ ExChain IOID active:', ortb2.site.ext.data.ioids[0]);
        } else {
            console.warn('⚠️ No ExChain IOID found');
        }
    }, 100);
});
```

## 🔧 Troubleshooting

### Common Issues & Solutions

#### ❌ "No IOID found in ORTB2 configuration"
**Possible Causes:**
- Prebid.js not loaded before the adapter
- Crypto API not available (very rare in modern browsers)
- JavaScript errors preventing initialization

**Solutions:**
```javascript
// 1. Verify Prebid.js is loaded
if (typeof pbjs === 'undefined') {
    console.error('Prebid.js not loaded');
}

// 2. Check for crypto API
if (typeof crypto === 'undefined' || !crypto.getRandomValues) {
    console.error('Crypto API not available');
}

// 3. Check for JavaScript errors in console
```

#### ❌ Adapter not initializing
**Solutions:**
```javascript
// Ensure adapter loads after Prebid.js
<script src="prebid.js"></script>
<script src="./dist/main.js"></script> <!-- Load after Prebid -->

// Check console for initialization messages:
// ✅ "ExChain Analytics v3.2.0: Successfully initialized"
// ❌ "ExChain Analytics v3.2.0: Prebid.js not available" 
// ❌ "ExChain Analytics v3.2.0: Module disabled via configuration"
```

#### ❌ IOIDs not appearing in bid requests
**Check:**
1. Verify the adapter is generating IOIDs (see console logs with version info)
2. Ensure `beforeRequestBids` event is firing
3. Check ORTB2 configuration: `pbjs.getConfig('ortb2')`
4. Confirm module is enabled: `exchainPrebidModule.version` should be accessible

### Browser Compatibility

**Supported Browsers:**
- ✅ Chrome 50+
- ✅ Firefox 55+  
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ All modern mobile browsers

**Requirements:**
- JavaScript ES6+ support
- Crypto API (available in all modern browsers)
- Prebid.js 4.0+

## 🧪 Beta Release Status

**Current Status**: Production-ready code in controlled beta testing phase

- **Code Quality**: Production-ready with comprehensive testing and optimization
- **Release Phase**: Limited beta deployment with select publisher partner
- **Environment**: Suitable for production environments under controlled testing
- **Timeline**: General availability planned following successful beta validation
- **Feedback**: Report to [admin@exchain.co](mailto:admin@exchain.co)
- **Current Version**: v3.2.0 (Latest Release)

## ⚠️ Important Notes

- **Limited release**: Currently available to select beta testing partners only
- **Production quality**: Code is production-ready and enterprise-grade
- **Controlled deployment**: Beta testing in live production environments with monitoring
- **Data collection**: Analytics collected for validation and improvement purposes
- **Support**: Full support available during business hours for beta partners

## 📞 Support & Contact

- **Issues & Questions**: [admin@exchain.co](mailto:admin@exchain.co)
- **Documentation**: This README and inline code comments
- **Example**: See `example/index.html` for working demonstration

## License

Licensed under the Apache License, Version 2.0. See [LICENSE.md](LICENSE.md) for details.

---

**Current Version: v3.2.0** | **Released**: Latest | **Status**: Production-Ready Beta
