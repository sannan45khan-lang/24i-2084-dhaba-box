// - [ 2 ] + control. The parent owns the state and passes onChange (callback prop).
export default function QuantityControl({ name, qty, max, onChange }) {
  return (
    <div className="qty-control">
      <button type="button" className="btn small secondary" onClick={() => onChange(qty - 1)} aria-label={`Decrease ${name}`}>
        −
      </button>
      <span className="qty-value" aria-live="polite" aria-label={`${name} quantity ${qty}`}>
        {qty}
      </span>
      <button
        type="button"
        className="btn small secondary"
        onClick={() => onChange(qty + 1)}
        disabled={qty >= max}
        aria-label={`Increase ${name}`}
      >
        +
      </button>
    </div>
  );
}
