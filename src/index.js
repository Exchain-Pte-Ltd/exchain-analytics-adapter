/*
 * Copyright 2025 EXCHAIN PTE. LTD.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { exchainPrebidModule } from './exchainAnalyticsAdapter/exchainAnalyticsAdapter.js';

// Initialize the module when Prebid.js is available
if (typeof window !== 'undefined') {
  // Function to initialize when Prebid is ready
  function initializeExchainAdapter() {
    if (window.pbjs && window.pbjs.que) {
      window.pbjs.que.push(() => {
        exchainPrebidModule.init();
      });
    } else if (window.pbjs) {
      // Prebid is available but no que, try direct initialization
      exchainPrebidModule.init();
    } else {
      // Prebid not ready yet, wait a bit and try again
      setTimeout(initializeExchainAdapter, 100);
    }
  }

  // Start initialization process
  initializeExchainAdapter();
}

// Export the module for manual initialization if needed
export { exchainPrebidModule };
