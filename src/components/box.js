import React from "react";
import { useState } from "react";
import "./box.css";
import ComicStripApp from "../App";
const ComicDisplay = ({ comicImages, annotation }) => {
  const [state, setState] = useState(1)

  return (
    <>
      
      <div className="container1">
  
        {/* {comicImages.map((image, index) => (
          <div key={index} className="box1">

            {image && (
              <div className="rel">
                {annotation[index] && (
                  <div className="speech bubble abs speech-bubble">
                    {annotation[index]}

                  </div>

                )}
                <img src={image} alt={`box ${index + 1}`} />

              </div>
            )}

          </div>
        ))} */}
      </div>
    </>
  );
};

export default ComicDisplay;
