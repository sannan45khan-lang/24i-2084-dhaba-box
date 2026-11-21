import { Link, NavLink } from 'react-router-dom';
import { useShop } from '../context/ShopContext.jsx';

export default function Header() {
  const { itemCount } = useShop();

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          Dhaba<span>Box</span>
        </Link>
        <nav aria-label="Main">
          <ul className="nav-list">
            <li>
              <NavLink to="/" end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/menu">Menu</NavLink>
            </li>
            <li>
              <NavLink to="/cart" className="cart-link">
                Cart <span className="count">{itemCount}</span>
                <span className="visually-hidden"> items</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
