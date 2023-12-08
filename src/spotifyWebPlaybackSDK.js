// SpotifyWebPlayback.js
export const SpotifyWebPlayback = (token, handlePlaybackError) => {
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
    player.togglePlay();
  };

  document.getElementById("toggleNext").onclick = () => {
    player.nextTrack();
  };

  document.getElementById("togglePrevious").onclick = () => {
    player.previousTrack();
  };

  player.connect().then((success) => {
    if (success) {
      console.log("The Web Playback SDK successfully connected to Spotify!");
      player.togglePlay();
    }
  });

  return player;
};
