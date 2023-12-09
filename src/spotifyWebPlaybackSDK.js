// SpotifyWebPlayback.js
export const SpotifyWebPlayback = (token, handlePlaybackError) => {
  var isShuffle = false;
  const player = new Spotify.Player({
    name: "Web Playback SDK Quick Start Player",
    getOAuthToken: (cb) => {
      cb(token);
    },
    volume: 0.5,
  });

  // Ready
  player.addListener("ready", ({ device_id }) => {
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

  // Not Ready
  player.addListener("not_ready", ({ device_id }) => {
    console.log("Device ID has gone offline", device_id);
  });

  player.addListener("initialization_error", ({ message }) => {
    console.log(message);
  });
  player.addListener("authentication_error", ({ message }) => {
    console.log(message);
  });
  player.addListener("account_error", handlePlaybackError);

  document.getElementById("togglePlay").onclick = () => {
    const playData = {
      context_uri: "spotify:playlist:0ra1sgdNkKatWh3LOMEGCa",
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
        player.togglePlay();
      })
      .catch((error) =>
        console.error("Error starting playback with specific data:", error)
      );
  };

  document.getElementById("toggleNext").onclick = () => {
    player.nextTrack();
  };

  document.getElementById("togglePrevious").onclick = () => {
    player.previousTrack();
  };

  document.getElementById("toggleShuffle").onclick = () => {
    isShuffle = !isShuffle;
    fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${isShuffle}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  player.connect().then((success) => {
    if (success) {
      console.log("The Web Playback SDK successfully connected to Spotify!");
      player.togglePlay();
    }
  });

  return player;
};
