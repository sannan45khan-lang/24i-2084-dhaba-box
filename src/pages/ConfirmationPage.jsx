import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext.jsx';
import { formatPrice } from '../utils/format.js';

export default function ConfirmationPage() {
  const { lastOrder } = useShop();

  // Opened directly, or refreshed: the order is not stored, so explain that.
  if (!lastOrder) {
    return (
      <div className="empty-state">
        <h1>No recent order</h1>
        <p>We couldn't find an order from this visit. Orders are not saved after a page refresh.</p>
        <Link to="/menu" className="btn primary">
          Start a new order
        </Link>
      </div>
    );
  }

  return (
    <section className="confirmation">
      <p className="success-icon" aria-hidden="true">
        ✓
      </p>
      <h1>Order placed (simulated)</h1>
      <p>
        Thanks, {lastOrder.name}! Your order <strong>{lastOrder.number}</strong> would arrive in {lastOrder.area} in
        about 45 minutes.
      </p>

      <table className="order-table">
        <caption>Order details</caption>
        <thead>
          <tr>
            <th scope="col">Dish</th>
            <th scope="col">Qty</th>
            <th scope="col">Price</th>
          </tr>
        </thead>
        <tbody>
          {lastOrder.lines.map((line) => (
            <tr key={line.id}>
              <td>{line.name}</td>
              <td>{line.qty}</td>
              <td>{formatPrice(line.price * line.qty)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2">Delivery</td>
            <td>{lastOrder.deliveryFee === 0 ? 'Free' : formatPrice(lastOrder.deliveryFee)}</td>
          </tr>
          <tr>
            <th scope="row" colSpan="2">
              Total
            </th>
            <td>
              <strong>{formatPrice(lastOrder.total)}</strong>
            </td>
          </tr>
        </tfoot>
      </table>

      <p className="note">This is a student project. No food will be delivered and no payment was taken.</p>
      <Link to="/menu" className="btn primary">
        Order something else
      </Link>
    </section>
  );
}
