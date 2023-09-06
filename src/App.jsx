import { useState, useEffect, useRef } from "react";
import { ReactReader } from "react-reader";
import FileReaderInput from "react-file-reader-input";
import "./custom-reader-styles.css"; // Replace with the actual path
import SpotifyPlaylist from "./components/spotifyPlaylist";

const App = () => {
  const [location, setLocation] = useState(
    localStorage.getItem("epub-location") || 2
  );
  const [localFile, setLocalFile] = useState(null);
  const [localName, setLocalName] = useState(null);
  const [storyText, setStoryText] = useState("");
  const renditionRef = useRef(null);

  const defaultUrl = "https://react-reader.metabits.no/files/alice.epub"; // Replace with your default URL

  const getCfiChapter = (epubcifi) => {
    // Sample epubcifi: epubcfi(/6/6!/4/2/4[pgepubid00001]/1:0)
    // epubcifi is the status of the current rendered page in the epub

    // We want to extract the substring /6/6, which I used as a basis for the chapter number
    const match = epubcifi.match(/\/\d+\/\d+/);

    if (match) {
      const extractedSubstring = match[0];
      return extractedSubstring;
    } else {
      return null;
    }
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

  const locationChanged = (epubcifi) => {
    setLocation(epubcifi);
    console.log("locationChanged: epubcifi: ", getCfiChapter(epubcifi));
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
    // Access the book object
    const book = loadBook(renditionRef);

    if (book) {
      getCurrentChapterText(book)
        .then((result) => {
          // console.log(result, "result getcurrentchaptertext");
          // <EmotionPlaylist textContent={result} />;
          setStoryText(result);
          console.log(result);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [location]);

  return (
    <div className="" style={{ position: "relative" }}>
      <SpotifyPlaylist storyText={storyText} />
      <FileReaderInput as="buffer" onChange={handleChangeFile}>
        <button>Upload local epub</button>
      </FileReaderInput>
      <div style={{ height: "100vh" }}>
        <ReactReader
          location={location}
          locationChanged={locationChanged}
          url={localFile || defaultUrl}
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
