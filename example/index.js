// ExChain Analytics Adapter v3.2.1 - Prebid Build Demo
// This demo shows the ExChain module working when built into Prebid.js

var sizes = [
  [300, 250]
];
var PREBID_TIMEOUT = 700;

var adUnits = [{
  code: '/19968336/header-bid-tag-1',
  mediaTypes: {
    banner: {
      sizes: sizes
    }
  },
  bids: [{
    bidder: 'appnexus',
    params: {
      placementId: 13144370
    }
  }]
}];

// ======== DO NOT EDIT BELOW THIS LINE =========== //
var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
googletag.cmd.push(function() {
  googletag.pubads().disableInitialLoad();
});

var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

// ExChain Analytics v3.2.1 Demo - Built into Prebid.js
console.log('🚀 ExChain Analytics Adapter v3.2.1 Demo Starting...');
console.log('📦 Module is built into Prebid.js - no separate loading required!');

// Check if ExChain module is available
pbjs.que.push(function() {
  console.log('📋 Prebid.js ready, checking for ExChain module...');
  
  // Check if module is properly loaded
  if (pbjs.installedModules && pbjs.installedModules.includes('exchainAnalyticsAdapter')) {
    console.log('✅ ExChain Analytics Adapter successfully loaded in Prebid build');
  } else {
    console.warn('⚠️ ExChain module not found in installedModules. Did you build Prebid with --modules=exchainAnalyticsAdapter?');
    console.log('🔧 Build command: gulp build --modules=exchainAnalyticsAdapter,appnexus');
  }
  
  // Add event listener to show when IOIDs are generated
  pbjs.onEvent('beforeRequestBids', function() {
    console.log('⚡ beforeRequestBids event fired - ExChain adapter should generate IOID automatically');
    
    // Log the ORTB2 configuration to show IOID placement
    setTimeout(function() {
      const ortb2 = pbjs.getConfig('ortb2');
      if (ortb2 && ortb2.site && ortb2.site.ext && ortb2.site.ext.data && ortb2.site.ext.data.ioids) {
        console.log('✅ ExChain IOID successfully generated and injected!');
        console.log('📍 IOID in ortb2.site.ext.data.ioids:', ortb2.site.ext.data.ioids);
        console.log('🔤 IOID in ortb2.site.keywords:', ortb2.site.keywords);
        console.log('🔬 Full ORTB2 site config:', ortb2.site);
      } else {
        console.warn('⚠️ No IOID found in ORTB2 configuration');
        console.log('🐛 Debug: ortb2.site structure:', ortb2?.site);
      }
    }, 50);
  });

  // Add bid response event for additional debugging
  pbjs.onEvent('bidResponse', function(bid) {
    console.log('💰 Bid received from', bid.bidder, '- IOID should be in request');
  });

  console.log('🎯 Adding ad units and requesting bids...');
  pbjs.addAdUnits(adUnits);
  
  pbjs.requestBids({
    bidsBackHandler: initAdserver
  });
});

function initAdserver() {
  if (pbjs.initAdserverSet) return;
  pbjs.initAdserverSet = true;
  
  console.log('🏁 Bids received, initializing ad server...');
  
  googletag.cmd.push(function() {
    pbjs.setTargetingForGPTAsync && pbjs.setTargetingForGPTAsync();
    googletag.pubads().refresh();
    console.log('📡 Ad server initialized and ads requested');
  });
}

setTimeout(function() {
  console.log('⏰ Timeout reached, initializing ad server...');
  initAdserver();
}, PREBID_TIMEOUT);

googletag.cmd.push(function() {
  googletag.defineSlot('/19968336/header-bid-tag-1', sizes, 'div-1')
    .addService(googletag.pubads());
  googletag.pubads().enableSingleRequest();
  googletag.enableServices();
  console.log('📺 Google Ad Manager configured and services enabled');
});

// Enhanced logging for debugging
console.log(`
🔍 ExChain Analytics v3.2.1 Demo Instructions:
   
   📋 Setup:
   1. Build Prebid: gulp build --modules=exchainAnalyticsAdapter,appnexus
   2. Copy built prebid.js to this directory
   3. Open this page with DevTools Console
   
   🔬 What to Check:
   1. Look for "✅ ExChain IOID successfully generated!" message
   2. Check IOID values in ortb2.site.ext.data.ioids (array)
   3. Check IOID in ortb2.site.keywords (string format)
   4. Each page refresh generates a new IOID
   
   🐛 Troubleshooting:
   - No IOID? Check if module was included in Prebid build
   - Run: pbjs.installedModules to see loaded modules
   - Run: pbjs.getConfig('ortb2') to inspect ORTB2 structure
`);

// Helper function for manual debugging
window.debugExchain = function() {
  console.log('🔧 ExChain Debug Info:');
  console.log('📦 Installed modules:', pbjs.installedModules);
  console.log('⚙️ Current ORTB2:', pbjs.getConfig('ortb2'));
  console.log('🎯 Ad units:', pbjs.getAdUnits());
};

console.log('💡 Run debugExchain() in console for manual debugging');
