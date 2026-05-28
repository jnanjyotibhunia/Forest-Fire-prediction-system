import { useState } from "react";
import "./App.css";
import HealthBanner   from "./components/HealthBanner";
import PredictionForm from "./components/PredictionForm";
import ResultCard     from "./components/ResultCard";

export default function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-eyebrow">Forest Fire Prediction System</div>
        <h1>
          Fire Risk
          <span>Analyser</span>
        </h1>
        <p>
          Enter weather and fire weather index conditions to predict wildfire
          risk using a trained XGBoost classification model.
        </p>
      </header>

      {/* ── API status ── */}
      <HealthBanner />

      {/* ── Main content ── */}
      <div className="main-grid">
        <PredictionForm setResult={setResult} />
        <ResultCard result={result} />
      </div>

      {/* ── Footer ── */}
      <footer className="app-footer">
        <span>Forest Fire Prediction System — ML Project</span>
        <span className="footer-logo">FFPS</span>
      </footer>
    </div>
  );
}