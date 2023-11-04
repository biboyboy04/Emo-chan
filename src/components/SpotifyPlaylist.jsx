import React, { useState, useEffect } from "react";
import {
  loadModel,
  loadTokenizer,
  predict,
} from "../scripts/emotionAnalysis.js";
import { slideEmbed } from "../scripts/utils.js";
import { changePlaylist } from "../scripts/utils.js";
import "./SpotifyPlayer.css";
// import TopRightEmotion from "./TopRightEmotion.jsx";

// Can be separated to 2 components: EmotionPrediction and Playlist

function SpotifyPlaylist({ storyText, setIsLoading }) {
  const [emotionResult, setEmotionResult] = useState("");
  const [isDown, setIsDown] = useState(false);
  // const [isLoading, setIsLoading] = useState(true); // State to track when loading the prediction

  useEffect(() => {
    // Load the model and tokenizer when the component mounts
    setIsLoading(true);
    async function loadModelAndTokenizer() {
      const model = await loadModel();
      const tokenizer = await loadTokenizer();
      const prediction = await predict(storyText, model, tokenizer);
      setEmotionResult(prediction);
      handlePlaylistChange(prediction);
      // setIsLoading(false);
      setIsLoading(false);
      console.log(prediction, "prediction");
    }
    loadModelAndTokenizer();
  }, [storyText, setIsLoading]);

  const handleSlideEmbed = () => {
    const spotifyWrapper = document.getElementById("spotifyWrapper");
    const arrowIcon = document.getElementById("arrowIcon");
    slideEmbed(spotifyWrapper, arrowIcon, isDown);
    setIsDown((prevIsDown) => !prevIsDown);
  };

  const handlePlaylistChange = (emotion) => {
    const iframe = document.getElementById("spotifyPlaylist");
    changePlaylist(emotion, iframe);
  };

  const spotifyPlaylistUrl = "";

  return (
    <div className="spotifyContainer">
      <div id="spotifyWrapper" data-is-down={false}>
        <div id="arrowUpDown" onClick={handleSlideEmbed}>
          <i
            id="arrowIcon"
            className={`fa-solid fa-arrow-${isDown ? "up" : "down"} fa-xl`}
            style={{ color: "#E1E1E1" }}
          ></i>
        </div>
        <iframe
          id="spotifyPlaylist"
          style={{
            borderRadius: "12px",
            width: "100%",
            height: "100%",
          }}
          src={spotifyPlaylistUrl}
          frameBorder="0"
          allowFullScreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
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
