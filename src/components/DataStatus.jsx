import { useShop } from '../context/ShopContext.jsx';

// Shown instead of a page while the menu is loading or has failed to load.
export default function DataStatus() {
  const { status, errorMessage, retry } = useShop();

  if (status === 'loading') {
    return (
      <div className="status-box" role="status">
        <div className="spinner" aria-hidden="true"></div>
        <p>Loading today's menu...</p>
      </div>
    );
  }

  return (
    <div className="status-box error" role="alert">
      <h2>Menu could not be loaded</h2>
      <p>{errorMessage}</p>
      <p className="muted">
        If you turned on "Simulate loading failure" on the Home page, turn it off first.
      </p>
      <button type="button" className="btn primary" onClick={retry}>
        Retry
      </button>
    </div>
  );
}
