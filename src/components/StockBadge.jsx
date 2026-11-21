// Availability shown with text AND colour (not colour alone).
export default function StockBadge({ stock }) {
  if (stock === 0) return <span className="tag soldout">Sold out</span>;
  if (stock <= 5) return <span className="tag low">Only {stock} left</span>;
  return <span className="tag ok">{stock} left today</span>;
}
