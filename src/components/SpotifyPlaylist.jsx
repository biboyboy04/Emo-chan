import React, { useState, useEffect } from "react";
import {
  loadModel,
  loadTokenizer,
  predict,
} from "../scripts/emotionAnalysis.js";
import "./SpotifyPlayer.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Can be separated to 2 components: EmotionPrediction and Playlist
function changePlaylistSrc(emotion) {
  var customPlaylist = JSON.parse(localStorage.getItem("playlistLinks"));
  const regex = /(?<=playlist\/)([^\/]+)/;
  var playlistId = "";
  switch (emotion) {
    case "joy":
      playlistId =
        customPlaylist && customPlaylist[0] && customPlaylist[0].match(regex)
          ? customPlaylist[0].match(regex)[1]
          : "0ra1sgdNkKatWh3LOMEGCa";
      break;
    case "sadness":
      playlistId =
        customPlaylist && customPlaylist[1] && customPlaylist[1].match(regex)
          ? customPlaylist[1].match(regex)[1]
          : "2hi47ni1BUFQMoDKACjgTZ";
      break;
    case "fear":
      playlistId =
        customPlaylist && customPlaylist[2] && customPlaylist[2].match(regex)
          ? customPlaylist[2].match(regex)[1]
          : "5EbEfrwJPJEe4gLneh6onP";
      break;
    case "anger":
      playlistId =
        customPlaylist && customPlaylist[3] && customPlaylist[3].match(regex)
          ? customPlaylist[3].match(regex)[1]
          : "6QZnHBnKUjL1TCxzDk2V5o";
      break;
  }
  const newSrc = `https://open.spotify.com/embed/playlist/${playlistId}`;
  return newSrc;
}

// Refactor
// function changePlaylistSrc(emotion) {
//   const customPlaylist = JSON.parse(localStorage.getItem("playlistLinks"));
//   console.log(customPlaylist);
//   const regex = /(?<=playlist\/)([^/]+)/;
//   const defaultPlaylists = {
//     joy: "0ra1sgdNkKatWh3LOMEGCa",
//     sadness: "2hi47ni1BUFQMoDKACjgTZ",
//     fear: "5EbEfrwJPJEe4gLneh6onP",
//     anger: "6QZnHBnKUjL1TCxzDk2V5o",
//   };

//   const playlistId =
//     customPlaylist[emotion].match(regex)[1] || defaultPlaylists[emotion];
//   const newSrc = `https://open.spotify.com/embed/playlist/${playlistId}`;

//   return newSrc;
// }

function SpotifyPlaylist({ storyText, setIsLoading }) {
  const [emotionResult, setEmotionResult] = useState("");

  useEffect(() => {
    let text = storyText;
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
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      icon: false,
    });
  };

  return (
    <div className="spotify-embed">
      <ToastContainer
        style={{ backgroundColor: "transparent", fontFamily: "Playpen Sans" }}
        position="top-right"
        autoClose={3000}
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
        <p
          style={{
            fontSize: "2rem",
            marginBottom: "10px",
            color: "black",
            margin: "auto 0",
            textAlign: "center",
          }}
        >
          {emotionResult === "" ? "No Emotion" : "Neutral"}
        </p>
      ) : (
        <iframe
          key={emotionResult}
          id="spotifyPlaylist"
          style={{
            borderRadius: "12px",
            width: "100%",
            height: "100%",
          }}
          src={changePlaylistSrc(emotionResult)}
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
