# Exchain Analytics Adapter (Exchain IOID Module)

Welcome to the **Exchain Analytics Adapter** repository! This custom Prebid.js module provides a unique solution for enhancing tracking and analytics in programmatic advertising by appending a tamper-proof identifier to bid requests. It serves as both the **Exchain Impression Opportunity Identifier (IOID) Module** and the **Exchain Analytics Adapter**, offering a streamlined integration for publishers.

## Overview

- **Module Name:** Exchain Impression Opportunity Identifier Module (Exchain IOID Module) / Exchain Analytics Adapter
- **Module Type:** Analytics Adapter
- **Maintainer:** [admin@exchain.co ](mailto:admin@exchain.co )
- **Purpose:** To generate an anonymous, unique, and tamper-proof identifier (UUID) appended to RTB ad requests, addressing challenges in bidstream bloat, sustainability, and wasted ad spend while enabling enhanced tracking and analytics.

## Description

The Exchain IOID is an anonymous, unique, and tamper-proof identifier that is appended to RTB ad requests by publishers. This solution tackles programmatic ecosystem challenges by reducing bidstream bloat, improving sustainability, and minimizing wasted ad spend. The Exchain Analytics Adapter builds on this by automatically generating and appending a UUID to bid requests, leveraging secure cryptographic APIs for UUID generation, and integrating seamlessly with Prebid.js.

## Features

- Automatically generates and appends a UUID to bids before requests are sent.
- Seamlessly integrates with Prebid.js as part of the Real Time Data (RTD) and Analytics modules.
- Addresses programmatic advertising challenges like bidstream bloat and wasted ad spend.
- Utilizes secure crypto APIs for reliable UUID generation.
- Configurable via Prebid.js setConfig and enableAnalytics functions.

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



## Contact

For more information or support, please contact the maintainer at [admin@exchain.co](mailto:admin@exchain.co).
