import FileReaderInput from "react-file-reader-input";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const books = [
  {
    id: 1,
    title: "Alice's Adventures in Wonderland",
    author: "Lewis Carroll",
    cover: "e-books/alice.jpg",
    url: "e-books/alice.epub",
  },
  {
    id: 2,
    title: "Grimms' Fairy Tales",
    author: "Jacob Grimm and Wilhelm Grimm",
    cover: "e-books/grimms.png",
    url: "e-books/grimms.epub",
  },
  {
    id: 3,
    title: "Omniscient Reader's Viewpoint",
    author: "Singshong",
    cover: "e-books/ovr.jpg",
    url: "e-books/ovr.epub",
  },
  {
    id: 4,
    title: "The Jungle Book",
    author: "Rudyard Kipling",
    cover: "e-books/jungle_book.jpg",
    url: "e-books/jungle_book.epub",
  },
  // {
  //   id: 3,
  //   title: "The Happy Prince and Other Tales",
  //   author: "Oscar Wilde",
  //   cover: "e-books/happy_prince.jpg",
  //   url: "e-books/happy_prince.epub",
  // },
];

const HomePage = () => {
  const [playlistLinks, setPlaylistLinks] = useState(initialPlaylistLinks);
  const [isPlaylistVisible, setPlaylistVisible] = useState(false);

  const navigate = useNavigate();
  const playlistBoxRef = useRef(null);
  const initialPlaylistLinks =
    JSON.parse(localStorage.getItem("playlistLinks")) || Array(4).fill("");

  const handleFileChange = (event, results) => {
    if (results.length > 0) {
      const [e, file] = results[0];
      if (file.type !== "application/epub+zip") {
        return alert("Unsupported type. Please upload an epub file.");
      }
      console.log(file);
      console.log(e);
      navigate("/Emo-chan/App", { state: { book: e.target.result } });
    }
  };

  const handleBookClick = (bookUrl) => {
    navigate("/Emo-chan/App", { state: { book: bookUrl } });
  };

  function handleSavePlaylist() {
    if (!confirm("Are you sure you want to save the playlist?")) {
      return;
    }
    const playlistInputs = document.querySelectorAll(".playlist-input");
    const playlistLinks = [];
    playlistInputs.forEach((input) => {
      playlistLinks.push(input.value);
    });
    localStorage.setItem("playlistLinks", JSON.stringify(playlistLinks));

    setPlaylistVisible(false);
  }

  const handleInputChange = (event, idx) => {
    const newPlaylistLinks = [...playlistLinks];
    newPlaylistLinks[idx] = event.target.value;
    setPlaylistLinks(newPlaylistLinks);
  };

  const clearPlaylist = () => {
    if (!confirm("Are you sure you want to revert to default?")) {
      return;
    }
    localStorage.setItem("playlistLinks", JSON.stringify(Array(4).fill("")));
    setPlaylistLinks(...playlistLinks);
  };

  useEffect(() => {
    const handlePlaylistBox = (event) => {
      if (
        playlistBoxRef.current &&
        !playlistBoxRef.current.contains(event.target)
      ) {
        setPlaylistVisible(false);
      }
      if (event.target.className === "playlist-btn") {
        setPlaylistVisible(!isPlaylistVisible);
      }
    };
    // Add event listener to the document body
    document.body.addEventListener("click", handlePlaylistBox);

    // Clean up the event listener on component unmount
    return () => {
      document.body.removeEventListener("click", handlePlaylistBox);
    };
  }, [isPlaylistVisible]);

  return (
    <div className="home-page">
      <div className="navbar-header">
        {/* (•ᴗ•❁) | ˃̵ᴗ˂̵ */}
        <div className="logo">
          {" "}
          <span role="img" aria-label="Emo-chan" className="default-text">
            (•ᴗ•❁)Emo-chan
          </span>
          <span role="img" aria-label="Emo-chan" className="hover-text">
            (˃̵ᴗ˂̵❁)Emo-chan
          </span>
        </div>
        <div className="nav-links">
          <div className="playlist-btn">Playlist</div>
          <div
            id="playlistBox"
            className={`hidden-box ${isPlaylistVisible ? "visible" : ""}`}
            key={isPlaylistVisible}
            ref={playlistBoxRef}
          >
            {["Joy", "Sadness", "Fear", "Anger"].map((emotion, idx) => {
              return (
                <div className="playlist" key={emotion}>
                  <div className="playlist-title">{emotion}</div>
                  <input
                    type="text"
                    className="playlist-input"
                    placeholder="Enter spotify playlist link..."
                    value={playlistLinks[idx] || ""}
                    onChange={(event) => handleInputChange(event, idx)}
                  />
                </div>
              );
            })}

            <div className="action-buttons">
              <button
                className="action-button save-button"
                onClick={handleSavePlaylist}
              >
                Save
              </button>
              <button
                className="action-button revert-button"
                onClick={clearPlaylist}
              >
                Revert
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="home-page-header">
        <p style={{ fontSize: "3rem", marginBottom: "10px" }}>
          Transform your reading experience
        </p>
        <p style={{ fontSize: "1.5rem", margin: "10px 0", fontWeight: "350" }}>
          Emo-chan analyzes your E-book texts and recommends an emotionally
          relevant Spotify music based on the current chapter
        </p>
        <p style={{ fontSize: "1.25rem", fontWeight: "350" }}>
          Immerse yourself in a noise-free, emotion-enhanced literary journey
        </p>
        <p style={{ fontSize: "1.25rem", fontWeight: "350" }}></p>
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
