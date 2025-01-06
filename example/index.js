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

pbjs.que.push(function() {
  pbjs.addAdUnits(adUnits);
  pbjs.requestBids({
    bidsBackHandler: initAdserver
  });
});

function initAdserver() {
  if (pbjs.initAdserverSet) return;
  pbjs.initAdserverSet = true;
  googletag.cmd.push(function() {
    pbjs.setTargetingForGPTAsync && pbjs.setTargetingForGPTAsync();
    googletag.pubads().refresh();
  });
}

setTimeout(function() {
  initAdserver();
}, PREBID_TIMEOUT);

googletag.cmd.push(function() {
  googletag.defineSlot('/19968336/header-bid-tag-1', sizes, 'div-1')
    .addService(googletag.pubads());
  googletag.pubads().enableSingleRequest();
  googletag.enableServices();
});
