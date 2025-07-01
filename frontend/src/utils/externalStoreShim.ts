/**
 * This file provides a compatibility layer for the useSyncExternalStore API
 * to ensure it works properly across different React versions and bundlers.
 */

// Import from the recommended paths
import * as shimExports from "use-sync-external-store/shim";
import * as shimWithSelectorExports from "use-sync-external-store/shim/with-selector";

// Export the useSyncExternalStore function and related utilities
export const useSyncExternalStore = shimExports.useSyncExternalStore;
export const useSyncExternalStoreWithSelector =
  shimWithSelectorExports.useSyncExternalStoreWithSelector;

// Provide a default export for direct imports
export default {
  useSyncExternalStore,
  useSyncExternalStoreWithSelector,
};
