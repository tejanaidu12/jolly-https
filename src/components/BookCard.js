import React from "react";

export default function BookCard({ book }) {
  const coverId = book.cover_i;
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : book.cover_edition_key
    ? `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`
    : "https://via.placeholder.com/130x190?text=No+Cover";

  const authors = book.author_name ? book.author_name.join(", ") : "Unknown";
  const year = book.first_publish_year || "";

  // book.key usually like "/works/OLxxxxW" so prefix with openlibrary domain
  const openLibraryUrl = book.key ? `https://openlibrary.org${book.key}` : "#";

  return (
    <a className="card" href={openLibraryUrl} target="_blank" rel="noreferrer">
      <img src={coverUrl} alt={`${book.title} cover`} loading="lazy" />
      <div className="meta">
        <h3>{book.title}</h3>
        <p className="authors">{authors}</p>
        <p className="year">{year}</p>
      </div>
    </a>
  );
}
