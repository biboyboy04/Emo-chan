import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ReactReader } from "react-reader";
import SpotifyPlaylist from "./SpotifyPlaylist";
import ReactLoading from "react-loading";
import { useMediaQuery } from "react-responsive";
import Navbar from "./Navbar";
import { readerStyles, readerStylesMobile } from "../reactReaderStyles";
import styles from "./EBookReader.module.scss";

const EBookReader = () => {
  const [location, setLocation] = useState(
    localStorage.getItem("epub-location") || 0
  );
  const [isLoading, setIsLoading] = useState(true);
  const [storyText, setStoryText] = useState("");
  const [isDarkMode, setDarkMode] = useState(
    localStorage.getItem("selectedTheme") === "dark"
  );
  const [progressText, setProgressText] = useState(
    "Emotion Analysis in Progress..."
  );

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const chapterRef = useRef(null);
  const renditionRef = useRef(null);
  const locationParam = useLocation();

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

  // Callback function to update ReactReader
  const updateReactReader = (darkMode) => {
    if (renditionRef.current) {
      renditionRef.current.themes.override(
        "color",
        darkMode ? "white" : "black"
      );
      renditionRef.current.themes.override(
        "background",
        darkMode ? "#121212" : "white"
      );
      renditionRef.themes.default({
        body: {
          "-webkit-touch-callout": "none",
          "-webkit-user-select": "none",
          "-khtml-user-select": "none",
          "-moz-user-select": "none",
          "-ms-user-select": "none",
          "user-select": "none",
        },
      });
    }
  };

  // Update ReactReader when dark mode changes
  useEffect(() => {
    updateReactReader(isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const randomTexts = [
      "Analyzing emotions...",
      "Processing sentiments...",
      "Evaluating feelings...",
      "Calculating mood...",
      "Deciphering chapter emotions... ",
      "Analyzing vibes within the text...",
      "Processing chapter sentiments...",
    ];

    const setRandomText = () => {
      const randomIndex = Math.floor(Math.random() * randomTexts.length);
      setProgressText(randomTexts[randomIndex]);
    };

    const intervalId = setInterval(() => {
      setRandomText();
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.app}>
      <div style={{ padding: isMobile ? "0" : "0 2rem" }}>
        <Navbar updateReactReader={updateReactReader} />
      </div>
      {isLoading && (
        <div className={styles.loading}>
          <ReactLoading
            type={"spinningBubbles"}
            color={"white"}
            height={"auto"}
            width={isMobile ? "15%" : "5%"}
          />
          <div className={styles.text}>
            <p>{progressText}</p>
            <p>
              Sorry if the analysis is long; there&rsquo;s a lot of text to
              analyze. (╥﹏╥❁)
            </p>
          </div>
        </div>
      )}

      <div className={styles.reader}>
        <ReactReader
          location={location}
          locationChanged={(loc) => {
            setLocation(loc);
            localStorage.setItem("epub-location", loc);
          }}
          url={selectedBook}
          getRendition={(rendition) => {
            rendition.themes.override("color", isDarkMode ? "white" : "black");
            rendition.themes.override(
              "background",
              isDarkMode ? "#121212" : "white"
            );
            rendition.themes.default({
              body: {
                "-webkit-touch-callout": "none",
                "-webkit-user-select": "none",
                "-khtml-user-select": "none",
                "-moz-user-select": "none",
                "-ms-user-select": "none",
                "user-select": "none",
              },
            });
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
