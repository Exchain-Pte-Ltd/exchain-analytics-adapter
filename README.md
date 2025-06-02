# Exchain Analytics Adapter

## 📋 Available Versions

### Version 3.2 (Latest Release)
- **Branch**: `main`
- **Status**: ✅ Latest beta release
- **Download**: [v3.2.0 Release](https://github.com/Exchain-Pte-Ltd/exchain-analytics-adapter/releases/tag/v3.2.0)
- **For**: All beta testing and implementation

### Version 2.5 (Legacy - Version History)
- **Branch**: `release/v2.5` 
- **Tag**: `v2.5.0`
- **Status**: 📦 Archived for version control history
- **Download**: [v2.5.0 Archive](https://github.com/Exchain-Pte-Ltd/exchain-analytics-adapter/releases/tag/v2.5.0)
- **For**: Version history reference only

## 🚀 Installation Instructions

### Standard Installation (v3.2 - Latest)
📦 **Recommended for all new implementations**

```bash
# Clone latest version
git clone https://github.com/Exchain-Pte-Ltd/exchain-analytics-adapter.git
cd exchain-analytics-adapter
npm install
npm run build

# Include the generated main.js file
<script src="./dist/main.js"></script>
```

### Legacy Version Access (v2.5 - Archive)
📂 **For version history reference only**

```bash
# Option 1: Clone legacy branch
git clone -b release/v2.5 https://github.com/Exchain-Pte-Ltd/exchain-analytics-adapter.git

# Option 2: Clone and checkout legacy tag
git clone https://github.com/Exchain-Pte-Ltd/exchain-analytics-adapter.git
git checkout v2.5.0

cd exchain-analytics-adapter
npm install
npm run build
```

## Overview

Welcome to the **Exchain Analytics Adapter** repository! This custom Prebid.js module provides a unique solution for enhancing tracking and analytics in programmatic advertising by appending a tamper-proof identifier to bid requests. It serves as both the **Exchain Impression Opportunity Identifier (IOID) Module** and the **Exchain Analytics Adapter**, offering a streamlined integration for publishers.

- **Module Name:** Exchain Impression Opportunity Identifier Module (Exchain IOID Module) / Exchain Analytics Adapter
- **Module Type:** Analytics Adapter
- **Maintainer:** [admin@exchain.co](mailto:admin@exchain.co)
- **Purpose:** To generate an anonymous, unique, and tamper-proof identifier (UUID) appended to RTB ad requests, addressing challenges in bidstream bloat, sustainability, and wasted ad spend while enabling enhanced tracking and analytics.

## Description

The Exchain IOID is an anonymous, unique, and tamper-proof identifier that is appended to RTB ad requests by publishers. This solution tackles programmatic ecosystem challenges by reducing bidstream bloat, improving sustainability, and minimizing wasted ad spend. The Exchain Analytics Adapter builds on this by automatically generating and appending a UUID to bid requests, leveraging secure cryptographic APIs for UUID generation, and integrating seamlessly with Prebid.js.

## Features

- Automatically generates and appends a UUID to bids before requests are sent.
- Seamlessly integrates with Prebid.js as part of the Real Time Data (RTD) and Analytics modules.
- Addresses programmatic advertising challenges like bidstream bloat and wasted ad spend.
- Utilizes secure crypto APIs for reliable UUID generation.
- Configurable via Prebid.js setConfig and enableAnalytics functions.

## 📝 Version History & Changes

### v3.2.0 (Latest Release)
- **Release Date**: [Current]
- **Status**: Latest beta release
- **Key Changes**:
  - [To be updated with v3.2 specific improvements]
  - [New features to be listed]
  - [Performance enhancements]
- **Migration Notes**: [Instructions for upgrading from previous versions]

### v2.5.0 (Legacy Archive)
- **Release Date**: [Previous]
- **Status**: Archived for version history
- **Features**: 
  - UUID generation and appending to bid requests
  - Prebid.js RTD and Analytics module integration
  - Secure cryptographic API utilization

## 🧪 Beta Testing Program

### Current Beta Testing (v3.2):
- **Environment**: Test/staging environments only
- **Duration**: [Testing period]
- **Feedback**: Report to [admin@exchain.co](mailto:admin@exchain.co)
- **Focus Areas**: [Specific areas for v3.2 feedback]

## Integration

### 1. Import the Prebid Module

You can include it as a script tag in your HTML:

```html
<script src="https://cdn.jsdelivr.net/npm/prebid.js@latest/dist/not-for-prod/prebid.js"></script>  
```

You should not use this URL in production.

Refer to [Prebid.js Getting Started Documentation](https://docs.prebid.org/dev-docs/getting-started.html) for more details on the process.

### 2. Build and import the Exchain Analytics Adapter

To build the Exchain Analytics Adapter, run the following commands:

```bash
npm install
npm run build
```

Then you will need to include the generated `main.js` file in your HTML:

```html
<script src="../dist/main.js"></script>
```

## ⚠️ Important Notes

- **Current version is in beta testing** - not for production use
- **Test environments only** - do not deploy in live advertising environments
- **Data collection**: Analytics collected for improvement
- **Support**: Available during business hours

## 📞 Support
- **v3.2 Beta Issues**: [admin@exchain.co](mailto:admin@exchain.co)
- **General Questions**: [admin@exchain.co](mailto:admin@exchain.co)

## Contact

For more information or support, please contact the maintainer at [admin@exchain.co](mailto:admin@exchain.co).
