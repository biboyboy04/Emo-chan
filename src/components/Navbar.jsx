import { Navigate, useNavigate } from "react-router-dom";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import PlaylistInputBox from "./PlaylistInputBox";
import React from "react";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.scss";
import { loginUrl, getTokenFromUrl } from "../spotifyAuth.js";

const Navbar = ({ updateReactReader }) => {
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate("/Emo-chan/");
  };
  const initialTheme = localStorage.getItem("selectedTheme") || "light";
  const [isDarkMode, setDarkMode] = useState(initialTheme === "dark");
  const [userProfilePic, setUserProfilePic] = useState(null);

  useEffect(() => {
    const selectedTheme = isDarkMode ? "dark" : "light";
    localStorage.setItem("selectedTheme", selectedTheme);
    document.documentElement.setAttribute("data-theme", selectedTheme);
  }, [isDarkMode]);

  const toggleDarkMode = (checked) => {
    setDarkMode(checked);
    updateReactReader(checked);
  };

  const getUserProfilePic = (token) => {
    return fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user profile picture");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        const userProfilePic = data.images[0]?.url;
        console.log(userProfilePic);

        return userProfilePic;
      })
      .catch((error) => {
        console.error("Error fetching user profile picture:", error);
        return null;
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("spotifyToken");
    if (!token) return;
    getUserProfilePic(token).then((userProfilePic) => {
      setUserProfilePic(userProfilePic);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("spotifyToken");
    navigate("/Emo-chan/");
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.logo} onClick={handleLogoClick}>
        {" "}
        <span role="img" aria-label="Emo-chan" className={styles.defaultText}>
          (•ᴗ•❁)Emo-chan
        </span>
        <span role="img" aria-label="Emo-chan" className={styles.hoverText}>
          (˃̵ᴗ˂̵❁)Emo-chan
        </span>
      </div>
      <div className={styles.links}>
        {localStorage.getItem("spotifyToken") ? (
          <div className={styles.profileContainer} onClick={handleLogout}>
            <img
              className={styles.userProfilePic}
              src={userProfilePic}
              alt="User Profile"
            />
            <p className={styles.logoutTxt}>Logout</p>
          </div>
        ) : (
          <a className={styles.spotifyBtn} href={loginUrl}>
            Login with Spotify
          </a>
        )}

        <PlaylistInputBox />
        <DarkModeSwitch
          checked={isDarkMode}
          onChange={toggleDarkMode}
          size={"1.5rem"}
          moonColor={"var(--secondary-color)"}
          sunColor={"var(--secondary-color)"}
        />
      </div>
    </div>
  );
};
export default Navbar;
