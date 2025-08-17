# Exchain Analytics Adapter

[![Latest Release](https://img.shields.io/github/v/release/Exchain-Pte-Ltd/exchain-analytics-adapter)](https://github.com/Exchain-Pte-Ltd/exchain-analytics-adapter/releases)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE.md)

## 🚀 Quick Start

```bash
# 1. Get Prebid.js source code
git clone https://github.com/prebid/Prebid.js.git
cd Prebid.js

# 2. Copy the Exchain module
wget https://raw.githubusercontent.com/Exchain-Pte-Ltd/exchain-analytics-adapter/main/src/exchainAnalyticsAdapter/exchainAnalyticsAdapter.js -O modules/exchainAnalyticsAdapter.js

# 3. Build Prebid.js with the module
npm install
gulp build --modules=exchainAnalyticsAdapter

# 4. Include in your HTML
<script src="./build/dist/prebid.js"></script>
```

## 📝 Overview

Welcome to the **Exchain Analytics Adapter**!  
This Prebid.js module introduces a **Pre-Generated IOID (Impression Opportunity ID)** that is:

- Cryptographically secure
- Injected **before** any auction starts
- Compliant with Prebid.js standards
- Automatically added to `ortb2.site.ext.data.ioids` and `ortb2.site.keywords`

### 🔄 What's New in v3.2.10

> Version 3.2.10 introduces **unique IOID generation per auction cycle** - fixing a critical bug where the same IOID was reused across multiple auctions.

- ✅ **Fixed Critical Bug** - Now generates unique IOID for each auction cycle
- ✅ **Auction-Specific Tracking** - Prevents IOID reuse across multiple auctions
- ✅ **Follows Transaction ID Pattern** - Uses same uniqueness approach as Prebid's native TIDs
- ✅ **Prebid 8 Compatibility** - Maintains all v3.2.9 compatibility features
- ✅ **Production Ready** - Professional code cleanup for enterprise deployment

## 📌 Module Details

- **Module Name:** `exchainAnalyticsAdapter`
- **Maintainer:** [admin@exchain.co](mailto:admin@exchain.co)
- **Latest Version:** `v3.2.10`
- **Module Type:** Analytics Adapter

## ✨ Key Features

- 🔒 Privacy-first UUID injection with **no tracking**
- ⚡ Zero-latency, **pre-auction configuration**
- 🧩 Seamless Prebid.js integration — no config needed
- 🧠 Intelligent injection: **unique IOID per auction**
- 🔄 Compatible with **all Prebid bidders**

## 🧰 Installation & Integration

### 1. Prerequisites

```bash
git clone https://github.com/prebid/Prebid.js.git
cd Prebid.js
npm install
```

### 2. Add the Exchain Adapter

```bash
# Download latest Exchain module
wget https://raw.githubusercontent.com/Exchain-Pte-Ltd/exchain-analytics-adapter/main/src/exchainAnalyticsAdapter/exchainAnalyticsAdapter.js -O modules/exchainAnalyticsAdapter.js
```

### 3. Build Prebid.js with the Module

```bash
gulp build --modules=exchainAnalyticsAdapter
```

### 4. Include in Your HTML

```html
<script src="./build/dist/prebid.js"></script>
```

## ✅ How It Works

Once included:

1. The module **pre-generates a unique UUID (IOID)** for each auction using secure random APIs
2. It adds the IOID to:
   - `ortb2.site.ext.data.ioids = [<uuid>]`
   - `ortb2.site.keywords += "ioid=<uuid>"`
3. This happens **automatically** every time `pbjs.requestBids()` is called
4. **Each auction gets a fresh, unique IOID** (like Transaction IDs)

### Example Output

```js
// First auction
pbjs.getConfig('ortb2').site.ext.data.ioids
// → ["de305d54-75b4-431b-adb2-eb6b9e546014"]

// Second auction (different IOID)
pbjs.getConfig('ortb2').site.ext.data.ioids
// → ["8f7a3b21-c456-4789-9012-3456789abcde"]
```

## 💡 Example Integration

```js
pbjs.que.push(function () {
  pbjs.addAdUnits([...]);
  pbjs.requestBids({
    bidsBackHandler: function () {
      googletag.cmd.push(function () {
        pbjs.setTargetingForGPTAsync();
        googletag.pubads().refresh();
      });
    }
  });
});
```

The IOID will already be present in `ortb2` **before** the auction begins, and will be **unique for each auction**.

## 🔐 Privacy & Compliance

The Exchain module is privacy-compliant by design:

- ❌ No cookies or local storage
- ❌ No personal data collection
- ✅ Fresh, random UUID per auction
- ✅ No cross-session tracking
- ✅ Fully compliant with GDPR, CCPA, and other regulations

## 🛠️ Troubleshooting & Debugging

- ✅ Console logs show module version and IOID state
- ✅ You can verify initialization by checking:
  ```js
  pbjs.installedModules.includes('exchainAnalyticsAdapter');
  pbjs.getConfig('ortb2').site.ext.data.ioids;
  ```

- ✅ Test IOID uniqueness:
  ```js
  // Debug utility to verify unique generation
  pbjs.modules.exchainAnalyticsAdapter.debug.testIOIDUniqueness();
  ```

- ⚠️ If IOIDs are missing:
  - Ensure `prebid.js` is loaded before the module
  - Check browser compatibility (requires `crypto.getRandomValues`)
  - Verify no conflicting analytics modules

## 📦 Advanced Configuration (Optional)

```js
// Optional global config
window.exchainConfig = {
  enabled: true  // Set to false to disable
};
```

## 📞 Support

For questions or integration support, please contact:  
📧 [admin@exchain.co](mailto:admin@exchain.co)

## 🪪 License

Licensed under the Apache License, Version 2.0  
See [LICENSE.md](LICENSE.md) for details.

---

**Latest Stable Version: v3.2.10**  
Status: ✅ Production Ready