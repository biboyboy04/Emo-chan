import { useState } from "react";
import Tilt from "react-parallax-tilt";
import ReactCardFlip from "react-card-flip";

const Card = ({ name, src, flipped, handleCardClick }) => {
  return (
    <Tilt>
      <ReactCardFlip
        isFlipped={flipped}
        flipDirection="horizontal"
        flipSpeedBackToFront={0.8}
        flipSpeedFrontToBack={0.8}
      >
        {/* Front Card */}
        <div className="card" onClick={handleCardClick}>
          <img className="front" src={src}></img>
          <div className="title">{name}</div>
        </div>

        {/* Back Card */}
        <div className="card">
          <img src={"/public/images/mh_symbol.png"}></img>
        </div>
      </ReactCardFlip>
    </Tilt>
  );
};

export default Card;
