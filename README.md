# Exchain Analytics Adapter

[![Latest Release](https://img.shields.io/github/v/release/Exchain-Pte-Ltd/exchain-analytics-adapter)](https://github.com/Exchain-Pte-Ltd/exchain-analytics-adapter/releases)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE.md)

## 🚀 Quick Start

```bash
# 1. Get Prebid.js source code
git clone https://github.com/prebid/Prebid.js.git
cd Prebid.js

# 2. Copy the Exchain module
wget https://raw.githubusercontent.com/Exchain-Pte-Ltd/exchain-analytics-adapter/main/src/exchainAnalyticsAdapter/exchain_analytics_v3.2.8.js -O modules/exchainAnalyticsAdapter.js

# 3. Build Prebid.js with the module
npm install
gulp build --modules=exchainAnalyticsAdapter

# 4. Include in your HTML
<script src="./build/dist/prebid.js"></script>
```

## 🔍 Overview

Welcome to the **Exchain Analytics Adapter**!  
This Prebid.js module introduces a **Pre-Generated IOID (Impression Opportunity ID)** that is:

- Cryptographically secure
- Injected **before** any auction starts
- Compliant with Prebid.js standards
- Automatically added to `ortb2.site.ext.data.ioids` and `ortb2.site.keywords`

### 🔄 What’s New in v3.2.8

> Version 3.2.8 introduces a **race-condition-free implementation** using a **pre-auction generation hook**, similar to how Prebid assigns transaction IDs.

- ✅ **IOID is injected *before* `requestBids()`**
- ✅ **No reliance on Prebid events (e.g. `beforeRequestBids`)**
- ✅ **Same installation method as v3.2.0**
- ✅ **No behavior changes for publishers**
- ✅ **Multi-phase fallback strategy** ensures reliable initialization

## 📌 Module Details

- **Module Name:** `exchainAnalyticsAdapter`
- **Maintainer:** [admin@exchain.co](mailto:admin@exchain.co)
- **Latest Version:** `v3.2.8`
- **Module Type:** Analytics Adapter

## ✨ Key Features

- 🔒 Privacy-first UUID injection with **no tracking**
- ⚡ Zero-latency, **pre-auction configuration**
- 🧩 Seamless Prebid.js integration — no config needed
- 🧠 Intelligent injection: won't overwrite existing IOIDs
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
wget https://raw.githubusercontent.com/Exchain-Pte-Ltd/exchain-analytics-adapter/main/src/exchainAnalyticsAdapter/exchain_analytics_v3.2.8.js -O modules/exchainAnalyticsAdapter.js
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

1. The module **pre-generates a UUID (IOID)** using secure random APIs
2. It adds the IOID to:
   - `ortb2.site.ext.data.ioids = [<uuid>]`
   - `ortb2.site.keywords += "ioid=<uuid>"`
3. This happens **automatically** every time `pbjs.requestBids()` is called

### Example Output

```js
pbjs.getConfig('ortb2').site.ext.data.ioids
// → ["de305d54-75b4-431b-adb2-eb6b9e546014"]

pbjs.getConfig('ortb2').site.keywords
// → "...existing_keywords...,ioid=de305d54-75b4-431b-adb2-eb6b9e546014"
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

The IOID will already be present in `ortb2` **before** the auction begins.

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

- ⚠️ If IOIDs are missing:
  - Ensure `prebid.js` is loaded before the module
  - Confirm no IOID is already present
  - Check browser compatibility (requires `crypto.getRandomValues`)

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

**Latest Stable Version: v3.2.8**  
Status: ✅ Production Ready
