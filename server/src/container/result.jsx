import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import confetti from "canvas-confetti";

function Result() {
  const location = useLocation();
  const score = location.state?.score || 0;

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 700,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🎉 Congratulations!</h1>
      <p>Your result: <strong>{score}/10</strong></p>
    </div>
  );
}

export default Result;
