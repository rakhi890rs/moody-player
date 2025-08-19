import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import "./FaceDetection.css";

function FaceDetection() {
  const videoRef = useRef(null);
  const [expression, setExpression] = useState("");

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      console.log("✅ Models loaded");
      startVideo();
    };

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: {} })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error("❌ Camera error:", err));
    };

    loadModels();
  }, []);

  const detectMood = async () => {
    if (!videoRef.current) return;

    const result = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (result && result.expressions) {
      const sorted = Object.entries(result.expressions).sort((a, b) => b[1] - a[1]);
      const topExpression = sorted[0][0];
      setExpression(topExpression);
      console.log("💬 Mood Detected:", topExpression);
    } else {
      setExpression("No face detected");
      console.log("❌ No face detected");
    }
  };

  return (
    <div className="mood-element">
      <video ref={videoRef} autoPlay muted className="user-video-feed" />
      <br />
      <button onClick={detectMood} className="detect-button">
        Detect Mood</button>
     
    </div>
  );
}

export default FaceDetection;
