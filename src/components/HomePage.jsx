import React from "react";
import FileReaderInput from "react-file-reader-input";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Reader from "../Reader";
import Tilt from "react-parallax-tilt";
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
      summary: `Alice's Adventures in Wonderland" by Lewis Carroll is a whimsical and imaginative journey that follows the curious Alice as she falls down a rabbit hole into a fantastical world. Filled with eccentric characters and surreal encounters, the story captures the essence of childhood curiosity and the unpredictable nature of Wonderland. Lewis Carroll's classic tale is a timeless exploration of fantasy, adventure, and the joy of embracing the unexpected.`,
    },
    {
      id: 2,
      title: "Grimms' Fairy Tales",
      author: "Jacob Grimm and Wilhelm Grimm",
      genre: "Non-fiction",
      cover: "/public/e-books/grimms.png",
      url: "/public/e-books/grimms.epub",
      summary: `"Grimms' Fairy Tales" by Jacob Grimm and Wilhelm Grimm is a captivating collection of timeless folktales and fairy stories. Authored by the Brothers Grimm, the anthology includes enchanting narratives such as "Cinderella," "Snow White," "Hansel and Gretel," and many more. These tales are woven with magical elements, moral lessons, and enduring characters, making the book a beloved and enduring classic that continues to enchant readers of all ages.`,
    },
    {
      id: 3,
      title: "The Happy Prince and Other Tales",
      author: "Oscar Wilde",
      genre: "Mystery",
      cover: "/public/e-books/happy_prince.jpg",
      url: "/public/e-books/happy_prince.epub",
      summary: `"The Happy Prince and Other Tales" by Oscar Wilde is a collection of charming and poignant short stories. Crafted with Oscar Wilde's wit and literary flair, the tales explore themes of love, sacrifice, and the human condition. The titular story, "The Happy Prince," tells the tale of a golden statue who, despite his privileged past, discovers the true meaning of compassion and generosity. Wilde's collection weaves together fairy-tale elements with social commentary, creating a literary work that resonates with both children and adults, offering a blend of enchantment and thought-provoking reflections on life and morality.`,
    },
    {
      id: 4,
      title: "The Jungle Book",
      author: "Rudyard Kipling",
      genre: "Mystery",
      cover: "/public/e-books/jungle_book.jpg",
      url: "/public/e-books/jungle_book.epub",
      summary: `"The Jungle Book" by Rudyard Kipling is a classic collection of stories that vividly brings to life the enchanting world of the Indian jungle. The narrative revolves around Mowgli, a young boy raised by wolves, as he navigates the challenges and adventures of the wild. Through Mowgli's encounters with various animals, including the wise panther Bagheera and the fun-loving bear Baloo, Kipling explores themes of identity, survival, and the delicate balance of nature. "The Jungle Book" remains a beloved work that captivates readers with its rich storytelling, memorable characters, and the timeless lessons it imparts about the interconnectedness of all living things.`,
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
              className="book cover"
              key={book.id}
              onClick={() => handleBookClick(book.url)}
            >
              <img src={`${book.cover}`} alt={book.title} />
              <div className="book-details">
                <h3>{book.title}</h3>
                <p>Author: {book.author}</p>
                <p>{book.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <footer className="copyright">
        &copy; 2023 CSRPITOY. All Rights Reserved.
      </footer>
    </div>
  );
};

export default HomePage;
