import React, { useEffect, useState, useRef } from "react";
import styles from "./SpotifyPlaybackSDK.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faForwardStep,
  faCirclePlay,
  faCirclePause,
  faShuffle,
} from "@fortawesome/free-solid-svg-icons";
import "../range-input.css";

const SpotifyWebPlayback = ({ playlistID }) => {
  const [isShuffle, setIsShuffle] = useState(false);
  const token = localStorage.getItem("spotifyToken");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(
    document.documentElement.getAttribute("data-theme") === "dark"
  );
  const playerRef = useRef(null);
  const [songInfo, setSongInfo] = useState({
    songName: "",
    artistName: "",
    albumCover: "",
    position: 0,
    duration: 0,
  });

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

        playerRef.current.togglePlay().then(() => {
          setIsPlaying(true);
        });
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
      volume: 0.3,
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
      }
    });

    console.log("USE EFFECT 1 RUNS");

    playerRef.current.addListener(
      "player_state_changed",
      ({ position, duration, track_window: { current_track } }) => {
        console.log("Currently Playing", current_track);
        let newSongInfo = {
          songName: current_track["name"],
          artistName: current_track["artists"][0]["name"],
          albumCover: current_track["album"]["images"][0]["url"],
          position: position,
          duration: duration,
        };
        console.log(newSongInfo);
        setSongInfo(newSongInfo);
      }
    );

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
    playerRef.current.togglePlay().then(() => {
      setIsPlaying((prev) => !prev);
    });
  };

  const handleToggleNext = () => {
    playerRef.current.nextTrack().then(() => {
      setIsPlaying(true);
    });
  };

  const handleTogglePrevious = () => {
    playerRef.current.previousTrack().then(() => {
      setIsPlaying(true);
    });
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

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSongInfo((prevSongInfo) => ({
        ...prevSongInfo,
        position: prevSongInfo.position + 1000,
      }));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isPlaying]);

  return (
    <div className={styles.musicPlayer}>
      <div className={styles.imageContainer}>
        <img
          src={songInfo.albumCover || "https://via.placeholder.com/75"}
          alt="album cover"
          className={styles.albumCover}
        />
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.songInfo}>
          <p className={styles.songName}>{songInfo.songName || "Song Name"}</p>
          <p className={styles.artistName}>
            {songInfo.artistName || "Artist Name"}
          </p>
        </div>
        <div className={styles.progressContainer}>
          <FontAwesomeIcon
            className={styles.previous}
            onClick={handleTogglePrevious}
            icon={faBackwardStep}
            size="lg"
          />

          <input
            type="range"
            min="0"
            max={songInfo.duration || "1000"}
            value={songInfo.position}
            className={`styled-slider slider-progress ${styles.progressBar}`}
            style={{
              "--value": songInfo.position,
              "--min": "0",
              "--max": songInfo.duration || "1000",
              width: "100%",
            }}
            onChange={(e) => {
              playerRef.current.seek(e.target.value).then(() => {
                console.log("Changed position!");
              });
              e.target.style.setProperty("--value", e.target.value);
            }}
          />

          <FontAwesomeIcon
            className={styles.next}
            onClick={handleToggleNext}
            icon={faForwardStep}
            size="lg"
          />
        </div>
      </div>
      <div className={styles.controlsContainer}>
        <FontAwesomeIcon
          className={`${styles.shuffle} ${isShuffle ? styles.active : ""}`}
          onClick={handleToggleShuffle}
          icon={faShuffle}
          size="lg"
        />

        <FontAwesomeIcon
          className={styles.play}
          onClick={handleTogglePlay}
          icon={isPlaying ? faCirclePlay : faCirclePause}
          size="2xl"
        />
      </div>
    </div>
  );
};

export default SpotifyWebPlayback;
