export const authEndpoint = "https://accounts.spotify.com/authorize";
const redirectUri = "http://localhost:5174/Emo-chan/";
const clientId = "0f3a23fadfdd45b0b60f86c80bf4238a";

const scopes = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-read-playback-state",
  "user-top-read",
  "user-modify-playback-state",
  "streaming",
  "user-read-email",
  "user-read-private",
  "playlist-read-private",
  "playlist-modify-public",
  "playlist-read-collaborative",
];

export const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
  "%20"
)}&response_type=token&show_dialog=true`;

export const getTokenFromUrl = () => {
  return window.location.hash
    .substring(1)
    .split("&")
    .reduce((acc, item) => {
      let parts = item.split("=");
      acc[parts[0]] = decodeURIComponent(parts[1]);
      return acc;
    }, {});
};
