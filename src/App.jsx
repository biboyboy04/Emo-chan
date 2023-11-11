import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ReactReader } from "react-reader";
import FileReaderInput from "react-file-reader-input";
import "./custom-reader-styles.css"; // Replace with the actual path
import SpotifyPlaylist from "./components/spotifyPlaylist";
import ReactLoading from "react-loading";

const App = () => {
  const [location, setLocation] = useState(
    localStorage.getItem("epub-location") || 2
  );
  const [localFile, setLocalFile] = useState(null);
  const [localName, setLocalName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [storyText, setStoryText] = useState("");

  const chapterRef = useRef(null);
  const renditionRef = useRef(null);

  const locationParam = useLocation();
  console.log(locationParam, "locationParam");
  const selectedBook = locationParam.state.bookId;
  console.log(selectedBook, "selectedBook");

  const defaultUrl = "/public/e-books/grimms.epub"; // Replace with your default URL

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

    return null; // Return null if the parameter is not a string or doesn't match the pattern
  };

  const loadBook = (renditionRef) => {
    if (renditionRef.current) {
      const book = renditionRef.current.book;
      return book;
    } else {
      return null;
    }
  };

  const getCurrentChapterText = async (book) => {
    const bookSpine = await book.loaded.spine;

    return new Promise((resolve, reject) => {
      bookSpine.each(async (section) => {
        // Section == Chapter
        // most ebook chapters starts at index 2
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

  useEffect(() => {
    // When the location changes, get and change the chapter
    const currentChapter = getCfiChapter(location);

    // When the chapter changes, get the text of the current chapter
    if (currentChapter !== chapterRef.current) {
      chapterRef.current = currentChapter;

      // Access the book object
      const book = loadBook(renditionRef);
      // double chech if redundant code : if book check
      if (book) {
        getCurrentChapterText(book)
          .then((result) => {
            setStoryText(result);
            // console.log(result);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  }, [location]);

  return (
    <div className="app-container">
      {isLoading && (
        <div className="loading">
          <ReactLoading
            type={"spin"}
            color={"white"}
            height={"auto"}
            width={"15%"}
          />
          <div className="loading-text">Emotion Analysis in Progress...</div>
        </div>
      )}
      <SpotifyPlaylist storyText={storyText} setIsLoading={setIsLoading} />

      <FileReaderInput as="buffer" onChange={handleChangeFile}>
        <button>Upload local epub</button>
      </FileReaderInput>

      <div className="reader-container">
        <ReactReader
          location={location}
          locationChanged={setLocation}
          url={localFile || selectedBook}
          getRendition={(rendition) => {
            renditionRef.current = rendition;
          }}
          epubOptions={{
            allowPopups: true,
            allowScriptedContent: true,
          }}
        />
      </div>
    </div>
  );
};

export default App;
