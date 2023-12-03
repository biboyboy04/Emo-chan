import { useNavigate } from "react-router-dom";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import PlaylistInputBox from "./PlaylistInputBox";
import React from "react";
import { useEffect, useContext } from "react";
import ThemeContext from "./ThemeContext";
const Navbar = ({ onChangeTheme }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/Emo-chan/");
  };
  const theme = useContext(ThemeContext);

  useEffect(() => {
    localStorage.setItem("selectedTheme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="navbar-header">
      <div className="logo" onClick={handleLogoClick}>
        {" "}
        <span role="img" aria-label="Emo-chan" className="default-text">
          (•ᴗ•❁)Emo-chan
        </span>
        <span role="img" aria-label="Emo-chan" className="hover-text">
          (˃̵ᴗ˂̵❁)Emo-chan
        </span>
      </div>
      <div className="nav-links">
        <PlaylistInputBox />
        <DarkModeSwitch
          checked={theme === "dark"}
          onChange={(isDark) => {
            onChangeTheme(isDark ? "dark" : "light");
          }}
          size={"1.5rem"}
          moonColor={"var(--secondary-color)"}
          sunColor={"var(--secondary-color)"}
        />
      </div>
    </div>
  );
};
export default Navbar;
