import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext.jsx';
import { CATEGORIES } from '../data/menu.js';
import ItemCard from '../components/ItemCard.jsx';
import InfoBar from '../components/InfoBar.jsx';
import VegToggle from '../components/VegToggle.jsx';
import DataStatus from '../components/DataStatus.jsx';

export default function MenuPage() {
  const { items, status, vegOnly, addToCart, getQtyInCart } = useShop();

  // Search, filter and sort are kept in the URL (e.g. /menu?q=daal&cat=Rice).
  // So pressing Back from a dish page brings them back (fixes reference-site problem 1).
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q') || '';
  const category = searchParams.get('cat') || 'All';
  const sort = searchParams.get('sort') || 'popular';

  function updateParam(key, value, defaultValue) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === defaultValue) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true } // typing should not add a history entry per letter
    );
  }

  function clearFilters() {
    setSearchParams({}, { replace: true });
  }

  // The search box keeps its own text so every key shows instantly.
  // (The URL updates a moment later, so reading the box straight from the URL
  // could drop letters when typing fast.)
  const [searchText, setSearchText] = useState(search);

  // When the URL changes from somewhere else (Back button, Clear, a suggestion),
  // copy the new search into the box.
  useEffect(() => {
    setSearchText(search);
  }, [search]);

  function handleSearchChange(event) {
    setSearchText(event.target.value);
    updateParam('q', event.target.value, '');
  }

  if (status !== 'ready') return <DataStatus />;

  // 1. search  2. filter  3. sort  - all work together
  const text = searchText.trim().toLowerCase();
  const filtered = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(text) ||
      item.description.toLowerCase().includes(text) ||
      item.category.toLowerCase().includes(text);
    const matchesCategory = category === 'All' || item.category === category;
    return matchesSearch && matchesCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'price-low') return a.price - b.price;
    if (sort === 'price-high') return b.price - a.price;
    if (sort === 'name') return a.name.localeCompare(b.name);
    return 0; // 'popular' keeps the original order
  });

  // Suggestions for the "no matches" state: first 3 dishes still in stock.
  const suggestions = items.filter((item) => item.stock > 0).slice(0, 3);

  return (
    <>
      <h1>Menu</h1>
      <InfoBar />

      <form className="filters" role="search" onSubmit={(event) => event.preventDefault()}>
        <div className="field">
          <label htmlFor="search">Search dishes</label>
          <input
            id="search"
            type="search"
            placeholder="e.g. biryani, daal, wrap"
            value={searchText}
            onChange={handleSearchChange}
          />
        </div>
        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" value={category} onChange={(event) => updateParam('cat', event.target.value, 'All')}>
            {CATEGORIES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="sort">Sort by</label>
          <select id="sort" value={sort} onChange={(event) => updateParam('sort', event.target.value, 'popular')}>
            <option value="popular">Most popular</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
        <VegToggle />
      </form>

      {/* Two different empty states (fixes reference-site problem 3). */}
      {items.length === 0 ? (
        <div className="empty-state">
          <h2>The kitchen has no dishes listed today</h2>
          <p>Our menu is empty right now. Please check back after 12 pm when lunch is added.</p>
        </div>
      ) : sorted.length === 0 ? (
        <div className="empty-state" role="status">
          <h2>No dishes match "{searchText || category}"</h2>
          <p>Try a different word or category, or clear the search to see all {items.length} dishes.</p>
          <button type="button" className="btn primary" onClick={clearFilters}>
            Clear search and filters
          </button>
          <p className="muted">Popular right now:</p>
          <ul className="suggestions">
            {suggestions.map((item) => (
              <li key={item.id}>
                <button type="button" className="btn secondary" onClick={() => updateParam('q', item.name, '')}>
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          <p className="result-count" role="status">
            Showing {sorted.length} of {items.length} dishes
          </p>
          <div className="grid">
            {sorted.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                qtyInCart={getQtyInCart(item.id)}
                vegOnly={vegOnly}
                onAdd={addToCart}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
