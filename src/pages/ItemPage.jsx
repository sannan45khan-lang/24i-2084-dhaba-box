import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext.jsx';
import DataStatus from '../components/DataStatus.jsx';
import ItemImage from '../components/ItemImage.jsx';
import StockBadge from '../components/StockBadge.jsx';
import QuantityControl from '../components/QuantityControl.jsx';
import { formatPrice } from '../utils/format.js';
import { checkDiet, MIN_ORDER, DELIVERY_FEE } from '../rules/orderRules.js';

export default function ItemPage() {
  const { id } = useParams(); // the :id part of /menu/:id
  const navigate = useNavigate();
  const location = useLocation();
  const { items, status, vegOnly, addToCart, updateQty, getQtyInCart } = useShop();

  if (status !== 'ready') return <DataStatus />;

  const item = items.find((menuItem) => menuItem.id === id);

  // Invalid id in the URL, e.g. /menu/abc
  if (!item) {
    return (
      <div className="empty-state">
        <h1>Dish not found</h1>
        <p>There is no dish with the code "{id}". It may have been removed from the menu.</p>
        <Link to="/menu" className="btn primary">
          See the full menu
        </Link>
      </div>
    );
  }

  const qtyInCart = getQtyInCart(item.id);
  const dietCheck = checkDiet(item, vegOnly);

  // Go back to the menu the user came from (keeps their search). If they opened
  // this page directly, there is no previous page, so go to /menu instead.
  function goBack() {
    if (location.key === 'default') navigate('/menu');
    else navigate(-1);
  }

  return (
    <article className="details">
      <button type="button" className="btn link" onClick={goBack}>
        ← Back to menu
      </button>

      <div className="details-layout">
        <ItemImage emoji={item.emoji} name={item.name} large />
        <div>
          <h1>{item.name}</h1>
          <p className="tags">
            <span className={item.isVeg ? 'tag veg' : 'tag nonveg'}>{item.isVeg ? 'Vegetarian' : 'Non-vegetarian'}</span>
            <span className="tag">Spice: {item.spice}</span>
            <span className="tag">{item.category}</span>
            <StockBadge stock={item.stock} />
          </p>
          <p className="price large">{formatPrice(item.price)}</p>
          <p>{item.description || 'No description available for this dish yet.'}</p>

          {/* Rules are shown here, before the cart (not as a surprise later). */}
          <ul className="rule-list">
            <li>Up to {item.stock} portions available today.</li>
            <li>
              Minimum order Rs {MIN_ORDER}. Delivery Rs {DELIVERY_FEE}.
            </li>
          </ul>

          {!dietCheck.ok && <p className="note warning">⚠ {dietCheck.message}</p>}

          {item.stock === 0 ? (
            <p className="note error">Sold out today. Try another dish from the {item.category} section.</p>
          ) : qtyInCart === 0 ? (
            <button type="button" className="btn primary large" onClick={() => addToCart(item.id)} disabled={!dietCheck.ok}>
              Add to cart
            </button>
          ) : (
            <div className="in-cart-box">
              <p>In your cart:</p>
              <QuantityControl
                name={item.name}
                qty={qtyInCart}
                max={item.stock}
                onChange={(qty) => updateQty(item.id, qty)}
              />
              <Link to="/cart" className="btn primary">
                Go to cart
              </Link>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
