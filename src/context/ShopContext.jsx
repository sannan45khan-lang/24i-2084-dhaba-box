import { createContext, useContext, useEffect, useState } from 'react';
import { loadMenu } from '../api/loadMenu.js';
import { readStorage, writeStorage } from '../utils/storage.js';
import { checkMinimumOrder, getDeliveryFee, getLineProblem } from '../rules/orderRules.js';

// One shared place for the menu data, the cart and the customer's preference.
// Every page reads from here, so the menu, item page, cart and checkout always agree.
const ShopContext = createContext(null);

const DEFAULT_DEMO = { failLoading: false, emptyMenu: false, biryaniSoldOut: false };

export function ShopProvider({ children }) {
  // ----- Menu data (loaded asynchronously) -----
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadCount, setReloadCount] = useState(0);

  // ----- Saved in localStorage so they survive a page refresh -----
  const [cart, setCart] = useState(() => readStorage('dhaba-cart', [])); // [{ id, qty }]
  const [vegOnly, setVegOnly] = useState(() => readStorage('dhaba-veg-only', false));
  const [demo, setDemo] = useState(() => readStorage('dhaba-demo', DEFAULT_DEMO));

  // Kept in memory only, so personal details are not stored in the browser.
  const [lastOrder, setLastOrder] = useState(null);

  // Load the menu whenever the demo settings change or the user presses Retry.
  useEffect(() => {
    let ignore = false; // cleanup flag: ignore an old request if a newer one started
    setStatus('loading');
    loadMenu(demo)
      .then((data) => {
        if (!ignore) {
          setItems(data);
          setStatus('ready');
        }
      })
      .catch((error) => {
        if (!ignore) {
          setErrorMessage(error.message);
          setStatus('error');
        }
      });
    return () => {
      ignore = true;
    };
  }, [demo, reloadCount]);

  // Save to localStorage whenever these values change.
  useEffect(() => writeStorage('dhaba-cart', cart), [cart]);
  useEffect(() => writeStorage('dhaba-veg-only', vegOnly), [vegOnly]);
  useEffect(() => writeStorage('dhaba-demo', demo), [demo]);

  // ----- Cart actions (never mutate state; always create new arrays) -----
  function addToCart(id) {
    setCart((prev) => {
      const existing = prev.find((line) => line.id === id);
      if (existing) {
        return prev.map((line) => (line.id === id ? { ...line, qty: line.qty + 1 } : line));
      }
      return [...prev, { id, qty: 1 }];
    });
  }

  function updateQty(id, qty) {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => prev.map((line) => (line.id === id ? { ...line, qty } : line)));
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((line) => line.id !== id));
  }

  function retry() {
    // Demo: Retry also turns off "Simulate loading failure", as if the connection came back.
    setDemo((prev) => ({ ...prev, failLoading: false }));
    setReloadCount((count) => count + 1);
  }

  // ----- Derived values (calculated from the current state on every render) -----
  const cartLines = cart.map((line) => {
    const item = items.find((menuItem) => menuItem.id === line.id);
    const problem = status === 'ready' ? getLineProblem(item, line.qty, vegOnly) : '';
    return { ...line, item, problem };
  });

  const itemCount = cart.reduce((sum, line) => sum + line.qty, 0);
  const subtotal = cartLines.reduce((sum, line) => (line.item ? sum + line.item.price * line.qty : sum), 0);
  const deliveryFee = getDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;
  const minimumCheck = checkMinimumOrder(subtotal);
  const hasProblems = cartLines.some((line) => line.problem !== '');
  const canCheckout = status === 'ready' && cart.length > 0 && !hasProblems && minimumCheck.ok;

  function getQtyInCart(id) {
    const line = cart.find((cartLine) => cartLine.id === id);
    return line ? line.qty : 0;
  }

  // Simulated order: save a summary, then empty the cart.
  function placeOrder(form) {
    const order = {
      number: 'DB-' + String(Date.now()).slice(-6),
      name: form.name.trim(),
      area: form.area,
      lines: cartLines.map(({ id, qty, item }) => ({ id, qty, name: item.name, price: item.price })),
      subtotal,
      deliveryFee,
      total,
    };
    setLastOrder(order);
    setCart([]);
  }

  const value = {
    items,
    status,
    errorMessage,
    retry,
    cart,
    cartLines,
    itemCount,
    subtotal,
    deliveryFee,
    total,
    minimumCheck,
    hasProblems,
    canCheckout,
    getQtyInCart,
    addToCart,
    updateQty,
    removeFromCart,
    vegOnly,
    setVegOnly,
    demo,
    setDemo,
    lastOrder,
    placeOrder,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

// Custom hook so components can write: const { cart } = useShop();
export function useShop() {
  return useContext(ShopContext);
}
