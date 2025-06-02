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

✅ **Production-ready** - Clean, minimal code optimized for reliability  
✅ **Single IOID per auction** - More efficient than per-impression approach  
✅ **Global ORTB2 placement** in two standard locations:
- `ortb2.site.ext.data.ioids` (array with single element)
- `ortb2.site.keywords` (appended as "ioid={uuid}")

✅ **Self-contained** - No external dependencies required  
✅ **Standard integration** - Uses Prebid.js `beforeRequestBids` event  
✅ **Secure generation** - Utilizes crypto APIs for reliable UUID creation

## How It Works

The Exchain IOID is an anonymous, unique, and tamper-proof identifier that is appended to RTB ad requests by publishers. This solution tackles programmatic ecosystem challenges by reducing bidstream bloat, improving sustainability, and minimizing wasted ad spend. The adapter automatically generates and appends a UUID to bid requests, leveraging secure cryptographic APIs and integrating seamlessly with Prebid.js.

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

## 🧪 Beta Testing Program

- **Environment**: Test/staging environments only
- **Feedback**: Report to [admin@exchain.co](mailto:admin@exchain.co)
- **Current Version**: v3.2.0 (Latest Release)

## ⚠️ Important Notes

- **Beta testing only** - Not for production use
- **Test environments only** - Do not deploy in live advertising environments
- **Data collection**: Analytics collected for improvement purposes
- **Support**: Available during business hours

## 📞 Support & Contact

- **Issues & Questions**: [admin@exchain.co](mailto:admin@exchain.co)
- **Documentation**: This README and inline code comments
- **Example**: See `example/index.html` for working demonstration

## License

Licensed under the Apache License, Version 2.0. See [LICENSE.md](LICENSE.md) for details.

---

**Current Version: v3.2.0** | **Released**: Latest | **Status**: Beta Testing
