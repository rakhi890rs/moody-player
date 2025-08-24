import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import "./FaceDetection.css";

function FaceDetection({ setMood, setSongs }) {
  const videoRef = useRef(null);
  const [expression, setExpression] = useState("");
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    let started = false;
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      console.log("✅ Models loaded");
      if (!started) {
        startVideo();
        started = true;
      }
    };

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: {} })
        .then((stream) => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error("❌ Camera error:", err));
    };

    loadModels();
  }, []);

  const detectMood = async () => {
    if (!videoRef.current) return;

    setDetecting(true);

    const result = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (result?.expressions) {
      const sorted = Object.entries(result.expressions).sort((a, b) => b[1] - a[1]);
      const topExpression = sorted[0][0];
      setExpression(topExpression);
      setMood(topExpression);

      try {
        const res = await axios.get(`http://localhost:3005/api/songs?mood=${topExpression}`);
        setSongs(res.data.songs);
      } catch (error) {
        console.error("❌ Error fetching songs:", error);
      }
    } else {
      setExpression("No face detected");
    }

    setDetecting(false);
  };

  const getMoodClass = () => {
    switch (expression) {
      case "happy":
        return "mood-happy";
      case "sad":
        return "mood-sad";
      case "angry":
        return "mood-angry";
      case "surprised":
        return "mood-surprised";
      case "neutral":
        return "mood-neutral";
      default:
        return "";
    }
  };

  return (
    <div className={`mood-container ${getMoodClass()}`}>
      <div className="video-card">
        <video ref={videoRef} autoPlay muted className="user-video-feed" />
        <button onClick={detectMood} className="detect-button" disabled={detecting}>
          {detecting ? "Detecting..." : "Detect Mood"}
        </button>
      </div>
      {expression && (
        <div className="mood-display">
          <span className="mood-emoji">{getEmoji(expression)}</span>
          <span className="mood-text">{expression}</span>
        </div>
      )}
    </div>
  );
}

function getEmoji(mood) {
  switch (mood) {
    case "happy":
      return "😄";
    case "sad":
      return "😢";
    case "angry":
      return "😡";
    case "surprised":
      return "😲";
    case "neutral":
      return "😐";
    default:
      return "❔";
  }
}

export default FaceDetection;
