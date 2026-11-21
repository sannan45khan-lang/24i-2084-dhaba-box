# CS4032 Assignment 02 Report: Dhaba Box

## 1. Student and project details
| | |
|---|---|
| Name | Sannan Khan |
| Roll number | 24I-2084 |
| Section | CY-A |
| Business name | Dhaba Box |
| Repository | https://github.com/sannan45khan-lang/24i-2084-dhaba-box |
| Deployment | https://24i-2084-dhaba-box.vercel.app |
| Final commit hash | d81d9d1b3ef3375b1baeb0241fb5dd25b0a0f8b0 |

## 2. Business profile
| Element | Detail |
|---|---|
| Business identity | **Dhaba Box**: home-style desi meals (rice, curries, wraps, sides, drinks, bundles) |
| Primary audience | University students living in hostels in Islamabad |
| Operating area | Kitchen in H-11. Delivers to H-8, H-9, H-11, H-12, G-9, I-8 |
| Main customer task | Find affordable dishes, build a cart, enter a hostel address and place an order |
| Business goal | A completed (simulated) delivery order |
| Offering | 14 dishes (`src/data/menu.js`) |

## 3. Operating rules
| | Rule 1: Availability | Rule 2: Eligibility | Rule 3: Pricing / fulfilment |
|---|---|---|---|
| **Condition** | Quantity of a dish ≤ portions left today (`stock`). Stock 0 = sold out. | If "Vegetarian only" is on, non-veg dishes are not allowed. | Subtotal must be ≥ **Rs 800**. Delivery Rs 150, free when subtotal ≥ Rs 2000. Area must be one of the 6 listed sectors. |
| **Where the user is told** | Stock badge on every card and dish page ("Only 4 left", "Sold out") | Veg/Non-veg tag on every card. Message under the toggle and on the dish page | Info bar on Home and Menu, dish page, and cart summary |
| **What the app does** | Add button disabled for sold-out dishes. + button stops at the stock limit. Cart lines over stock are flagged and checkout is blocked | Add buttons disabled for non-veg dishes. Non-veg items already in the cart are flagged and checkout is blocked | Checkout button disabled with "Add Rs X more". Fee and total calculated live. Area chosen from a list only |
| **Boundary case** | Karahi stock 4 → qty 4 allowed, + disabled at 4 | Toggle turned on with a non-veg dish already in the cart → line flagged, checkout blocked until removed | Rs 800 exactly → allowed. Rs 799 → blocked. Rs 2000 exactly → free delivery |

## 4. Reference-site investigation
Sites: **cheezious.com**, **order.savourfoods.com.pk** (both Pakistani food ordering, Islamabad H-11 location). Tested on desktop Chrome.

### Problem 1: Back button loses the user's place
- **URL:** order.savourfoods.com.pk (backup: cheezious.com/menu)
- **Task:** Compare dishes by opening one, then returning to the menu.
- **Observed:**
  1. Scrolled to Daigh Orders.
  2. Opened Chicken Qorma Daig (the URL changed to /product/…).
  3. Pressed Back. The browser went to Google, not the menu.
  On Cheezious, Back reset the scroll to the top and cleared the "tikka" search.
- **Possible consequence (opinion):** users lose their place or leave the site completely.
- **Our fix:** Decision 1.
- 📷 `savour_10a`, `savour_10b`, `savour_10c` (+ `cheezious_03a/03b`, `04a/04b`)

### Problem 2: Delivery fee and minimum order hidden until the cart
- **URL:** order.savourfoods.com.pk
- **Task:** Find out the full cost before choosing dishes.
- **Observed:** The menu shows no delivery or minimum-order information. After adding Daal Mash (Rs 255), the cart first showed "Delivery Charges Rs. 330.00" and "Min order amount must be greater than Rs. 300".
- **Possible consequence (opinion):** unexpected costs at the end may make customers abandon the order.
- **Our fix:** Decision 2.
- 📷 `savour_05`

### Problem 3: Search with no matches gives no answer
- **URL:** cheezious.com/menu
- **Task:** Search for a dish.
- **Observed:** Searching "xyz" showed "Loading..." for over 20 s, with no "no results" message. Searching "tikka" returned "4 items found" in about 4 s.
- **Possible consequence (opinion):** users may think the site is broken and leave.
- **Our fix:** Decision 3.
- 📷 `cheezious_02a`, `cheezious_02b`

## 5. Frontend decisions
_Copy the three tables from DECISIONS.md here (Problem, Decision, Alternative, Reason, Tradeoff, Code location, Evidence)._

## 6. Implemented application
📷 Add annotated screenshots (1–2 lines each):
1. Home: info bar shows fees up front. "Browse the menu" is the primary action.
2. Menu (1280px): search, filter, sort, stock badges with text, and Veg tags.
3. Menu (390px): single column, large tap targets.
4. Dish details: price, stock, rules, quantity control.
5. Cart: problem line in red with ⚠ text, summary, disabled checkout with reason.
6. Checkout: field errors under each input, with valid values kept.
7. Confirmation: order number, items and total, labelled as simulated.

## 7. Verification
### Edge-case checklist
| Case | Steps | Expected | Observed |
|---|---|---|---|
| Missing image/info | Open Doodh Patti Chai, Tandoori Roti | "No picture" tile / "No description available" | _✔ / ✘_ |
| Long content | Find the Exam Week bundle | Name wraps, no sideways scroll | _ |
| Empty dataset | Home → "Simulate empty menu" → Menu | "No dishes listed today" | _ |
| No matches | Search "xyz" | Message, Clear button, suggestions | _ |
| Invalid URL | Open /menu/abc and /xyz | "Dish not found" / "Page not found" with links | _ |
| Invalid form | Checkout, phone "123", empty address | Specific errors, other values kept | _ |
| Changed availability | Biryani in cart → "Simulate Biryani selling out" | Cart line flagged, checkout blocked, Remove works | _ |
| Restored selection | Add a non-veg dish, turn on Veg only, refresh | Cart restored, line flagged | _ |
| Loading failure | "Simulate loading failure" → Menu → untick → Retry | Error then menu loads | _ |

### Improvements (actions / expected / observed)
| Improvement | Actions | Expected | Observed |
|---|---|---|---|
| Back keeps place | Search "daal", scroll, open dish, Back | Search and scroll kept | _ |
| Fees up front | Open /menu | Fee, minimum and areas visible | _ |
| No-results state | Search "xyz" | Instant helpful message | _ |

### Automated test
Command: `npm test`. Result: **4 tests, 4 passed, 0 failed** (valid Rs 1200, boundary Rs 800, invalid Rs 799, delivery fee boundary at Rs 2000). 📷 terminal screenshot

## 8. Limitations
- No backend, real payments or accounts. All orders are simulated.
- Stock does not decrease after an order.
- The confirmation is lost if the page is refreshed (not stored, to avoid saving personal details).
- Dish pictures are emoji tiles, not photos.
