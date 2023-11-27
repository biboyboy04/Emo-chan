import FileReaderInput from "react-file-reader-input";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar";

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
  const navigate = useNavigate();
  const playlistBoxRef = useRef(null);
  const [playlistLinks, setPlaylistLinks] = useState(
    JSON.parse(localStorage.getItem("playlistLinks")) || Array(4).fill("")
  );
  const [isPlaylistVisible, setPlaylistVisible] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

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
    const playlistInputs = document.querySelectorAll(".playlist-input");
    const newPlaylistLinks = [];
    const newErrorMessages = [];

    const regex =
      /(?:^|\s)(https:\/\/open\.spotify\.com\/playlist\/[a-zA-Z0-9]{22})(?=\?|$)/;

    playlistInputs.forEach((input, idx) => {
      if (input.value.match(regex)) {
        newPlaylistLinks.push(input.value);
        newErrorMessages[idx] = "";
      } // if the user leave it blank,  it's not an error
      else if (input.value == "") {
        newPlaylistLinks.push("");
        newErrorMessages[idx] = "";
      } else {
        newErrorMessages[idx] = "Invalid playlist link";
        newPlaylistLinks.push("");
      }
    });

    setErrorMessages(newErrorMessages);

    // check the errorMessages if there are no errors
    if (newErrorMessages.every((error) => error === "")) {
      if (!confirm("Are you sure you want to save the playlist?")) {
        return;
      }
      localStorage.setItem("playlistLinks", JSON.stringify(playlistLinks));
      setPlaylistVisible(false);
    }
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
    const emptyArray = Array(4).fill("");
    localStorage.setItem("playlistLinks", JSON.stringify(emptyArray));
    setPlaylistLinks(emptyArray);
    setErrorMessages(emptyArray);
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
    document.body.addEventListener("mousedown", handlePlaylistBox);

    // Clean up the event listener on component unmount
    return () => {
      document.body.removeEventListener("mousedown", handlePlaylistBox);
    };
  }, [isPlaylistVisible]);

  const updatePlaylistRef = (playlistRef) => {
    playlistBoxRef.current = playlistRef;
  };

  return (
    <div className="home-page">
      <Navbar
        isPlaylistVisible={isPlaylistVisible}
        updatePlaylistRef={updatePlaylistRef}
        playlistLinks={playlistLinks}
        onInputChange={handleInputChange}
        handleSavePlaylist={handleSavePlaylist}
        clearPlaylist={clearPlaylist}
        errorMessages={errorMessages}
      />

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
