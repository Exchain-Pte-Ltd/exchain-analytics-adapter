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

// ExChain Analytics v3.2 Demo - Console logging for verification
console.log('🚀 ExChain Analytics Adapter v3.2 Demo Starting...');

pbjs.que.push(function() {
  console.log('📋 Prebid.js ready, adding ad units...');
  
  // Add event listener to show when IOIDs are generated
  pbjs.onEvent('beforeRequestBids', function() {
    console.log('⚡ beforeRequestBids event fired - ExChain adapter should generate IOID');
    
    // Log the ORTB2 configuration to show IOID placement
    setTimeout(function() {
      const ortb2 = pbjs.getConfig('ortb2');
      if (ortb2 && ortb2.site && ortb2.site.ext && ortb2.site.ext.data && ortb2.site.ext.data.ioids) {
        console.log('✅ ExChain IOID successfully generated!');
        console.log('📍 IOID in ortb2.site.ext.data.ioids:', ortb2.site.ext.data.ioids);
        console.log('🔤 IOID in ortb2.site.keywords:', ortb2.site.keywords);
      } else {
        console.warn('⚠️ No IOID found in ORTB2 configuration');
      }
    }, 50);
  });

  pbjs.addAdUnits(adUnits);
  console.log('🎯 Requesting bids - this will trigger IOID generation...');
  
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

// Log instructions for users
console.log(`
🔍 ExChain Analytics v3.2 Demo Instructions:
   1. Open browser DevTools Console to see IOID generation
   2. Look for "✅ ExChain IOID successfully generated!" message
   3. Check the IOID values in ortb2.site.ext.data.ioids and ortb2.site.keywords
   4. Each page refresh generates a new IOID for the auction
`);
