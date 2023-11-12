import React, { useState, useEffect } from "react";
import {
  loadModel,
  loadTokenizer,
  predict,
} from "../scripts/emotionAnalysis.js";
import "./SpotifyPlayer.css";
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
    // Load the model and tokenizer when the component mounts
    if (storyText == "") {
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
    }
    loadModelAndTokenizer();
  }, [storyText, setIsLoading]);

  return (
    <div className="spotifyContainer">
      <div
        id="spotifyWrapper"
        className={`${isDown ? "hide-embed" : ""}`}
        data-is-down={isDown}
      >
        <div
          id="arrowUpDown"
          onClick={() => setIsDown((prevDown) => !prevDown)}
        >
          <i
            id="arrowIcon"
            className={`fa-solid fa-arrow-${isDown ? "up" : "down"} fa-xl`}
            style={{ color: "white" }}
          ></i>
        </div>
        {emotionResult === "" || emotionResult === "neutral" ? (
          <p
            style={{
              fontSize: "2rem",
              marginBottom: "10px",
              color: "white",
              margin: "auto 0",
            }}
          >
            {emotionResult === "" ? "No Emotion" : "Neutral"}
          </p>
        ) : (
          <iframe
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
          ></iframe>
        )}
      </div>

      {/* Show loading message while waiting for prediction */}
      {/* {isLoading && <div>Loading emotion prediction...</div>} */}

      {/* Show the TopRightEmotion component only after the prediction is ready */}
      {/* {isPredictionReady && !isLoading && emotionResult !== undefined && (
        <TopRightEmotion emotion={emotionResult} />
      )} */}
    </div>
  );
}

export default SpotifyPlaylist;
