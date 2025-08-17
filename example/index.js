// ExChain Analytics Adapter v3.2.10 - Prebid Build Demo
// This demo shows the ExChain module working when built into Prebid.js
// New in v3.2.10: Unique IOID generation per auction cycle

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

// Track IOIDs to demonstrate uniqueness (v3.2.10 feature)
var generatedIOIDs = [];
var auctionCount = 0;

// ExChain Analytics v3.2.10 Demo - Built into Prebid.js
console.log('🚀 ExChain Analytics Adapter v3.2.10 Demo Starting...');
console.log('📦 Module is built into Prebid.js - no separate loading required!');
console.log('🔄 New in v3.2.10: Unique IOID per auction cycle!');

// Check if ExChain module is available
pbjs.que.push(function() {
  console.log('📋 Prebid.js ready, checking for ExChain module...');
  
  // Check if module is properly loaded
  if (pbjs.installedModules && pbjs.installedModules.includes('exchainAnalyticsAdapter')) {
    console.log('✅ ExChain Analytics Adapter v3.2.10 successfully loaded in Prebid build');
    
    // Test debug utilities (v3.2.10 feature)
    if (pbjs.modules && pbjs.modules.exchainAnalyticsAdapter && pbjs.modules.exchainAnalyticsAdapter.debug) {
      console.log('🧪 Debug utilities available for IOID uniqueness testing');
    }
  } else {
    console.warn('⚠️ ExChain module not found in installedModules. Did you build Prebid with --modules=exchainAnalyticsAdapter?');
    console.log('🔧 Build command: gulp build --modules=exchainAnalyticsAdapter,appnexus');
  }
  
  // Add event listener to track IOID generation per auction
  pbjs.onEvent('beforeRequestBids', function() {
    auctionCount++;
    console.log(`⚡ beforeRequestBids event fired (Auction #${auctionCount}) - ExChain adapter should generate unique IOID`);
  });
  
  // Monitor IOID generation after each auction
  pbjs.onEvent('auctionInit', function(auctionData) {
    console.log(`🎯 Auction ${auctionData.auctionId} initialized - checking for unique IOID generation`);
    
    // Log the ORTB2 configuration to show IOID placement
    setTimeout(function() {
      const ortb2 = pbjs.getConfig('ortb2');
      if (ortb2 && ortb2.site && ortb2.site.ext && ortb2.site.ext.data && ortb2.site.ext.data.ioids) {
        const currentIOID = ortb2.site.ext.data.ioids[0];
        
        console.log('✅ ExChain IOID successfully generated and injected!');
        console.log('🔍 Current IOID:', currentIOID);
        console.log('📍 IOID in ortb2.site.ext.data.ioids:', ortb2.site.ext.data.ioids);
        console.log('🔤 IOID in ortb2.site.keywords:', ortb2.site.keywords);
        
        // Check for uniqueness (v3.2.10 verification)
        if (generatedIOIDs.includes(currentIOID)) {
          console.error('❌ DUPLICATE IOID DETECTED! This should not happen in v3.2.10');
          console.log('🐛 Previous IOIDs:', generatedIOIDs);
        } else {
          generatedIOIDs.push(currentIOID);
          console.log(`🎉 UNIQUE IOID confirmed! (${generatedIOIDs.length} unique IOIDs generated so far)`);
          
          if (generatedIOIDs.length > 1) {
            console.log('📊 All generated IOIDs:', generatedIOIDs);
            console.log('✅ v3.2.10 uniqueness feature working correctly!');
          }
        }
        
        console.log('🔬 Full ORTB2 site config:', ortb2.site);
      } else {
        console.warn('⚠️ No IOID found in ORTB2 configuration');
        console.log('🛠 Debug: ortb2.site structure:', ortb2?.site);
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
🔍 ExChain Analytics v3.2.10 Demo Instructions:
   
   📋 Setup:
   1. Build Prebid: gulp build --modules=exchainAnalyticsAdapter,appnexus
   2. Copy built prebid.js to this directory
   3. Open this page with DevTools Console
   
   🔬 What to Check (v3.2.10 Features):
   1. Look for "✅ ExChain IOID successfully generated!" message
   2. Check IOID values in ortb2.site.ext.data.ioids (array)
   3. Check IOID in ortb2.site.keywords (string format)
   4. 🔄 Each auction should generate a UNIQUE IOID (not reused)
   5. Watch for "🎉 UNIQUE IOID confirmed!" messages
   
   🧪 Test Uniqueness:
   - Refresh page multiple times
   - Run: testMultipleAuctions() to trigger several auctions
   - Check that all IOIDs are different
   
   🛠 Troubleshooting:
   - No IOID? Check if module was included in Prebid build
   - Run: pbjs.installedModules to see loaded modules
   - Run: pbjs.getConfig('ortb2') to inspect ORTB2 structure
   - Run: pbjs.modules.exchainAnalyticsAdapter.debug.testIOIDUniqueness()
`);

// Enhanced helper functions for v3.2.10 testing
window.debugExchain = function() {
  console.log('🔧 ExChain v3.2.10 Debug Info:');
  console.log('📦 Installed modules:', pbjs.installedModules);
  console.log('⚙️ Current ORTB2:', pbjs.getConfig('ortb2'));
  console.log('🎯 Ad units:', pbjs.getAdUnits());
  console.log('📊 Generated IOIDs this session:', generatedIOIDs);
  console.log('🔢 Auction count:', auctionCount);
  
  // Test v3.2.10 debug utilities if available
  if (pbjs.modules && pbjs.modules.exchainAnalyticsAdapter && pbjs.modules.exchainAnalyticsAdapter.debug) {
    console.log('🧪 Testing IOID uniqueness...');
    const uniquenessTest = pbjs.modules.exchainAnalyticsAdapter.debug.testIOIDUniqueness();
    console.log('🧪 Uniqueness test result:', uniquenessTest);
  }
};

// New v3.2.10 test function for multiple auctions
window.testMultipleAuctions = function() {
  console.log('🧪 Testing multiple auctions for IOID uniqueness...');
  
  const testAuctions = 3;
  const testIOIDs = [];
  
  for (let i = 0; i < testAuctions; i++) {
    setTimeout(() => {
      console.log(`🎯 Test auction ${i + 1}/${testAuctions}`);
      
      pbjs.requestBids({
        bidsBackHandler: function() {
          const currentIOID = pbjs.getConfig('ortb2').site.ext.data.ioids[0];
          testIOIDs.push(currentIOID);
          console.log(`📍 Test auction ${i + 1} IOID: ${currentIOID}`);
          
          if (i === testAuctions - 1) {
            // Final test results
            const uniqueIOIDs = [...new Set(testIOIDs)];
            console.log('📊 Test Results:');
            console.log('   Generated IOIDs:', testIOIDs);
            console.log('   Unique IOIDs:', uniqueIOIDs);
            console.log(`   Uniqueness: ${uniqueIOIDs.length}/${testIOIDs.length} unique`);
            
            if (uniqueIOIDs.length === testIOIDs.length) {
              console.log('✅ SUCCESS: All IOIDs are unique! v3.2.10 working correctly');
            } else {
              console.error('❌ FAILURE: Duplicate IOIDs detected! Check v3.2.10 implementation');
            }
          }
        }
      });
    }, i * 1000);
  }
};

console.log('💡 Available functions:');
console.log('   - debugExchain() - Full debug information');
console.log('   - testMultipleAuctions() - Test IOID uniqueness across multiple auctions');
