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
