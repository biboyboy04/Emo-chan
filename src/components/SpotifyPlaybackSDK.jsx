import React, { useEffect, useState, useRef } from "react";
import styles from "./SpotifyPlaybackSDK.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faForwardStep,
  faCirclePlay,
  faCirclePause,
  faShuffle,
  faVolumeHigh,
  faVolumeLow,
  faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";
import "../range-input.css";

const SpotifyWebPlayback = ({ playlistID }) => {
  const token = localStorage.getItem("spotifyToken");
  const [isPlaying, setIsPlaying] = useState(true);
  const playerRef = useRef(null);
  const [playerState, setPlayerState] = useState({
    songName: "",
    artistName: "",
    albumCover: "",
    position: 0,
    duration: 0,
    shuffle: false,
    volume: 0.3,
    mute: false,
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
        console.log("Changed playlist");
        setIsPlaying(true);

        // Commented this because the player automatically plays the song after changing playlist
        // playerRef.current.resume().then(() => {
        //   setIsPlaying(true);
        // });
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
      }).then((response) => {
        if (!response.ok) {
          throw new Error("Failed to start playback with specific device");
        }

        console.log("Playback started with specific device");
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
      ({ position, duration, shuffle, track_window: { current_track } }) => {
        let newSongInfo = {
          songName: current_track["name"],
          artistName: current_track["artists"][0]["name"],
          albumCover: current_track["album"]["images"][0]["url"],
          position: position,
          duration: duration,
          shuffle: shuffle,
        };
        setPlayerState(newSongInfo);
        console.log("shuffleState", shuffle);
      }
    );

    return () => {
      // Cleanup?
      console.log("PLAYER DISCONNECTED");
      playerRef.current.disconnect();
    };
  }, [token]);

  useEffect(() => {
    changePlaylist();
  }, [playlistID]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPlayerState((prevSongInfo) => ({
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
          src={playerState.albumCover || "https://via.placeholder.com/75"}
          alt="album cover"
          className={styles.albumCover}
        />
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.playerState}>
          <p className={styles.songName}>
            {playerState.songName || "Song Name"}
          </p>
          <p className={styles.artistName}>
            {playerState.artistName || "Artist Name"}
          </p>
        </div>
        <div className={styles.progressContainer}>
          <FontAwesomeIcon
            className={styles.previous}
            onClick={() => playerRef.current.previousTrack()}
            icon={faBackwardStep}
            size="lg"
          />

          <input
            type="range"
            min="0"
            max={playerState.duration || "1000"}
            value={playerState.position}
            className={`styled-slider slider-progress ${styles.progressBar}`}
            style={{
              "--value": playerState.position,
              "--min": "0",
              "--max": playerState.duration || "1000",
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
            onClick={() => playerRef.current.nextTrack()}
            icon={faForwardStep}
            size="lg"
          />
        </div>
      </div>
      <div className={styles.controlsContainer}>
        <FontAwesomeIcon
          className={`${styles.shuffle} ${
            playerState.shuffle ? styles.active : ""
          }`}
          onClick={() => {
            const newShuffleState = !playerState.shuffle;
            setPlayerState((prev) => ({
              ...prev,
              shuffle: newShuffleState,
            }));
            fetch(
              `https://api.spotify.com/v1/me/player/shuffle?state=${newShuffleState}`,
              {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          }}
          icon={faShuffle}
          size="lg"
        />

        <div className={styles.volumeContainer}>
          <FontAwesomeIcon
            className={styles.play}
            onClick={() => {
              playerRef.current.setVolume(
                playerState.mute ? playerState.volume : 0
              );

              setPlayerState((prev) => ({
                ...prev,
                mute: !prev.mute,
              }));
            }}
            icon={
              playerState.mute
                ? faVolumeXmark
                : playerState.volume > 0.5
                ? faVolumeHigh
                : faVolumeLow
            }
            size="sm"
          />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={playerState.volume}
            className={`styled-slider slider-progress ${styles.volumeBar}`}
            onChange={(e) => {
              const newVolume = parseFloat(e.target.value);
              setPlayerState((prev) => ({
                ...prev,
                volume: newVolume,
              }));
              if (!playerState.mute) {
                playerRef.current.setVolume(newVolume).then(() => {
                  console.log("Changed volume!");
                });
              }

              e.target.style.setProperty("--value", e.target.value);
            }}
          />
        </div>

        <FontAwesomeIcon
          className={styles.play}
          onClick={() => {
            playerRef.current.togglePlay().then(() => {
              setIsPlaying((prev) => !prev);
            });
          }}
          icon={isPlaying ? faCirclePause : faCirclePlay}
          size="2xl"
        />
      </div>
    </div>
  );
};

export default SpotifyWebPlayback;
