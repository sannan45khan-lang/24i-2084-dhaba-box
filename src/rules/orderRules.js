// ----- Rule 3: Pricing / fulfilment -----
export const MIN_ORDER = 800; // Rs - smallest subtotal we deliver
export const DELIVERY_FEE = 150; // Rs
export const FREE_DELIVERY_FROM = 2000; // Rs - subtotal at which delivery is free
export const DELIVERY_AREAS = ['H-8', 'H-9', 'H-11', 'H-12', 'G-9', 'I-8'];

/**
 * Checks the minimum order rule.
 * Returns { ok, shortBy, message } so the result can be tested without the UI.
 */
export function checkMinimumOrder(subtotal) {
  if (subtotal >= MIN_ORDER) {
    return { ok: true, shortBy: 0, message: '' };
  }
  const shortBy = MIN_ORDER - subtotal;
  return {
    ok: false,
    shortBy,
    message: `Minimum order is Rs ${MIN_ORDER}. Add Rs ${shortBy} more to continue.`,
  };
}

/** Delivery is Rs 150, or free when the subtotal reaches Rs 2000. */
export function getDeliveryFee(subtotal) {
  if (subtotal === 0) return 0;
  return subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
}

// ----- Rule 1: Availability -----
/** A quantity must be 1 or more and not more than the portions left today. */
export function checkStock(item, quantity) {
  if (item.stock === 0) {
    return { ok: false, message: `${item.name} is sold out today.` };
  }
  if (quantity > item.stock) {
    return { ok: false, message: `Only ${item.stock} left of ${item.name}. Reduce the quantity.` };
  }
  return { ok: true, message: '' };
}

// ----- Rule 2: Eligibility (dietary) -----
/** When the customer chooses "vegetarian only", non-veg items are not allowed. */
export function checkDiet(item, vegOnly) {
  if (vegOnly && !item.isVeg) {
    return { ok: false, message: `${item.name} is not vegetarian. Remove it or turn off "Vegetarian only".` };
  }
  return { ok: true, message: '' };
}

/**
 * Checks one cart line against the current menu data and rules.
 * Returns an error message, or '' when the line is fine.
 */
export function getLineProblem(item, quantity, vegOnly) {
  if (!item) return 'This item is no longer on the menu. Please remove it.';
  const stock = checkStock(item, quantity);
  if (!stock.ok) return stock.message;
  const diet = checkDiet(item, vegOnly);
  if (!diet.ok) return diet.message;
  return '';
}
