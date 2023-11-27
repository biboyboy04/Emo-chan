import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ReactReader, ReactReaderStyle } from "react-reader";
import SpotifyPlaylist from "./spotifyPlaylist";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

const readerStyles = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    backgroundColor: "white",
    color: "black",
    fontWeight: 100,
    fontFamily: "Playpen Sans",
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
    fontFamily: "Playpen Sans",
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
};

const readerStylesMobile = {
  ...readerStyles,
  arrow: {
    ...ReactReaderStyle.arrow,
    backgroundColor: "white",
    color: "black",
    fontWeight: 300,
    fontFamily: "Playpen Sans",
    fontSize: "2rem",
    padding: "0px",
    marginTop: "-10px",
    zIndex: "100",
  },
  next: {
    ...ReactReaderStyle.next,
    top: "10px",
    right: "10px",
  },
  prev: {
    ...ReactReaderStyle.prev,
    top: "10px",
    right: "40px",
    left: "auto",
  },
  reader: {
    ...ReactReaderStyle.reader,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    height: "calc(100% - 50px)",
    marginTop: "20px",
  },
};

const EBookReader = () => {
  const [location, setLocation] = useState(
    localStorage.getItem("epub-location") || 0
  );
  const [isLoading, setIsLoading] = useState(true);
  const [storyText, setStoryText] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const chapterRef = useRef(null);
  const renditionRef = useRef(null);
  const navigate = useNavigate();
  const locationParam = useLocation();

  const initialPlaylistLinks =
    JSON.parse(localStorage.getItem("playlistLinks")) || Array(4).fill("");
  const [playlistLinks, setPlaylistLinks] = useState(initialPlaylistLinks);
  const [isPlaylistVisible, setPlaylistVisible] = useState(false);
  const playlistBoxRef = useRef(null);

  const selectedBook = locationParam.state.book;

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
        if (section.cfiBase === getCfiChapter(location)) {
          try {
            const contents = await section.load(book.load.bind(book));
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
            console.log(result, "asd");
            setStoryText(result);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  }, [location]);

  const handleLogoClick = () => {
    navigate("/Emo-chan/");
  };

  function handleSavePlaylist() {
    const playlistInputs = document.querySelectorAll(".playlist-input");
    const playlistLinks = [];
    const errorMessages = [];

    const regex =
      /(?:^|\s)(https:\/\/open\.spotify\.com\/playlist\/[a-zA-Z0-9]{22})(?=\?|$)/;

    playlistInputs.forEach((input, idx) => {
      if (input.value.match(regex)) {
        playlistLinks.push(input.value);
        errorMessages[idx] = "";
      } // if the user leave it blank,  it's not an error
      else if (input.value == "") {
        playlistLinks.push("");
        errorMessages[idx] = "";
      } else {
        errorMessages[idx] = "Invalid playlist link";
        playlistLinks.push("");
      }
    });

    setErrorMessages(errorMessages);
    // check the errorMessages if there are no errors
    if (errorMessages.every((error) => error === "")) {
      if (!confirm("Are you sure you want to save the playlist?")) {
        return;
      }
      localStorage.setItem("playlistLinks", JSON.stringify(playlistLinks));
      console.log(JSON.parse(localStorage.getItem("playlistLinks")));

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

  return (
    <div className="app-container">
      <div
        className="navbar-header"
        style={{ paddingLeft: "2rem", paddingRight: "2rem" }}
      >
        {/* (•ᴗ•❁) | ˃̵ᴗ˂̵ */}
        <div className="logo" onClick={handleLogoClick}>
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
                  {errorMessages[idx] && (
                    <p className="playlist-error" key={emotion}>
                      {errorMessages[idx]}
                    </p>
                  )}
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
      {isLoading && (
        <div className="loading">
          <ReactLoading
            type={"spin"}
            color={"white"}
            height={"auto"}
            width={"10%"}
          />
          <div className="loading-text">
            <p>Emotion Analysis in Progress...</p>
            <p>
              Sorry if the analysis is long; there&rsquo;s a lot of text to
              analyze. (╥﹏╥❁)
            </p>
          </div>
        </div>
      )}
      <div className="reader-container" key={isLoading}>
        <ReactReader
          location={location}
          locationChanged={(loc) => {
            setLocation(loc);
            localStorage.setItem("epub-location", loc);
          }}
          url={selectedBook}
          getRendition={(rendition) => {
            renditionRef.current = rendition;
          }}
          epubOptions={{
            allowPopups: true,
            allowScriptedContent: true,
            flow: "scrolled",
          }}
          readerStyles={isMobile ? readerStylesMobile : readerStyles}
        />
      </div>
      <SpotifyPlaylist storyText={storyText} setIsLoading={setIsLoading} />
    </div>
  );
};

export default EBookReader;
