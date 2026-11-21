# Frontend Decisions: Dhaba Box

## Decision 1: Back button keeps the user's place (interaction / state)
| Field | Content |
|---|---|
| **Problem** | On order.savourfoods.com.pk, opening a dish and pressing Back left the site and went to Google, instead of returning to the menu (evidence `savour_10a–10c`). On cheezious.com, Back reset the scroll position and cleared the search (`cheezious_03a–04b`). |
| **Decision** | Each dish has its own route (`/menu/:id`), so Back always returns to the menu. Search, category and sort are stored in the URL (`/menu?q=daal&cat=Curry`), and `<ScrollRestoration />` restores the scroll position. |
| **Alternative** | Open dishes in a pop-up on the menu page and keep filters in React state only. |
| **Reason** | Students often compare a few dishes. Returning to the same filtered list with one Back press saves time and keeps them on the site. The URL can also be shared. |
| **Tradeoff** | Typing in search updates the URL. `replace: true` is used so each letter doesn't add a history entry. Opening a dish is a full page change, not a quick pop-up. |
| **Code location** | `src/pages/MenuPage.jsx` → `updateParam`. `src/components/Layout.jsx` → `<ScrollRestoration />`. `src/pages/ItemPage.jsx` → `goBack`. |
| **Evidence** | 1. Menu → search "daal" → scroll down. 2. Open Daal Mash. 3. Press Back → the search and the scroll position are still there. _(add screenshot)_ |

## Decision 2: Fees and minimum order shown before the cart (information hierarchy)
| Field | Content |
|---|---|
| **Problem** | On order.savourfoods.com.pk, the menu shows no delivery fee or minimum order. The cart is the first place showing "Delivery Charges Rs. 330.00" and "Min order amount must be greater than Rs. 300" (`savour_05`). |
| **Decision** | An info bar on the Home and Menu pages shows the delivery fee, free-delivery level, minimum order and delivery areas. The dish page repeats the rules. The cart summary says exactly how much more is needed ("Add Rs 200 more to continue"). |
| **Alternative** | Show the fees only in the cart, but as a large warning banner. |
| **Reason** | Students on a budget need the full cost before choosing dishes. Showing it early avoids surprise costs at the end. |
| **Tradeoff** | Takes up space at the top of the menu, especially on mobile, where the bar wraps onto 3 lines. |
| **Code location** | `src/components/InfoBar.jsx`. `src/components/OrderSummary.jsx`. `src/rules/orderRules.js` → `checkMinimumOrder`, `getDeliveryFee`. |
| **Evidence** | 1. Open /menu → fees are visible above the dishes. 2. Add a Rs 450 biryani → cart says "Add Rs 350 more to continue" and checkout is disabled. _(add screenshot)_ |

## Decision 3: Helpful "no results" state (feedback)
| Field | Content |
|---|---|
| **Problem** | On cheezious.com/menu, searching "xyz" showed "Loading..." for over 20 seconds and never said there were no results (`cheezious_02a`). |
| **Decision** | Search filters the already-loaded menu instantly. If nothing matches, the page says so, offers a **Clear search and filters** button, and suggests popular dishes. An empty menu (no data at all) shows a different message. |
| **Alternative** | Show only the text "No results" with no actions. |
| **Reason** | A student who mistypes should get to food in one click instead of guessing whether the site is broken. |
| **Tradeoff** | Search covers name, description and category only, with no spelling correction. Suggestions are simply the first dishes in stock, not truly personalised. |
| **Code location** | `src/pages/MenuPage.jsx` → the `items.length === 0` and `sorted.length === 0` branches. |
| **Evidence** | 1. Menu → search "xyz" → message, Clear button and suggestions appear immediately. 2. Click a suggestion → results show. _(add screenshot)_ |
