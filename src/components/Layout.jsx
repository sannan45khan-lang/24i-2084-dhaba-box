import { Outlet, ScrollRestoration } from 'react-router-dom';
import Header from './Header.jsx';

export default function Layout() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" className="container">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container">
          <p>
            <strong>Dhaba Box</strong> · Desi meals for students · H-11, Islamabad
          </p>
          <p className="muted">Student project: all orders are simulated. No food is delivered and no payment is taken.</p>
        </div>
      </footer>
      {/* Puts the scroll position back when the user presses Back (fixes reference-site problem 1). */}
      <ScrollRestoration />
    </>
  );
}
