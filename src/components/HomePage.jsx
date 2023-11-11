import FileReaderInput from "react-file-reader-input";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const books = [
    {
      id: 1,
      title: "Alice's Adventures in Wonderland",
      author: "Lewis Carroll",
      cover: "/public/e-books/alice.jpg",
      url: "/public/e-books/alice.epub",
    },
    {
      id: 2,
      title: "Grimms' Fairy Tales",
      author: "Jacob Grimm and Wilhelm Grimm",
      cover: "/public/e-books/grimms.png",
      url: "/public/e-books/grimms.epub",
    },
    {
      id: 3,
      title: "The Happy Prince and Other Tales",
      author: "Oscar Wilde",
      cover: "/public/e-books/happy_prince.jpg",
      url: "/public/e-books/happy_prince.epub",
    },
    {
      id: 4,
      title: "The Jungle Book",
      author: "Rudyard Kipling",
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
        <p style={{ fontSize: "3rem", marginBottom: "10px" }}>
          Transform your reading experience
        </p>
        <p style={{ fontSize: "1.5rem", margin: "10px 0", fontWeight: "350" }}>
          Emo-chan analyzes your E-book texts and plays emotionally relevant
          instrumental music based on the current chapter
        </p>
        <p style={{ fontSize: "1.25rem", fontWeight: "350" }}>
          Immerse yourself in a noise-free, emotion-enhanced literary journey
        </p>
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
                <p>{book.author}</p>
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
