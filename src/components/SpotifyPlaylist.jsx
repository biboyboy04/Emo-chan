import React, { useState, useEffect } from "react";
import {
  loadModel,
  loadTokenizer,
  predict,
} from "../scripts/emotionAnalysis.js";
import "./SpotifyPlayer.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import TopRightEmotion from "./TopRightEmotion.jsx";

// Can be separated to 2 components: EmotionPrediction and Playlist
function changePlaylistSrc(emotion) {
  var playlistId = "";
  switch (emotion) {
    case "joy":
      playlistId = "0ra1sgdNkKatWh3LOMEGCa";
      break;
    case "sadness":
      playlistId = "2hi47ni1BUFQMoDKACjgTZ";
      break;
    case "fear":
      playlistId = "5EbEfrwJPJEe4gLneh6onP";
      break;
    case "anger":
      playlistId = "6QZnHBnKUjL1TCxzDk2V5o";
      break;
  }
  const newSrc = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`;
  return newSrc;
}

function SpotifyPlaylist({ storyText, setIsLoading }) {
  const [emotionResult, setEmotionResult] = useState("");
  const [isDown, setIsDown] = useState(false);
  // const [isLoading, setIsLoading] = useState(true); // State to track when loading the prediction

  useEffect(() => {
    let text = storyText;
    if (!text.trim()) {
      setIsLoading(false);
      setIsDown(true);
      return;
    }
    setIsLoading(true);
    async function loadModelAndTokenizer() {
      const model = await loadModel();
      const tokenizer = await loadTokenizer();
      const prediction = await predict(storyText, model, tokenizer);
      setEmotionResult(prediction);
      setIsDown(false);
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
      autoClose: 2000,
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
        autoClose={2000}
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
