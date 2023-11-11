import React from "react";
import FileReaderInput from "react-file-reader-input";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Reader from "../Reader";

const HomePage = () => {
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

  const handleFileChange = (event, results) => {
    if (results.length > 0) {
      const [e, file] = results[0];
      if (file.type !== "application/epub+zip") {
        return alert("Unsupported type. Please upload an epub file.");
      }
      //e.target.result = book file
      navigate("/App", { state: { book: e.target.result } });
    }
  };

  const handleBookClick = (bookUrl) => {
    navigate("/App", { state: { book: bookUrl } });
  };

  return (
    <div className="home-page">
      <div className="navbar-header">
        <div className="logo">Emo-chan</div>
        <div className="hamburger">X</div>
      </div>

      <div className="home-page-header">
        Transform your reading experience. Emo-chan analyzes E-book chapters,
        matches emotions, and plays fitting instrumental music. Immerse yourself
        in a noise-free, emotion-enhanced literary journey.
      </div>

      <div className="upload">
        <div className="upload-header-title">Have your own E-book?</div>
        <br />
        <FileReaderInput as="buffer" onChange={handleFileChange}>
          <button className="upload-button">Upload E-book</button>
        </FileReaderInput>
      </div>

      <div className="books">
        <div className="books-header">
          <div className="books-header-title">Choose a book</div>
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
    </div>
  );
};

export default HomePage;
