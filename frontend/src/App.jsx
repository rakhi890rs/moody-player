import React, { useState } from "react";
import FaceDetection from "./Components/FaceDetection";
import MoodSongs from "./Components/MoodSongs";
// import "./App.css";

function App() {
  const [mood, setMood] = useState("");
  const [songs, setSongs] = useState([]);

  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🎵</span>
            <span className="logo-text">Moody Player</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-container">
          <h1 className="main-title">Live Mood Detection</h1>
          
          <div className="detection-section">
            <div className="detection-container">
              <FaceDetection setMood={setMood} setSongs={setSongs} />
            </div>
            
            <div className="info-panel">
              <div className="info-content">
                <h2>Live Mood Detection</h2>
                <p className="description">
                  Your current mood is being analyzed in real-time. 
                  Enjoy music tailored to your feelings.
                </p>
                
                {mood && (
                  <div className="current-mood">
                    <span className="mood-label">Current Mood:</span>
                    <span className="mood-value">{mood}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Songs Section */}
          {songs && songs.length > 0 && (
            <div className="songs-section">
              <MoodSongs songs={songs} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;