import { Link } from 'react-router-dom';
import InfoBar from '../components/InfoBar.jsx';
import DemoPanel from '../components/DemoPanel.jsx';

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <h1>Hot desi meals, delivered to your hostel</h1>
        <p>
          Dhaba Box cooks affordable home-style food for university students in Islamabad. Order before your next
          class and we deliver in about 45 minutes.
        </p>
        <Link to="/menu" className="btn primary large">
          Browse the menu
        </Link>
      </section>

      <InfoBar />

      <section className="steps" aria-labelledby="how-title">
        <h2 id="how-title">How it works</h2>
        <ol>
          <li>Search the menu and add dishes to your cart.</li>
          <li>Check your total. Fees are shown before you pay.</li>
          <li>Enter your hostel address and place a (simulated) order.</li>
        </ol>
      </section>

      <DemoPanel />
    </>
  );
}
