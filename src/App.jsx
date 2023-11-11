import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ReactReader, ReactReaderStyle } from "react-reader";
import FileReaderInput from "react-file-reader-input";
import "./custom-reader-styles.css"; // Replace with the actual path
import SpotifyPlaylist from "./components/spotifyPlaylist";
import ReactLoading from "react-loading";
import { Link, useNavigate } from "react-router-dom";

const App = () => {
  const [location, setLocation] = useState(
    localStorage.getItem("epub-location")
  );
  const [isLoading, setIsLoading] = useState(true);
  const [storyText, setStoryText] = useState("");

  const chapterRef = useRef(null);
  const renditionRef = useRef(null);

  const navigate = useNavigate();

  const locationParam = useLocation();
  const selectedBook = locationParam.state.book;

  // Can be more shorter
  const getCfiChapter = (epubcifi) => {
    console.log(epubcifi);
    // Sample epubcifi: epubcfi(/6/6!/4/2/4[pgepubid00001]/1:0)
    // epubcifi is the status of the current rendered page in the epub

    // We want to extract the substring /6/6, which I used as a basis for the chapter number
    if (typeof epubcifi === "string") {
      const match = epubcifi.match(/\/\d+\/\d+/);

      if (match) {
        const extractedSubstring = match[0];
        return extractedSubstring;
      }
    }

    return null;
  };

  const loadBook = (renditionRef) => {
    return renditionRef.current ? renditionRef.current.book : null;
  };

  const getCurrentChapterText = async (book) => {
    const bookSpine = await book.loaded.spine;

    return new Promise((resolve, reject) => {
      bookSpine.each(async (section) => {
        if (section.index > 1 && section.cfiBase === getCfiChapter(location)) {
          try {
            const contents = await section.load(book.load.bind(book));
            // contents = html dom element of the chapter
            const bodyElement = contents.querySelector("body");
            if (bodyElement) {
              resolve(bodyElement.textContent);
            } else {
              reject(new Error("No body element found in the chapter."));
            }
          } catch (error) {
            reject(error);
          }
        }
      });
    });
  };

  useEffect(() => {
    // When the location changes, get and change the chapter
    const currentChapter = getCfiChapter(location);

    // When the chapter changes, get the text of the current chapter
    if (currentChapter !== chapterRef.current) {
      chapterRef.current = currentChapter;

      // Access the book object
      const book = loadBook(renditionRef);
      if (book) {
        getCurrentChapterText(book)
          .then((result) => {
            setStoryText(result);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  }, [location]);

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="app-container">
      <div className="navbar-header">
        <div className="logo" onClick={handleLogoClick}>
          Emo-chan
        </div>
      </div>
      {isLoading && (
        <div className="loading">
          <ReactLoading
            type={"spin"}
            color={"white"}
            height={"auto"}
            width={"10%"}
          />
          <div className="loading-text">Emotion Analysis in Progress...</div>
        </div>
      )}
      <SpotifyPlaylist storyText={storyText} setIsLoading={setIsLoading} />

      <div className="reader-container">
        <ReactReader
          location={location}
          locationChanged={setLocation}
          url={selectedBook}
          getRendition={(rendition) => {
            renditionRef.current = rendition;
          }}
          epubInitOptions={{
            openAs: "epub",
          }}
          epubOptions={{
            allowPopups: true,
            allowScriptedContent: true,
          }}
          readerStyles={{
            ...ReactReaderStyle,
            arrow: {
              ...ReactReaderStyle.arrow,
              backgroundColor: "white",
              color: "black",
              fontWeight: 100,
            },
            tocArea: {
              ...ReactReaderStyle.tocArea,
              backgroundColor: "white",
              color: "black",
            },
            tocAreaButton: {
              ...ReactReaderStyle.tocAreaButton,
              backgroundColor: "white",
              color: "black",
            },
            tocButtonBar: {
              ...ReactReaderStyle.tocButtonBar,
              backgroundColor: "black",
            },
            tocButton: {
              ...ReactReaderStyle.tocButton,
              backgroundColor: "white",
              color: "black",
            },
            tocButtonExpanded: {
              ...ReactReaderStyle.tocButtonExpanded,
              backgroundColor: "white",
            },
          }}
        />
      </div>
    </div>
  );
};

export default App;
