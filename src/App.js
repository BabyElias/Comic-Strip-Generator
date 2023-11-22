import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import ComicDisplay from "./Panel";
const App = () => {
  const [comicText, setComicText] = useState(Array(10).fill(""));
  const [comicImages, setComicImages] = useState(Array(10).fill(null));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [state, setState] = useState(1);
  const [annotation, setAnnotation] = useState(Array(10).fill(""));
  const [darkMode, setDarkMode] = useState(false);

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
      console.log(URL.createObjectURL(result))
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
      setState(2);
    }
  };

  return (
    <>
      <div className={`homepage ${darkMode ? 'dark-mode' : ''}`}>
        {state === 1 && (
          <div className="containers">
            <h1>Comic Strip Generator</h1>
            <div>
              {comicText.map((text, index) => (
                <div key={index} className="panel">
                  <label>{`Panel ${index + 1}: `}</label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => handleTextChange(index, e.target.value)}
                    className="text-input"
                    placeholder={`Comic ${index + 1}`}
                  />
                  <input
                    type="text"
                    onChange={(e) =>
                      handleTextChangeAnnote(index, e.target.value)
                    }
                    className="text-input"
                    placeholder={`Speech  ${index + 1}`}
                  />
                </div>
              ))}
            </div>

            <button onClick={generateComic} className="generate-button myButton light-mode">
              <Link
                to="/comic-display"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Generate Comic
              </Link>
            </button>
            {loading && <div class="overlay">
              <div className="loader"></div>
            </div>
            }
            {error && (
              <p style={{ color: "red" }} className="error-message">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
      {state === 2 && (
        <ComicDisplay comicImages={comicImages} annotation={annotation} />
      )}
    </>
  );
};
export default App;
