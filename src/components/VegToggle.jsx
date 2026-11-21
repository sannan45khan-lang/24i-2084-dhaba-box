import { useShop } from '../context/ShopContext.jsx';

// The customer's dietary preference (Rule 2). Saved in localStorage.
export default function VegToggle() {
  const { vegOnly, setVegOnly } = useShop();

  return (
    <label className="checkbox">
      <input type="checkbox" checked={vegOnly} onChange={(event) => setVegOnly(event.target.checked)} />
      Vegetarian only (non-veg dishes can't be added)
    </label>
  );
}
