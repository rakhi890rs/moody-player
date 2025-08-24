import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import "./FaceDetection.css";

function FaceDetection({ setMood, setSongs }) {
  const videoRef = useRef(null);
  const [expression, setExpression] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log("Loading face-api models...");
        const MODEL_URL = "/models";
        
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        
        console.log("Models loaded successfully");
        setModelsLoaded(true);
        await startVideo();
      } catch (error) {
        console.error("Error loading models:", error);
        alert("Error loading face detection models. Make sure model files are in public/models folder.");
      }
    };

    const startVideo = async () => {
      try {
        console.log("Starting camera...");
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 400 },
            height: { ideal: 300 },
            facingMode: "user"
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            console.log("Video loaded");
            setCameraReady(true);
          };
        }
      } catch (err) {
        console.error("Camera error:", err);
        alert("Camera access denied or not available");
      }
    };

    loadModels();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const detectMood = async () => {
    if (!videoRef.current || !modelsLoaded || !cameraReady) {
      console.log("Not ready for detection");
      return;
    }
    
    setDetecting(true);

    try {
      console.log("Detecting face...");
      
      if (videoRef.current.paused || videoRef.current.ended) {
        await videoRef.current.play();
      }

      const result = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({
          inputSize: 416,
          scoreThreshold: 0.5
        }))
        .withFaceExpressions();

      if (result && result.expressions) {
        console.log("Face detected with expressions:", result.expressions);
        
        const sorted = Object.entries(result.expressions).sort((a, b) => b[1] - a[1]);
        const topExpression = sorted[0][0];
        const confidence = (sorted[0][1] * 100).toFixed(1);
        
        if (sorted[0][1] > 0.3) {
          setExpression(`${topExpression} (${confidence}%)`);
          setMood(topExpression);

          try {
            const res = await axios.get(`http://localhost:3005/api/songs?mood=${topExpression}`);
            setSongs(res.data.songs);
          } catch (error) {
            console.error("Error fetching songs:", error);
          }
        } else {
          setExpression("Low confidence - try again");
          setMood("");
        }
      } else {
        console.log("No face detected");
        setExpression("No face detected - try better lighting");
        setMood("");
      }
    } catch (error) {
      console.error("Detection error:", error);
      setExpression("Detection failed - please try again");
    }

    setDetecting(false);
  };

  return (
    <div className="face-detection-wrapper">
      <div className="video-container">
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          playsInline
          className="face-video" 
        />
        {!cameraReady && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <div>Loading camera...</div>
          </div>
        )}
      </div>
      
      <div className="detection-controls">
        <button
          onClick={detectMood}
          disabled={detecting || !modelsLoaded || !cameraReady}
          className="start-button"
        >
          {detecting ? "Analyzing..." : 
           !modelsLoaded ? "Loading Models..." :
           !cameraReady ? "Camera Loading..." :
           "Start Listening"}
        </button>
        
        <div className="status-indicators">
          <div className={`status-item ${modelsLoaded ? 'ready' : 'loading'}`}>
            <span className="status-icon">{modelsLoaded ? "✓" : "⏳"}</span>
            <span>Models</span>
          </div>
          <div className={`status-item ${cameraReady ? 'ready' : 'loading'}`}>
            <span className="status-icon">{cameraReady ? "✓" : "⏳"}</span>
            <span>Camera</span>
          </div>
        </div>
      </div>

      {expression && (
        <div className="detection-result">
          <div className="result-label">Detection Result:</div>
          <div className="result-value">{expression}</div>
        </div>
      )}
    </div>
  );
}

export default FaceDetection;