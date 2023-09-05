import { useState } from "react";
import { ReactReader, ReactReaderStyle } from "react-reader";
import "./custom-reader-styles.css"; // Replace with the actual path
import FileReaderInput from "react-file-reader-input";

const ownStyles = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    color: "red",
  },
};

const App = () => {
  const locationChanged = (epubcifi) => {
    setLocation(epubcifi);
  };

  const [location, setLocation] = useState(
    localStorage.getItem("epub-location") || 2
  );
  const [localFile, setLocalFile] = useState(null);
  const [localName, setLocalName] = useState(null);

  const defaultUrl = "https://react-reader.metabits.no/files/alice.epub"; // Replace with your default URL

  const handleChangeFile = (event, results) => {
    if (results.length > 0) {
      const [e, file] = results[0];
      if (file.type !== "application/epub+zip") {
        return alert("Unsupported type");
      }
      setLocalFile(e.target.result);
      setLocalName(file.name);
      setLocation(null);
    }
  };

  return (
    <div className="">
      <FileReaderInput as="buffer" onChange={handleChangeFile}>
        <button>Upload local epub</button>
      </FileReaderInput>
      <div style={{ height: "100vh" }}>
        <ReactReader
          location={location}
          locationChanged={locationChanged}
          url={localFile || defaultUrl} // Use localFile or the default URL
        />
      </div>
    </div>
  );
};

export default App;
