import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext.jsx';
import DataStatus from '../components/DataStatus.jsx';
import OrderSummary from '../components/OrderSummary.jsx';
import { DELIVERY_AREAS } from '../rules/orderRules.js';
import { validateCheckout } from '../utils/validation.js';

const EMPTY_FORM = { name: '', phone: '', area: '', address: '', notes: '' };

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { status, canCheckout, placeOrder } = useShop();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false); // true right after placing the order

  if (status !== 'ready') return <DataStatus />;

  // Someone opened /checkout directly with an empty or invalid cart.
  // (Skipped right after submitting, because the cart is emptied while we move to /confirmation.)
  if (!canCheckout && !submitted) {
    return (
      <div className="empty-state">
        <h1>Your cart isn't ready for checkout</h1>
        <p>Your cart is empty, below the minimum order, or has items that need fixing.</p>
        <Link to="/cart" className="btn primary">
          Go to cart
        </Link>
      </div>
    );
  }

  // One handler for every input: uses the input's name to update that field.
  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Remove the error for this field once the user edits it.
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(event) {
    event.preventDefault(); // stop the browser reloading the page
    const newErrors = validateCheckout(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return; // keep all typed values

    setSubmitted(true);
    placeOrder(form);
    navigate('/confirmation');
  }

  return (
    <>
      <h1>Checkout</h1>
      <div className="two-columns">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <p className="note">Simulated order: please use fake details. No payment is taken.</p>

          <div className="field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              aria-invalid={Boolean(errors.name)}
              aria-describedby="name-error"
            />
            {errors.name && <p id="name-error" className="field-error">{errors.name}</p>}
          </div>

          <div className="field">
            <label htmlFor="phone">Mobile number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              placeholder="03001234567"
              value={form.phone}
              onChange={handleChange}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby="phone-error"
            />
            {errors.phone && <p id="phone-error" className="field-error">{errors.phone}</p>}
          </div>

          <div className="field">
            <label htmlFor="area">Delivery area</label>
            <select
              id="area"
              name="area"
              value={form.area}
              onChange={handleChange}
              aria-invalid={Boolean(errors.area)}
              aria-describedby="area-error"
            >
              <option value="">Choose your sector</option>
              {DELIVERY_AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
            {errors.area && <p id="area-error" className="field-error">{errors.area}</p>}
          </div>

          <div className="field">
            <label htmlFor="address">Hostel / house address</label>
            <input
              id="address"
              name="address"
              placeholder="e.g. Boys Hostel 3, Room 12"
              value={form.address}
              onChange={handleChange}
              aria-invalid={Boolean(errors.address)}
              aria-describedby="address-error"
            />
            {errors.address && <p id="address-error" className="field-error">{errors.address}</p>}
          </div>

          <div className="field">
            <label htmlFor="notes">Notes for the rider (optional)</label>
            <textarea id="notes" name="notes" rows="3" value={form.notes} onChange={handleChange} />
          </div>

          <button type="submit" className="btn primary large full">
            Place simulated order
          </button>
        </form>

        <aside>
          <OrderSummary />
          <p>
            <Link to="/cart">← Edit cart</Link>
          </p>
        </aside>
      </div>
    </>
  );
}
