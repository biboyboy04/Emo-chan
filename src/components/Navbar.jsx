import { useNavigate } from "react-router-dom";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import PlaylistInputBox from "./PlaylistInputBox";
import React from "react";
const Navbar = () => {
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate("/Emo-chan/");
  };

  const [isDarkMode, setDarkMode] = React.useState(false);

  const toggleDarkMode = (checked) => {
    setDarkMode(checked);
  };

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
          style={{ marginBottom: "0" }}
          checked={isDarkMode}
          onChange={toggleDarkMode}
          size={"1.5rem"}
          moonColor="black"
        />
      </div>
    </div>
  );
};
export default Navbar;
