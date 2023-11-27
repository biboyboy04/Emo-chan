import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Navbar = ({
  isPlaylistVisible,
  updatePlaylistRef,
  playlistLinks,
  onInputChange,
  handleSavePlaylist,
  clearPlaylist,
  emotions,
  errorMessages,
}) => {
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate("/Emo-chan/");
  };

  return (
    <div className="navbar-header">
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
                  onChange={(event) => onInputChange(event, idx)}
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
  );
};
export default Navbar;
