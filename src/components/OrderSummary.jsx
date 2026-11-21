import { useShop } from '../context/ShopContext.jsx';
import { formatPrice } from '../utils/format.js';
import { FREE_DELIVERY_FROM } from '../rules/orderRules.js';

// Calculated summary used on the cart and checkout pages.
export default function OrderSummary() {
  const { itemCount, subtotal, deliveryFee, total, minimumCheck } = useShop();
  const toFreeDelivery = FREE_DELIVERY_FROM - subtotal;

  return (
    <section className="summary" aria-labelledby="summary-title">
      <h2 id="summary-title">Order summary</h2>
      <dl>
        <div>
          <dt>Items</dt>
          <dd>{itemCount}</dd>
        </div>
        <div>
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div>
          <dt>Delivery</dt>
          <dd>{deliveryFee === 0 && subtotal > 0 ? 'Free' : formatPrice(deliveryFee)}</dd>
        </div>
        <div className="total-row">
          <dt>Total</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>

      {!minimumCheck.ok && subtotal > 0 && <p className="note warning">⚠ {minimumCheck.message}</p>}
      {minimumCheck.ok && toFreeDelivery > 0 && (
        <p className="note">Add {formatPrice(toFreeDelivery)} more for free delivery.</p>
      )}
    </section>
  );
}
