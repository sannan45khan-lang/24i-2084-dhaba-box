// Small helpers around localStorage.
// try/catch keeps the app working if storage is blocked or holds bad data.

export function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved === null ? fallback : JSON.parse(saved);
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage is full or blocked - the app still works, it just won't remember.
  }
}
