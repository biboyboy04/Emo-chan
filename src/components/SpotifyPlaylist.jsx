import React, { useState, useEffect } from "react";
import { loadModel, loadTokenizer, predict } from "../emotionAnalysis.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./SpotifyPlaylist.module.scss";
import SpotifyWebPlayback from "./SpotifyPlaybackSDK";

// Can be separated to 2 components: EmotionPrediction and Playlist

function getPlaylistId(playlist) {
  const regex = /(?<=playlist\/)([^\/]+)/;
  return playlist.match(regex) ? playlist.match(regex)[1] : null;
}

function getPlaylistSrc(emotion) {
  var customPlaylist = JSON.parse(localStorage.getItem("playlistLinks"));
  const regex = /(?<=playlist\/)([^\/]+)/;
  var playlistId = "";
  switch (emotion) {
    case "joy":
      playlistId =
        customPlaylist && customPlaylist[0] && getPlaylistId(customPlaylist[0])
          ? getPlaylistId(customPlaylist[0])
          : "0ra1sgdNkKatWh3LOMEGCa";
      break;
    case "sadness":
      playlistId =
        customPlaylist && customPlaylist[1] && getPlaylistId(customPlaylist[1])
          ? getPlaylistId(customPlaylist[1])
          : "2hi47ni1BUFQMoDKACjgTZ";
      break;
    case "fear":
      playlistId =
        customPlaylist && customPlaylist[2] && getPlaylistId(customPlaylist[2])
          ? getPlaylistId(customPlaylist[2])
          : "5EbEfrwJPJEe4gLneh6onP";
      break;
    case "anger":
      playlistId =
        customPlaylist && customPlaylist[3] && getPlaylistId(customPlaylist[3])
          ? getPlaylistId(customPlaylist[3])
          : "6QZnHBnKUjL1TCxzDk2V5o";
      break;
  }
  const newSrc = `https://open.spotify.com/embed/playlist/${playlistId}`;
  return newSrc;
}

function SpotifyPlaylist({ storyText, setIsLoading }) {
  const [emotionResult, setEmotionResult] = useState("");
  const spotifyToken = localStorage.getItem("spotifyToken");

  useEffect(() => {
    let text = storyText;
    // Checks if the input text is just all whitespaces
    if (!text.trim()) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    async function loadModelAndTokenizer() {
      const model = await loadModel();
      const tokenizer = await loadTokenizer();
      const prediction = await predict(storyText, model, tokenizer);
      setEmotionResult(prediction);
      setIsLoading(false);
      console.log(prediction, "prediction");

      // Display a toast when there is a prediction
      notify(prediction);
    }
    loadModelAndTokenizer();
  }, [storyText, setIsLoading]);

  const notify = (emotion) => {
    toast.info(`Dominant Emotion: ${emotion}`, {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme:
        localStorage.getItem("selectedTheme") === "dark" ? "dark" : "light",
      icon: false,
    });
  };

  // const [progressValue, setProgressValue] = useState(50);

  // const handleProgressChange = (e) => {
  //   setProgressValue(e.target.value);
  // };

  return (
    <div className={styles.spotifyEmbed}>
      <ToastContainer
        style={{ backgroundColor: "transparent", fontFamily: "Playpen Sans" }}
        position="top-right"
        autoClose={2500}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {emotionResult === "" || emotionResult === "neutral" ? (
        <p className={styles.emotionText}>
          {emotionResult === "" ? "No Emotion" : "Neutral"}
        </p>
      ) : spotifyToken != null ? (
        <SpotifyWebPlayback
          playlistID={getPlaylistId(getPlaylistSrc(emotionResult))}
        />
      ) : (
        <iframe
          key={emotionResult}
          id="spotifyPlaylist"
          style={{
            borderRadius: "12px",
            width: "100%",
            height: "100%",
          }}
          src={getPlaylistSrc(emotionResult)}
          frameBorder="0"
          allowFullScreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          onError={() =>
            alert(
              "Error loading Spotify iframe. Please refresh the page. Sorry"
            )
          }
        ></iframe>
      )}
    </div>
  );
}

export default SpotifyPlaylist;
