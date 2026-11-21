# Dhaba Box: Student Meal Ordering (CS4032 Assignment 02)

**Student:** Sannan Khan · 24I-2084 · Section CY-A
**GitHub:** https://github.com/sannan45khan-lang/24i-2084-dhaba-box · **Live site:** https://24i-2084-dhaba-box.vercel.app

## Description
Dhaba Box is a fictional desi food kitchen in H-11, Islamabad. It delivers affordable meals to university students in nearby sectors. Students can browse the menu, search and filter it, open a dish, build a cart, enter a delivery address, check the calculated total and place a **simulated** order.

## Commands
| Task | Command |
|---|---|
| Install | `npm install` |
| Run locally | `npm run dev`, then open the printed URL (usually http://localhost:5173) |
| Build | `npm run build` (output in `dist/`) |
| Preview the build | `npm run preview` |
| Run the rule test | `npm test` (runs `node --test`) |

Requires Node.js 20 or newer.

## Routes
| Route | Purpose |
|---|---|
| `/` | Home page: about the business, fees up front, demo controls |
| `/menu` | Menu with search, category filter, sort and veg-only preference. Filters are stored in the URL, e.g. `/menu?q=daal&cat=Curry` |
| `/menu/:id` | Dish details (e.g. `/menu/m01`). An unknown id shows "Dish not found" |
| `/cart` | Cart: change quantities, remove items, see problems and the order summary |
| `/checkout` | Delivery form (name, phone, area, address, notes) with validation |
| `/confirmation` | Simulated order confirmation |
| any other | "Page not found" page |

## Features
- 14 dishes loaded through an async mock loader (`src/api/loadMenu.js`) with loading, error and Retry states.
- Search, filter and sort all work together.
- Cart is shared across all pages and saved in localStorage, along with the veg-only preference.
- Three business rules (see below) block invalid checkout.
- The cart and checkout show subtotal, delivery fee and total.
- Responsive at 390px and 1280px. Keyboard accessible with visible focus.

## Business rules
1. **Availability:** you can't order more portions than are left today (`stock`). Sold-out dishes can't be added.
2. **Eligibility:** when "Vegetarian only" is on, non-veg dishes can't be added, and any already in the cart block checkout.
3. **Pricing:** minimum order **Rs 800**, delivery fee **Rs 150**, free delivery from **Rs 2000**, delivery only to H-8, H-9, H-11, H-12, G-9 and I-8.

## Reproducing the edge cases
All demo controls are on the **Home page** under "Demo controls".
| Case | How to reproduce |
|---|---|
| Loading failure | Tick "Simulate loading failure" → open Menu → error message → press **Retry** → data loads (Retry also switches the simulation off) |
| Empty dataset | Tick "Simulate empty menu" → Menu shows "no dishes listed today" |
| No search matches | Search `xyz` → "No dishes match" with **Clear** button and suggestions |
| Invalid URL | Open `/menu/abc` or `/anything` |
| Changed availability | Add Chicken Biryani to the cart → tick "Simulate Chicken Biryani selling out" → Cart flags it and blocks checkout |
| Restored selection conflict | Add a non-veg dish → turn on "Vegetarian only" → Cart flags it. Refresh the page: the cart and the warning are restored |
| Quantity above stock | Karahi has stock 4: the + button stops at 4 |
| Missing image or info | "Doodh Patti Chai" has no picture, and "Tandoori Roti" has no description |
| Long content | The "Exam Week Survival Bundle" has a very long name that wraps |
| Invalid form | Submit the checkout form with phone `123`: specific errors appear and the other values are kept |

## Simulated operations and limitations
- No real orders, payments or backend. All data is local (`src/data/menu.js`).
- Stock does not go down after an order.
- The confirmation is kept in memory only, so refreshing `/confirmation` shows "No recent order" (on purpose, so personal details are not saved).

## Concept map
| Concept | File | Component / function |
|---|---|---|
| Routing, URL params | `src/router.jsx`, `src/pages/ItemPage.jsx` | `router`, `useParams` |
| Search params in URL | `src/pages/MenuPage.jsx` | `useSearchParams`, `updateParam` |
| Shared state (context) | `src/context/ShopContext.jsx` | `ShopProvider`, `useShop` |
| useState / functional updates | `src/context/ShopContext.jsx` | `addToCart`, `retry` |
| Immutable array updates | `src/context/ShopContext.jsx` | `addToCart`, `updateQty`, `removeFromCart` |
| Immutable object updates | `src/pages/CheckoutPage.jsx` | `handleChange` |
| useEffect + cleanup | `src/context/ShopContext.jsx` | menu-loading effect (`ignore` flag) |
| Async / Promises | `src/api/loadMenu.js` | `loadMenu` |
| localStorage | `src/utils/storage.js` | `readStorage`, `writeStorage` |
| Props + callback props | `src/components/ItemCard.jsx`, `QuantityControl.jsx` | `onAdd`, `onChange` |
| Lists and keys | `src/pages/MenuPage.jsx`, `CartPage.jsx` | `.map(... key={item.id})` |
| Conditional rendering | `src/components/DataStatus.jsx`, `MenuPage.jsx` | loading/error/empty states |
| Derived values | `src/context/ShopContext.jsx` | `subtotal`, `total`, `canCheckout` |
| Controlled form + validation | `src/pages/CheckoutPage.jsx`, `src/utils/validation.js` | `validateCheckout` |
| Business rules | `src/rules/orderRules.js` | `checkMinimumOrder`, `checkStock`, `checkDiet` |
| Automated test | `tests/orderRules.test.js` | tests `checkMinimumOrder` |

## Deployment (Vercel)
1. Push this folder to a **public GitHub repository** (this folder must be the repository root).
2. On vercel.com: **Add New → Project → Import** the repository. Vercel reads `vercel.json`:
   - Framework: Vite · Install: `npm install` · Build: `npm run build` · Output: `dist`
3. Press **Deploy**. Every later `git push` redeploys automatically.

`vercel.json` also sends every route to `index.html`, so direct links and refreshes on nested routes (e.g. `/menu/m01`) work.
