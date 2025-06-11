# Essential Changes for Prebid Module Integration

## 1. Import Prebid's getGlobal
Replace the custom `getGlobal()` function with Prebid's import at the top of the file:
```javascript
import { getGlobal } from '../src/prebidGlobal.js';
```
Then remove the existing `getGlobal()` function definition.

## 2. Convert generateUUID to Module Method
Move the standalone `generateUUID` function inside the `exchainPrebidModule` object as a method:
```javascript
generateUUID: function() {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        const arr = new Uint8Array(16);
        crypto.getRandomValues(arr);
        arr[6] = (arr[6] & 0x0f) | 0x40;
        arr[8] = (arr[8] & 0x3f) | 0x80;
        
        return [...arr].map((b, i) => {
            const hex = b.toString(16).padStart(2, '0');
            if (i === 4 || i === 6 || i === 8 || i === 10) return '-' + hex;
            return hex;
        }).join('');
    }
    return undefined;
}
```

## 3. Update UUID Call in generateAndInjectIOID
Change the UUID generation call from:
```javascript
const ioid = generateUUID();
```
To:
```javascript
const ioid = this.generateUUID();
```

## 4. Add Module Registration
At the end of the file, add:
```javascript
// Register as a Prebid module
getGlobal().installedModules.push(MODULE_NAME);
```

## 5. Update Auto-initialization
Replace the initialization code at the bottom with:
```javascript
// Auto-initialize when Prebid loads
function initModule() {
  const pbjs = getGlobal();
  if (pbjs && pbjs.onEvent) {
    exchainPrebidModule.init();
  }
}

// Use Prebid's queue system
getGlobal().que.push(() => {
  initModule();
});
```

## 6. File Placement
Place the modified file at: `modules/exchainAnalyticsAdapter.js` in the Prebid.js source tree.

## Build Instructions
These changes will make the module compatible with Prebid's build system while maintaining the exact UUID generation methodology and all existing functionality. Publishers can then include it using:
```bash
gulp build --modules=exchainAnalyticsAdapter
```