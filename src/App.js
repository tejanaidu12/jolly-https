import React, { useState, useEffect, useRef } from "react";
import BookCard from "./components/BookCard";
import "./styles.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef(null);
  const controllerRef = useRef(null);

  useEffect(() => {
    if (!query) {
      setBooks([]);
      setError("");
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchBooks(query);
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const fetchBooks = async (q) => {
    if (!q) return;
    if (controllerRef.current) controllerRef.current.abort();
    controllerRef.current = new AbortController();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(q)}`,
        { signal: controllerRef.current.signal }
      );
      if (!res.ok) throw new Error("Network response not ok");
      const data = await res.json();
      setBooks((data.docs || []).slice(0, 24));
    } catch (err) {
      if (err.name !== "AbortError") setError(err.message || "Fetch error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Book Finder</h1>
        <p className="subtitle">Search books by title (OpenLibrary)</p>
      </header>

      <div className="searchRow">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a book title — e.g. Pride and Prejudice"
          aria-label="Search books by title"
        />
        <button onClick={() => fetchBooks(query)} disabled={!query}>
          Search
        </button>
      </div>

      {loading && <div className="status">Loading…</div>}
      {error && <div className="status error">Error: {error}</div>}

      {!loading && !error && books.length === 0 && query && (
        <div className="status">No results found</div>
      )}

      <main className="grid">
        {books.map((b) => (
          <BookCard key={b.key || b.cover_edition_key || b.title} book={b} />
        ))}
      </main>

      <footer>
        <small>
          Data from Open Library — search endpoint. No API key required.
        </small>
      </footer>
    </div>
  );
}
