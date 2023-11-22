import React from "react";
import { useState } from "react";
import "./Panel.css";
import ComicStripApp from "./App";
const ComicDisplay = ({ comicImages, annotation }) => {
  const [state, setState] = useState(1)
  const onClose = () => {
    setState(2);
  }
  return (
    <>
      {state === 2 && <ComicStripApp />}
      {state === 1 && <div className="container1">
        <div className="close-button" onClick={onClose}>
          <div className="cross-icon"></div>
        </div>
        {comicImages.map((image, index) => (
          <div key={index} className="panel1">



            {image && (
              <div className="rel">
                {annotation[index] && (
                  <div className="speech bubble abs speech-bubble">
                    {annotation[index]}

                  </div>

                )}
                <img src={image} alt={`Panel ${index + 1}`} />

              </div>
            )}

          </div>
        ))}
      </div>}
    </>
  );
};

export default ComicDisplay;
