import { useNavigate } from "react-router-dom";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import PlaylistInputBox from "./PlaylistInputBox";
import React from "react";
import { useEffect } from "react";
const Navbar = ({ updateReactReader }) => {
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate("/Emo-chan/");
  };
  const initialTheme = localStorage.getItem("selectedTheme") || "light";
  const [isDarkMode, setDarkMode] = React.useState(initialTheme === "dark");

  const toggleDarkMode = (checked) => {
    setDarkMode(checked);
    updateReactReader(checked);
  };

  useEffect(() => {
    const selectedTheme = isDarkMode ? "dark" : "light";
    localStorage.setItem("selectedTheme", selectedTheme);
    document.documentElement.setAttribute("data-theme", selectedTheme);
  }, [isDarkMode]);

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
