import { useState, useEffect, useRef } from "react";
const PlaylistInputBox = () => {
  const [playlistLinks, setPlaylistLinks] = useState(
    JSON.parse(localStorage.getItem("playlistLinks")) || Array(4).fill("")
  );
  const [isPlaylistVisible, setPlaylistVisible] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const playlistBoxRef = useRef(null);

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
    <div className="playlist-input-container">
      <div className="playlist-btn">Playlist</div>
      <div
        id="playlistBox"
        className={`hidden-box ${isPlaylistVisible ? "visible" : ""}`}
        key={isPlaylistVisible}
        ref={updatePlaylistRef}
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
  );
};
export default PlaylistInputBox;
