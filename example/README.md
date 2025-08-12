# ExChain Analytics Adapter v3.2.9 - Integration Example

This example demonstrates the **ExChain Analytics Adapter** working as a **Prebid.js built-in module** (not a standalone package).

## 📁 Module Structure

```
exchain-analytics-adapter/
├── src/
│   ├── index.js                          🎯 Prebid module entry point
│   └── exchainAnalyticsAdapter/
│       └── exchainAnalyticsAdapter.js    🎯 Module implementation
└── example/
    ├── index.html                        🎯 Demo page
    ├── index.js                          🎯 Demo with debugging  
    └── README.md                         🎯 This guide
```

## 🚀 Quick Start

### 1. Build Prebid.js with ExChain Module

You have **two options** for copying the ExChain module to your Prebid build:

#### **Option A: Copy Entry Point** (Recommended)
```bash
# Clone Prebid.js source
git clone https://github.com/prebid/Prebid.js.git
cd Prebid.js

# Download ExChain module entry point
curl -o modules/exchainAnalyticsAdapter.js \
  https://raw.githubusercontent.com/Exchain-Pte-Ltd/exchain-analytics-adapter/main/src/index.js

# Build Prebid with ExChain + your bidders
gulp build --modules=exchainAnalyticsAdapter,appnexus,rubicon
# Replace 'appnexus,rubicon' with your actual bidders
```

#### **Option B: Copy Implementation Directly** (Alternative)
```bash
# Clone Prebid.js source
git clone https://github.com/prebid/Prebid.js.git
cd Prebid.js

# Download ExChain module implementation directly
curl -o modules/exchainAnalyticsAdapter.js \
  https://raw.githubusercontent.com/Exchain-Pte-Ltd/exchain-analytics-adapter/main/src/exchainAnalyticsAdapter/exchainAnalyticsAdapter.js

# Build Prebid with ExChain + your bidders
gulp build --modules=exchainAnalyticsAdapter,appnexus,rubicon
```

#### **Option C: Local Development** (If you have the repo)
```bash
# Clone Prebid.js source
git clone https://github.com/prebid/Prebid.js.git
cd Prebid.js

# Copy from local ExChain repo (choose one):
# Entry point approach:
cp /path/to/exchain-analytics-adapter/src/index.js modules/exchainAnalyticsAdapter.js
# OR implementation approach:
cp /path/to/exchain-analytics-adapter/src/exchainAnalyticsAdapter/exchainAnalyticsAdapter.js modules/exchainAnalyticsAdapter.js

# Build
gulp build --modules=exchainAnalyticsAdapter,yourBidder1,yourBidder2
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

### Real-time Console Logging
Open browser **DevTools Console** to see:
- ✅ **Module Loading**: Confirmation that ExChain module is in Prebid build
- ⚡ **Event Trigger**: `beforeRequestBids` event fires ExChain IOID generation
- 📍 **ORTB2 Injection**: IOIDs placed in `ortb2.site.ext.data.ioids` array
- 🔤 **Keywords Injection**: IOIDs appended to `ortb2.site.keywords` string
- 💰 **Bid Responses**: Confirmation IOIDs are included in bid requests

### ORTB2 Structure Generated
The module places IOIDs in exactly these locations:
```javascript
{
  "ortb2": {
    "site": {
      "ext": {
        "data": {
          "ioids": ["550e8400-e29b-41d4-a716-446655440000"]  // Array with single UUID
        }
      },
      "keywords": "existing,keywords,ioid=550e8400-e29b-41d4-a716-446655440000"  // Appended to existing
    }
  }
}
```

### Expected Console Output
```
🚀 ExChain Analytics Adapter v3.2.8 Demo Starting...
📦 Module is built into Prebid.js - no separate loading required!
📋 Prebid.js ready, checking for ExChain module...
✅ ExChain Analytics Adapter successfully loaded in Prebid build
🎯 Adding ad units and requesting bids...
⚡ beforeRequestBids event fired - ExChain adapter should generate IOID automatically
✅ ExChain IOID successfully generated and injected!
📍 IOID in ortb2.site.ext.data.ioids: ["550e8400-e29b-41d4-a716-446655440000"]
🔤 IOID in ortb2.site.keywords: "ioid=550e8400-e29b-41d4-a716-446655440000"
🔬 Full ORTB2 site config: {ext: {data: {ioids: Array(1)}}, keywords: "ioid=550e8400-e29b-41d4-a716-446655440000"}
💰 Bid received from appnexus - IOID should be in request
🏁 Bids received, initializing ad server...
📡 Ad server initialized and ads requested
📺 Google Ad Manager configured and services enabled
```

## 🐛 Troubleshooting

### "ExChain module not found in installedModules"
**Problem:** Module wasn't included in Prebid build  
**Cause:** Build command missing `exchainAnalyticsAdapter`  
**Solution:** 
```bash
# Make sure you included exchainAnalyticsAdapter in build command
gulp build --modules=exchainAnalyticsAdapter,yourBidder1,yourBidder2

# Verify module file exists before building
ls -la modules/exchainAnalyticsAdapter.js

# Check build output for any errors
gulp build --modules=exchainAnalyticsAdapter 2>&1 | grep -i error
```

### "No IOID found in ORTB2 configuration"
**Problem:** Module loaded but not generating IOIDs  
**Cause:** Event not firing or initialization issue  
**Solution:**
1. **Check console for initialization errors**
2. **Run manual debugging**: `debugExchain()` in browser console
3. **Verify event firing**: Look for "beforeRequestBids event fired" message
4. **Check crypto availability**: Ensure `crypto.getRandomValues` exists
5. **Inspect network requests**: IOIDs should appear in bid request URLs

### "prebid.js file not found" or "404 Error"
**Problem:** Built Prebid.js not copied to example directory  
**Cause:** File path incorrect or build failed  
**Solution:**
```bash
# Check if Prebid build was successful
ls -la /path/to/Prebid.js/build/dist/prebid.js

# Copy with full paths
cp /full/path/to/Prebid.js/build/dist/prebid.js /full/path/to/exchain-analytics-adapter/example/prebid.js

# Verify file exists in example directory
ls -la example/prebid.js
```

### "CORS Error" or "Module Loading Failed"
**Problem:** Browser blocking local file access  
**Cause:** Opening HTML file directly instead of serving via HTTP  
**Solution:**
```bash
# Must serve via HTTP server, not file:// protocol
cd example
python -m http.server 8000
# Visit: http://localhost:8000 (not file:///path/to/index.html)
```

### Build Errors in Prebid.js
**Problem:** Gulp build fails with ExChain module  
**Cause:** File syntax or import issues  
**Solution:**
```bash
# Test with minimal build first
gulp build --modules=exchainAnalyticsAdapter

# Check for JavaScript syntax errors
node -c modules/exchainAnalyticsAdapter.js

# Verify file encoding (should be UTF-8)
file modules/exchainAnalyticsAdapter.js
```

## 🔧 Manual Debugging & Testing

### Debug Helper Function
The example provides a helper function for debugging:

```javascript
// Run in browser console
debugExchain()

// Output shows:
// 🔧 ExChain Debug Info:
// 📦 Installed modules: ["core", "exchainAnalyticsAdapter", "appnexus"]
// ⚙️ Current ORTB2: { site: { ext: { data: { ioids: [...] } } } }
// 🎯 Ad units: [...]
```

### Manual Testing Commands
```javascript
// Check if module is loaded
pbjs.installedModules.includes('exchainAnalyticsAdapter')

// Inspect current ORTB2 configuration
pbjs.getConfig('ortb2')

// Check specific IOID locations
const ortb2 = pbjs.getConfig('ortb2');
console.log('IOIDs array:', ortb2?.site?.ext?.data?.ioids);
console.log('Keywords string:', ortb2?.site?.keywords);

// Trigger new auction manually (generates new IOID)
pbjs.requestBids({
  adUnits: pbjs.getAdUnits(),
  bidsBackHandler: () => console.log('New auction complete with fresh IOID')
});
```

### Network Request Verification
1. **Open DevTools → Network tab**
2. **Filter by "XHR" or "Fetch"**
3. **Look for bid requests** to your SSPs/exchanges
4. **Check request URLs/payloads** for IOID values
5. **Each auction should have a unique IOID**

## 📋 Key Differences from v3.2.0

| v3.2.0 (Standalone) | v3.2.8 (Prebid Build) |
|---------------------|------------------------|
| Separate webpack build | Built into Prebid.js |
| `<script src="dist/main.js">` | Included automatically |
| Manual initialization | Auto-initializes |
| External dependency | Self-contained |
| Load order dependency | No load order issues |
| Version conflicts possible | Version tied to Prebid build |

## 📋 Copy Options Comparison

| Approach | File to Copy | Pros | Cons |
|----------|--------------|------|------|
| **Entry Point** | `src/index.js` | ✅ Standard Prebid pattern<br/>✅ Matches v2.5 structure<br/>✅ Clear separation | ❌ Extra import layer |
| **Implementation** | `src/exchainAnalyticsAdapter/exchainAnalyticsAdapter.js` | ✅ Direct implementation<br/>✅ No import overhead<br/>✅ Self-contained | ❌ Bypasses entry point |

**Recommendation:** Use **Entry Point** approach (`src/index.js`) as it follows Prebid standards and matches your v2.5 working structure.

## 🎯 Expected Behavior Flow

1. **Page Load**: Prebid.js loads with ExChain module built-in
2. **Module Registration**: ExChain registers with `pbjs.installedModules`
3. **Event Registration**: Module registers for `beforeRequestBids` event
4. **Ad Unit Setup**: Publisher adds ad units via `pbjs.addAdUnits()`
5. **Bid Request**: Publisher calls `pbjs.requestBids()` 
6. **Event Trigger**: `beforeRequestBids` event fires
7. **IOID Generation**: ExChain generates secure UUIDv4
8. **ORTB2 Injection**: IOID placed in global ORTB2 config
9. **Bid Requests**: All bidders receive IOID in requests
10. **Console Logs**: Detailed logging confirms each step

## 📞 Support & Feedback

- **Beta Testing Issues**: admin@exchain.co
- **Integration Questions**: admin@exchain.co  
- **GitHub Issues**: https://github.com/Exchain-Pte-Ltd/exchain-analytics-adapter/issues
- **Version**: 3.2.9 (Prebid 8 Compatible)

## ⚠️ Beta Testing Notes

- **Current version is in beta testing** - not for production use
- **Test environments only** - do not deploy in live advertising environments  
- **Data collection**: Analytics collected for improvement purposes
- **Feedback requested**: Report any issues or suggestions
- **Support hours**: Available during business hours

---

**✅ This example works with Prebid.js builds that include the ExChain Analytics Adapter module.**  
**🎯 Recommended approach: Copy `src/index.js` to `modules/exchainAnalyticsAdapter.js` in your Prebid build.** 