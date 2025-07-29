import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";

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
    <div style={{ textAlign: "center" }}>
      <h2>Real-Time Mood Detector</h2>
      <video
        ref={videoRef}
        autoPlay
        muted
        width="720"
        height="560"
        style={{ borderRadius: "10px" }}
      />
      <br />
      <button
        onClick={detectMood}
        style={{
          marginTop: "15px",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Detect Mood
      </button>
      {expression && (
        <p style={{ marginTop: "10px", fontSize: "18px" }}>
          Detected Mood: <strong>{expression}</strong>
        </p>
      )}
    </div>
  );
}

export default FaceDetection;
