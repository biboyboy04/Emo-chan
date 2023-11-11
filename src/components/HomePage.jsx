import React from "react";
import FileReaderInput from "react-file-reader-input";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Reader from "../Reader";

const HomePage = () => {
  const [location, setLocation] = useState(
    localStorage.getItem("epub-location") || 2
  );
  const [localFile, setLocalFile] = useState(null);
  const [localName, setLocalName] = useState(null);
  const navigate = useNavigate();
  const books = [
    {
      id: 1,
      title: "Alice's Adventures in Wonderland",
      author: "Lewis Carroll",
      genre: "Fiction",
      cover: "/public/e-books/alice.jpg",
      url: "/public/e-books/alice.epub",
    },
    {
      id: 2,
      title: "Grimms' Fairy Tales",
      author: "Jacob Grimm and Wilhelm Grimm",
      genre: "Non-fiction",
      cover: "/public/e-books/grimms.png",
      url: "/public/e-books/grimms.epub",
    },
    {
      id: 3,
      title: "The Happy Prince and Other Tales",
      author: "Oscar Wilde",
      genre: "Mystery",
      cover: "/public/e-books/happy_prince.jpg",
      url: "/public/e-books/happy_prince.epub",
    },
    {
      id: 4,
      title: "The Jungle Book",
      author: "Rudyard Kipling",
      genre: "Mystery",
      cover: "/public/e-books/jungle_book.jpg",
      url: "/public/e-books/jungle_book.epub",
    },
  ];

  const handleChangeFile = (event, results) => {
    if (results.length > 0) {
      const [e, file] = results[0];
      if (file.type !== "application/epub+zip") {
        return alert("Unsupported type. Please upload an epub file.");
      }
      setLocalFile(e.target.result);
      setLocalName(file.name);
      setLocation(null);
    }
  };

  const handleBookClick = (bookUrl) => {
    navigate("/App", { state: { bookUrl } });
  };

  return (
    <div className="home-page">
      <div className="navbar-header">
        <div className="logo">Emo-chan</div>
        <div className="hamburger">X</div>
      </div>
      <div className="search-and-add">
        <FileReaderInput as="buffer" onChange={handleChangeFile}>
          <button>Upload local epub</button>
        </FileReaderInput>
      </div>
      <div className="book-list">
        {books.map((book) => (
          <div
            className="book"
            key={book.id}
            onClick={() => handleBookClick(book.url)}
          >
            <img src={`${book.cover}`} alt={book.title} />
            <div className="book-details">
              <h3>{book.title}</h3>
              <p>Author: {book.author}</p>
              <p>Genre: {book.genre}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
// This is for passing props onlyu
// Router
// Props to the book
// Add logicv for import
// All book related function oncluding spotifty is not here

export default HomePage;