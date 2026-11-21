import { MENU_ITEMS } from '../data/menu.js';

// Mock "server" call. It waits a little, then returns the local menu data.
// The demo settings let us show the loading, error, empty and
// changed-availability states without a real backend.
export function loadMenu(demo) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (demo.failLoading) {
        reject(new Error('Could not load the menu (simulated network error).'));
        return;
      }
      if (demo.emptyMenu) {
        resolve([]);
        return;
      }
      // Copy the items so we never change the original data.
      const items = MENU_ITEMS.map((item) =>
        demo.biryaniSoldOut && item.id === 'm01' ? { ...item, stock: 0 } : { ...item }
      );
      resolve(items);
    }, 700);
  });
}
