import { Link } from 'react-router-dom';
import ItemImage from './ItemImage.jsx';
import StockBadge from './StockBadge.jsx';
import { formatPrice } from '../utils/format.js';
import { checkDiet, checkStock } from '../rules/orderRules.js';

// One dish in the menu grid. Data comes in through props; the add action goes
// back up through the onAdd callback prop.
export default function ItemCard({ item, qtyInCart, vegOnly, onAdd }) {
  const stockCheck = checkStock(item, qtyInCart + 1);
  const dietCheck = checkDiet(item, vegOnly);
  const canAdd = stockCheck.ok && dietCheck.ok;

  // Short reason shown under a disabled button.
  let reason = '';
  if (item.stock === 0) reason = 'Sold out today';
  else if (!dietCheck.ok) reason = 'Not vegetarian';
  else if (!stockCheck.ok) reason = `Max ${item.stock} - all in your cart`;

  return (
    <article className={canAdd ? 'card' : 'card unavailable'}>
      <ItemImage emoji={item.emoji} name={item.name} />
      <div className="card-body">
        <h3 className="card-title">
          <Link to={`/menu/${item.id}`}>{item.name}</Link>
        </h3>
        <p className="tags">
          <span className={item.isVeg ? 'tag veg' : 'tag nonveg'}>{item.isVeg ? 'Veg' : 'Non-veg'}</span>
          <span className="tag">{item.spice}</span>
          <StockBadge stock={item.stock} />
        </p>
        <p className="price">{formatPrice(item.price)}</p>
        <div className="card-actions">
          <button type="button" className="btn primary" onClick={() => onAdd(item.id)} disabled={!canAdd}>
            Add to cart
          </button>
          {qtyInCart > 0 && <span className="in-cart">✓ {qtyInCart} in cart</span>}
        </div>
        {reason && <p className="reason">{reason}</p>}
      </div>
    </article>
  );
}
