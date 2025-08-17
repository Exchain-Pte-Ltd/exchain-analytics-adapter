# ExChain Analytics Adapter v3.2.10 - Integration Example

This example demonstrates the **ExChain Analytics Adapter** working as a **Prebid.js built-in module** (not a standalone package).

## 🔄 New in v3.2.10

**Critical Bug Fix:** Now generates **unique IOID per auction cycle** (previously reused same IOID).
- ✅ Each `pbjs.requestBids()` call generates fresh IOID
- ✅ Follows same pattern as Prebid's Transaction IDs
- ✅ Real-time uniqueness verification in example
- ✅ Enhanced debug utilities for testing

## 📁 Module Structure

```
exchain-analytics-adapter/
├── src/
│   └── exchainAnalyticsAdapter/
│       └── exchainAnalyticsAdapter.js    🎯 Module implementation (v3.2.10)
└── example/
    ├── index.html                        🎯 Demo page with uniqueness testing
    ├── index.js                          🎯 Demo with IOID tracking & debugging  
    └── README.md                         🎯 This guide
```

## 🚀 Quick Start

### 1. Build Prebid.js with ExChain Module

```bash
# Clone Prebid.js source
git clone https://github.com/prebid/Prebid.js.git
cd Prebid.js

# Download ExChain v3.2.10 module
curl -o modules/exchainAnalyticsAdapter.js \
  https://raw.githubusercontent.com/Exchain-Pte-Ltd/exchain-analytics-adapter/main/src/exchainAnalyticsAdapter/exchainAnalyticsAdapter.js

# Build Prebid with ExChain + your bidders
gulp build --modules=exchainAnalyticsAdapter,appnexus,rubicon
# Replace 'appnexus,rubicon' with your actual bidders
```

### 2. Copy Built File to Example

```bash
# Copy the built Prebid.js to this example directory
cp build/dist/prebid.js /path/to/exchain-analytics-adapter/example/prebid.js
```

### 3. Run Example

```bash
# Serve the example (required due to CORS/module loading)
cd /path/to/exchain-analytics-adapter/example

# Option 1: Python HTTP server
python -m http.server 8000
# Then visit: http://localhost:8000

# Option 2: Node.js HTTP server
npx http-server -p 8000
# Then visit: http://localhost:8000

# Option 3: PHP built-in server
php -S localhost:8000
# Then visit: http://localhost:8000
```

## 🔍 What the Example Shows

### v3.2.10 Features Demonstrated
- **Unique IOID Generation**: Each auction gets different IOID
- **Real-time Uniqueness Verification**: Automatic duplicate detection
- **IOID History Tracking**: Shows all generated IOIDs
- **Debug Utilities**: Test uniqueness with built-in functions

### Real-time Console Logging
Open browser **DevTools Console** to see:
- ✅ **Module Loading**: Confirmation that ExChain v3.2.10 is in Prebid build
- ⚡ **Event Trigger**: `auctionInit` event fires ExChain IOID generation
- 🔍 **ORTB2 Injection**: IOIDs placed in `ortb2.site.ext.data.ioids` array
- 🔤 **Keywords Injection**: IOIDs appended to `ortb2.site.keywords` string
- 🎉 **Uniqueness Confirmation**: "UNIQUE IOID confirmed!" messages
- 💰 **Bid Responses**: Confirmation IOIDs are included in bid requests

### ORTB2 Structure Generated
The module places IOIDs in exactly these locations:
```javascript
{
  "ortb2": {
    "site": {
      "ext": {
        "data": {
          "ioids": ["550e8400-e29b-41d4-a716-446655440000"]  // Fresh UUID per auction
        }
      },
      "keywords": "existing,keywords,ioid=550e8400-e29b-41d4-a716-446655440000"  // Updated per auction
    }
  }
}
```

### Expected Console Output (v3.2.10)
```
🚀 ExChain Analytics Adapter v3.2.10 Demo Starting...
📦 Module is built into Prebid.js - no separate loading required!
🔄 New in v3.2.10: Unique IOID per auction cycle!
📋 Prebid.js ready, checking for ExChain module...
✅ ExChain Analytics Adapter v3.2.10 successfully loaded in Prebid build
🧪 Debug utilities available for IOID uniqueness testing
🎯 Adding ad units and requesting bids...
⚡ beforeRequestBids event fired (Auction #1) - ExChain adapter should generate unique IOID
🎯 Auction abc123-456-789 initialized - checking for unique IOID generation
✅ ExChain IOID successfully generated and injected!
🔍 Current IOID: 550e8400-e29b-41d4-a716-446655440000
📍 IOID in ortb2.site.ext.data.ioids: ["550e8400-e29b-41d4-a716-446655440000"]
🔤 IOID in ortb2.site.keywords: "ioid=550e8400-e29b-41d4-a716-446655440000"
🎉 UNIQUE IOID confirmed! (1 unique IOIDs generated so far)
💰 Bid received from appnexus - IOID should be in request
🏁 Bids received, initializing ad server...
📡 Ad server initialized and ads requested
📺 Google Ad Manager configured and services enabled
```

## 🧪 Testing IOID Uniqueness (v3.2.10)

### Automated Testing Functions
The example provides built-in testing functions:

```javascript
// Test multiple auctions for uniqueness
testMultipleAuctions()

// Full debug information with uniqueness test
debugExchain()

// Built-in v3.2.10 debug utility
pbjs.modules.exchainAnalyticsAdapter.debug.testIOIDUniqueness()
```

### Manual Testing Commands
```javascript
// Check current IOID
pbjs.getConfig('ortb2').site.ext.data.ioids[0]

// Trigger new auction and verify different IOID
pbjs.requestBids(); 
setTimeout(() => console.log('New IOID:', pbjs.getConfig('ortb2').site.ext.data.ioids[0]), 1000);

// Compare multiple IOIDs
const ioid1 = pbjs.getConfig('ortb2').site.ext.data.ioids[0];
pbjs.requestBids();
setTimeout(() => {
  const ioid2 = pbjs.getConfig('ortb2').site.ext.data.ioids[0];
  console.log('IOID 1:', ioid1);
  console.log('IOID 2:', ioid2);
  console.log('Unique:', ioid1 !== ioid2 ? '✅ YES' : '❌ NO');
}, 1000);
```

## 🛠 Troubleshooting

### "ExChain module not found in installedModules"
**Problem:** Module wasn't included in Prebid build  
**Solution:** 
```bash
# Make sure you included exchainAnalyticsAdapter in build command
gulp build --modules=exchainAnalyticsAdapter,yourBidder1,yourBidder2

# Verify module file exists before building
ls -la modules/exchainAnalyticsAdapter.js

# Check for v3.2.10 in file
grep "3.2.10" modules/exchainAnalyticsAdapter.js
```

### "Duplicate IOIDs detected" (v3.2.10 specific)
**Problem:** Same IOID appearing across multiple auctions  
**Cause:** Using old v3.2.9 or earlier version  
**Solution:**
1. **Verify v3.2.10**: Check console logs for "v3.2.10" version string
2. **Re-download module**: Ensure you have latest v3.2.10 file
3. **Rebuild Prebid**: Clean build with latest module
4. **Clear cache**: Hard refresh browser (Ctrl+Shift+R)

### "No IOID found in ORTB2 configuration"
**Problem:** Module loaded but not generating IOIDs  
**Solution:**
1. **Check console for initialization errors**
2. **Run manual debugging**: `debugExchain()` in browser console
3. **Verify crypto availability**: Ensure `crypto.getRandomValues` exists
4. **Test debug utilities**: `pbjs.modules.exchainAnalyticsAdapter.debug.isReady()`

### Build Errors in Prebid.js
**Problem:** Gulp build fails with ExChain module  
**Solution:**
```bash
# Test with minimal build first
gulp build --modules=exchainAnalyticsAdapter

# Check for JavaScript syntax errors
node -c modules/exchainAnalyticsAdapter.js

# Verify v3.2.10 file integrity
grep "MODULE_VERSION = '3.2.10'" modules/exchainAnalyticsAdapter.js
```

## 🔧 Manual Debugging & Testing

### Enhanced Debug Helper Function (v3.2.10)
```javascript
// Run in browser console
debugExchain()

// Output shows:
// 🔧 ExChain v3.2.10 Debug Info:
// 📦 Installed modules: ["core", "exchainAnalyticsAdapter", "appnexus"]
// ⚙️ Current ORTB2: { site: { ext: { data: { ioids: [...] } } } }
// 🎯 Ad units: [...]
// 📊 Generated IOIDs this session: ["uuid1", "uuid2", "uuid3"]
// 🔢 Auction count: 3
// 🧪 Testing IOID uniqueness...
// 🧪 Uniqueness test result: { allUnique: true, totalGenerated: 3, uniqueGenerated: 3 }
```

### Network Request Verification
1. **Open DevTools → Network tab**
2. **Filter by "XHR" or "Fetch"**
3. **Look for bid requests** to your SSPs/exchanges
4. **Check request URLs/payloads** for IOID values
5. **Each auction should have a different IOID**

## 📋 Version Comparison

| v3.2.9 (Broken) | v3.2.10 (Fixed) |
|------------------|------------------|
| ❌ Reuses same IOID | ✅ Unique IOID per auction |
| ❌ Single UUID for all auctions | ✅ Fresh UUID per `requestBids()` |
| ❌ No uniqueness tracking | ✅ Built-in uniqueness verification |
| ❌ Limited debugging | ✅ Enhanced debug utilities |
| ❌ Race condition issues | ✅ Auction-specific tracking |

## 🎯 Expected Behavior Flow (v3.2.10)

1. **Page Load**: Prebid.js loads with ExChain v3.2.10 module
2. **Module Registration**: ExChain registers with `pbjs.installedModules`
3. **Initial IOID**: Module generates first IOID immediately
4. **Ad Unit Setup**: Publisher adds ad units via `pbjs.addAdUnits()`
5. **First Auction**: Publisher calls `pbjs.requestBids()` 
6. **IOID Generation**: ExChain generates **unique** UUIDv4 for this auction
7. **ORTB2 Injection**: Fresh IOID placed in global ORTB2 config
8. **Bid Requests**: All bidders receive **unique** IOID in requests
9. **Subsequent Auctions**: Each `requestBids()` gets **different** IOID
10. **Console Logs**: Detailed logging confirms uniqueness

## 📞 Support & Feedback

- **Integration Questions**: admin@exchain.co  
- **GitHub Issues**: https://github.com/Exchain-Pte-Ltd/exchain-analytics-adapter/issues
- **Version**: v3.2.10 (Production Ready)

## ✅ Production Ready

- **Status**: ✅ Production Ready (v3.2.10)
- **Critical Bug Fixed**: Unique IOID generation implemented
- **Prebid Compatibility**: 8, 9, 10+
- **Testing**: Comprehensive uniqueness verification included

---

**✅ This example works with Prebid.js builds that include the ExChain Analytics Adapter v3.2.10 module.**  
**🎯 Key Feature: Each auction cycle now generates a unique IOID, fixing the critical reuse bug from previous versions.**