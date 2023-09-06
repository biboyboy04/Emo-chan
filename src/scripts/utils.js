export function slideEmbed(wrapper, arrow, isDown) {
  wrapper.classList.toggle("hide-embed", !isDown);
  arrow.className = `fa-solid fa-arrow-${isDown ? "down" : "up"} fa-xl`;
  wrapper.dataset.isDown = isDown ? "false" : "true";
}

export function changePlaylist(emotion, iframe) {
  var playlistId = "";
  switch (emotion) {
    case "joy":
      playlistId = "37i9dQZF1EIenYKDHoroaV";
      break;
    case "sadness":
      playlistId = "37i9dQZF1EIh1T1PukZNVG";
      break;
    case "fear":
      playlistId = "37i9dQZF1EIcDJGAGCcWsK";
      break;
    case "anger":
      playlistId = "6QZnHBnKUjL1TCxzDk2V5o";
      break;
  }
  const newSrc = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`;
  iframe.setAttribute("src", newSrc);
}
