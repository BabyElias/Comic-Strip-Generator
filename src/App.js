import html2canvas from "html2canvas";
import React, { useState, useRef } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";


const App = () => {
  const [comicText, setComicText] = useState(Array(10).fill(""));
  const [comicImages, setComicImages] = useState(Array(10).fill(null));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [state] = useState(1);
  const [annotation, setAnnotation] = useState(Array(10).fill(""));
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef();

  const handleTextChange = (index, text) => {
    const newTextArray = [...comicText];
    newTextArray[index] = text;
    setComicText(newTextArray);
  };

  const handleTextChangeAnnote = (index, text) => {
    const newTextArray = [...annotation];
    newTextArray[index] = text;
    setAnnotation(newTextArray);
  };

  const query = async (data) => {
    try {
      const response = await fetch(
        "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
        {
          headers: {
            Accept: "image/png",
            Authorization:
              "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const result = await response.blob();
      console.log(URL.createObjectURL(result));
      return URL.createObjectURL(result);
    } catch (err) {
      throw new Error("Error querying the API. Please try again.");
    }
  };

  const generateComic = async () => {
    try {
      setError(null);
      setLoading(true);
      const newComicImages = await Promise.all(
        comicText.map(async (text) => {
          const data = { inputs: text };
          const imageUrl = await query(data);
          return imageUrl;
        })
      );

      setComicImages(newComicImages);
    } catch (err) {
      setError(err.message || "Error generating comic. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadImages = async () => {
    try {
      setDownloading(true);
      const canvas = await html2canvas(cardRef.current);
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      
      a.href = dataUrl;
      a.download = "canvas_image.png";
      a.click();
    } catch (error) {
      console.error("Error generating and downloading image:", error);
    } finally {
      setDownloading(false);
    }
  };




  return (
    <>
      <div className="home">
        {state === 1 && (
          <div className="main">
            <div className="heading">
              <div className="image"></div>
              <div className="text">COMIC-NATOR</div>
            </div>
            <div className="homepage">
              <div className="containers">
                <h1>Some title</h1>
                <div>
                  {comicText.map((text, index) => (
                    <div key={index} className="box">
                      <label>{`Panel ${index + 1}: `}</label>
                      <input
                        type="text"
                        value={text}
                        onChange={(e) =>
                          handleTextChange(index, e.target.value)
                        }
                        className="text-input"
                        placeholder={`Give wings to your creativity here`}
                      />
                      <input
                        type="text"
                        onChange={(e) =>
                          handleTextChangeAnnote(index, e.target.value)
                        }
                        className="text-input"
                        placeholder={`Text Box`}
                      />
                      {comicImages[index] && (
                        <div className="img_box">
                          <img src={comicImages[index]} alt={`  `} />
                        </div>
                      )}
                      {/* <div className="img_box">
                        <img src={comicImages[index]} alt={`  `} />
                      </div> */}
                    </div>
                  ))}
                </div>
                <button
                  onClick={generateComic}
                  className="generate-button myButton light-mode"
                >
                  <Link
                    // to="/comic-display"
                    style={{ textDecoration: "none", color: "inherit"}}
                  >
                    Generate Comic
                  </Link>
                </button>

                <button
                  type="submit"
                  className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                  onClick={handleDownloadImages}
                  disabled={downloading}
                >
                  {downloading ? "Downloading" : "Download"}
                </button>
               
                {loading && (
                  <div className="overlay">
                    <div className="loader"></div>
                  </div>
                )}
                {error && (
                  <p style={{ color: "red" }} className="error-message">
                    {error}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/**/}
    </>
  );
};
export default App;
