import React, { useEffect, useState, useRef } from "react";
import styles from "./SpotifyPlaybackSDK.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faForwardStep,
  faCirclePlay,
  faShuffle,
} from "@fortawesome/free-solid-svg-icons";
import "../range-input.css";

const SpotifyWebPlayback = ({ playlistID }) => {
  const [isShuffle, setIsShuffle] = useState(false);
  const token = localStorage.getItem("spotifyToken");
  const playerRef = useRef(null);

  const changePlaylist = () => {
    const playData = {
      context_uri: "spotify:playlist:" + playlistID,
    };

    fetch("https://api.spotify.com/v1/me/player/play", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to start playback with specific data");
        }
        playerRef.current.togglePlay();
      })
      .catch((error) =>
        console.error("Error starting playback with specific data:", error)
      );
  };

  useEffect(() => {
    if (!token) return;
    playerRef.current = new Spotify.Player({
      name: "Web Playback SDK Quick Start Player",
      getOAuthToken: (cb) => {
        cb(token);
      },
      volume: 0.5,
    });

    playerRef.current.addListener("ready", ({ device_id }) => {
      console.log("Ready with Device ID", device_id);

      // Automatically change to the newly created Spotify Connect
      fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device_ids: [device_id],
          play: true,
        }),
      });
    });

    playerRef.current.addListener("not_ready", ({ device_id }) => {
      console.log("Device ID has gone offline", device_id);
    });

    playerRef.current.addListener("initialization_error", ({ message }) => {
      console.log(message);
    });

    playerRef.current.addListener("authentication_error", ({ message }) => {
      console.log(message);
    });

    playerRef.current.addListener("account_error", ({ message }) => {
      console.log(message);
    });

    playerRef.current.connect().then((success) => {
      if (success) {
        console.log("The Web Playback SDK successfully connected to Spotify!");
        playerRef.current.togglePlay();
      }
    });

    console.log("USE EFFECT 1 RUNS");

    return () => {
      // Cleanup?
      // playerRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log("USE EFFECT 2 RUNS");
    changePlaylist();
  }, [playlistID]);

  const handleTogglePlay = () => {
    playerRef.current.togglePlay();
  };

  const handleToggleNext = () => {
    playerRef.current.nextTrack();
  };

  const handleTogglePrevious = () => {
    playerRef.current.previousTrack();
  };

  const handleToggleShuffle = () => {
    setIsShuffle((prevShuffle) => !prevShuffle);
    fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${isShuffle}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return (
    <div className={styles.musicPlayer}>
      <div className={styles.imageContainer}>
        <img
          src="https://via.placeholder.com/75"
          alt="album cover"
          className={styles.albumCover}
        />
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.songInfo}>
          <p className={styles.songName}>Song Name</p>
          <p className={styles.artistName}>Artist Name</p>
        </div>
        <div className={styles.progressContainer}>
          <button id="togglePrevious" onClick={handleTogglePrevious}>
            <FontAwesomeIcon
              icon={faBackwardStep}
              size="lg"
              style={{ color: "black" }}
            />
          </button>

          <input
            type="range"
            min="0"
            max="100"
            //   value={progressValue}
            //   onChange={handleProgressChange}
            className="styled-slider slider-progress"
            //   style={{
            //     "--value": progressValue,
            //     "--min": "0",
            //     "--max": "100",
            //     width: "100%",
            //   }}
          />
          <button id="toggleNext" onClick={handleToggleNext}>
            <FontAwesomeIcon
              icon={faForwardStep}
              size="lg"
              style={{ color: "black" }}
            />
          </button>
        </div>
      </div>
      <div className={styles.controlsContainer}>
        <button id="toggleShuffle" onClick={handleToggleShuffle}>
          <FontAwesomeIcon
            icon={faShuffle}
            size="lg"
            style={{ color: "black" }}
          />
        </button>
        <button id="togglePlay" onClick={handleTogglePlay}>
          <FontAwesomeIcon
            icon={faCirclePlay}
            size="2xl"
            style={{ color: "black" }}
          />
        </button>
      </div>
    </div>
  );
};

export default SpotifyWebPlayback;
