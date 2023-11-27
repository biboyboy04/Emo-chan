import { useNavigate } from "react-router-dom";
import PlaylistInputBox from "./PlaylistInputBox";
const Navbar = () => {
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate("/Emo-chan/");
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
      </div>
    </div>
  );
};
export default Navbar;
