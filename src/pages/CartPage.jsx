import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext.jsx';
import DataStatus from '../components/DataStatus.jsx';
import OrderSummary from '../components/OrderSummary.jsx';
import QuantityControl from '../components/QuantityControl.jsx';
import VegToggle from '../components/VegToggle.jsx';
import { formatPrice } from '../utils/format.js';

export default function CartPage() {
  const navigate = useNavigate();
  const { status, cart, cartLines, updateQty, removeFromCart, hasProblems, minimumCheck, canCheckout } = useShop();

  if (status !== 'ready') return <DataStatus />;

  if (cart.length === 0) {
    return (
      <div className="empty-state">
        <h1>Your cart is empty</h1>
        <p>Add a few dishes from the menu to get started.</p>
        <Link to="/menu" className="btn primary">
          Browse the menu
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1>Your cart</h1>
      <div className="two-columns">
        <section aria-label="Cart items">
          {/* Restored cart is checked against today's menu and rules. */}
          {hasProblems && (
            <p className="note error" role="alert">
              Some items in your cart need attention before you can check out.
            </p>
          )}
          <ul className="cart-list">
            {cartLines.map((line) => (
              <li key={line.id} className={line.problem ? 'cart-line has-problem' : 'cart-line'}>
                <div className="cart-line-info">
                  <strong>{line.item ? line.item.name : 'Unknown dish'}</strong>
                  {line.item && (
                    <span className="muted">
                      {formatPrice(line.item.price)} × {line.qty} = {formatPrice(line.item.price * line.qty)}
                    </span>
                  )}
                  {line.problem && <span className="line-problem">⚠ {line.problem}</span>}
                </div>
                <div className="cart-line-actions">
                  {line.item && line.item.stock > 0 && (
                    <QuantityControl
                      name={line.item.name}
                      qty={line.qty}
                      max={line.item.stock}
                      onChange={(qty) => updateQty(line.id, qty)}
                    />
                  )}
                  <button type="button" className="btn small danger" onClick={() => removeFromCart(line.id)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <VegToggle />
          <p>
            <Link to="/menu">← Add more dishes</Link>
          </p>
        </section>

        <aside>
          <OrderSummary />
          <button type="button" className="btn primary large full" onClick={() => navigate('/checkout')} disabled={!canCheckout}>
            Go to checkout
          </button>
          {!canCheckout && (
            <p className="reason">
              {hasProblems ? 'Fix the items marked ⚠ first.' : !minimumCheck.ok ? minimumCheck.message : ''}
            </p>
          )}
        </aside>
      </div>
    </>
  );
}
