import { useShop } from '../context/ShopContext.jsx';

// Clearly labelled controls for testing edge cases (loading failure,
// empty data and changed availability). Settings are saved in localStorage.
export default function DemoPanel() {
  const { demo, setDemo } = useShop();

  function handleChange(event) {
    const { name, checked } = event.target;
    setDemo((prev) => ({ ...prev, [name]: checked }));
  }

  return (
    <section className="demo-panel" aria-labelledby="demo-title">
      <h2 id="demo-title">Demo controls (for testing)</h2>
      <p className="muted">These simulate problems so the error and recovery screens can be checked.</p>
      <label className="checkbox">
        <input type="checkbox" name="failLoading" checked={demo.failLoading} onChange={handleChange} />
        Simulate loading failure (Retry fixes it)
      </label>
      <label className="checkbox">
        <input type="checkbox" name="emptyMenu" checked={demo.emptyMenu} onChange={handleChange} />
        Simulate empty menu (no dishes today)
      </label>
      <label className="checkbox">
        <input type="checkbox" name="biryaniSoldOut" checked={demo.biryaniSoldOut} onChange={handleChange} />
        Simulate Chicken Biryani selling out (changed availability)
      </label>
    </section>
  );
}
