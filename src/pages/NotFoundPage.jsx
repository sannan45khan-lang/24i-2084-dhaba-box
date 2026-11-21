import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="empty-state">
      <h1>Page not found</h1>
      <p>This page doesn't exist. Check the address, or go back to the menu.</p>
      <Link to="/menu" className="btn primary">
        Go to the menu
      </Link>
    </div>
  );
}
