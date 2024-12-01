{% include_relative src/exchainAnalyticsAdapter/README.md %}

## The Exchain Analytics Adapter is a custom module for Prebid.js that adds a UUID (Universally Unique Identifier) to bid requests. This enables enhanced tracking and analytics for publishers.

# Features
- Automatically generates and appends a UUID to bids before requests are sent.
- Seamlessly integrates with Prebid.js.
- Utilizes secure crypto APIs for UUID generation.

## Instruction to install the Exchain Prebid Adapter

1. Compile the Exchain Prebid Module with modules into your Prebid build. Follow the instructions here: https://docs.prebid.org/dev-docs/getting-started.html

2. Add the compiled `prebid.js` and `path/to/exchainAnalyticsAdapter.js` file to your website

3. Initialize the Module

```javascript
<script>
  pbjs.que.push(function() {
    pbjs.enableAnalytics([{
      provider: 'ExchainAnalyticsAdapter',
      options: {
        // Additional options (if any) can be configured here.
      }
    }]);
  });
</script>
```
