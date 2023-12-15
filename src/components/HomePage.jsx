import FileReaderInput from "react-file-reader-input";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import bookDetails from "../isbnBookDetails.js";
import { loginUrl, getTokenFromUrl } from "../spotifyAuth.js";
import { SpotifyWebPlayback } from "../spotifyWebPlaybackSDK.js";
import { useState, useEffect } from "react";
import styles from "./HomePage.module.scss";

const HomePage = () => {
  const navigate = useNavigate();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("spotifyToken")) {
      return;
    }
    const spotifyToken = getTokenFromUrl().access_token;
    console.log("SPOTIFY TOKEN", spotifyToken);

    if (spotifyToken) {
      localStorage.setItem("spotifyToken", spotifyToken);
      setHasToken(true);
    } else {
      setHasToken(false);
    }

    // window.onSpotifyWebPlaybackSDKReady = () => {
    //   SpotifyWebPlayback(_spotifyToken);
    // };
  }, []);

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

  return (
    <div className={styles.homepage}>
      <Navbar key={hasToken} />

      <div className={styles.hero}>
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

      <div className={styles.upload}>
        <div className={styles.header}>Have your own E-book?</div>
        <br />
        <FileReaderInput as="buffer" onChange={handleFileChange}>
          <button className={styles.btn}>Upload E-book</button>
        </FileReaderInput>
      </div>

      <div className={styles.books}>
        <div className={styles.header}>
          <div className={styles.title}>Choose a book</div>
        </div>
        <div className={styles.list}>
          {bookDetails.map((book) => (
            <div
              className={`${styles.book} ${styles.cover}`}
              key={book.id}
              onClick={() => handleBookClick(book.url)}
            >
              <img src={`${book.cover}`} alt={book.title} />
              <div className={styles.details}>
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
