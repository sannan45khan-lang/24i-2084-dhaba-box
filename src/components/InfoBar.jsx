import { DELIVERY_AREAS, DELIVERY_FEE, FREE_DELIVERY_FROM, MIN_ORDER } from '../rules/orderRules.js';

// Shows the delivery fee, minimum order and areas up front, on the menu
// (fixes reference-site problem 2: these were hidden until the cart).
export default function InfoBar() {
  return (
    <section className="info-bar" aria-label="Delivery information">
      <p>
        <strong>Delivery:</strong> Rs {DELIVERY_FEE} (free from Rs {FREE_DELIVERY_FROM})
      </p>
      <p>
        <strong>Minimum order:</strong> Rs {MIN_ORDER}
      </p>
      <p>
        <strong>We deliver to:</strong> {DELIVERY_AREAS.join(', ')}
      </p>
    </section>
  );
}
