import { useEffect, useRef } from "react";

export default function ResultCard({ result }) {

  // ── ALL hooks must be declared first, before any return ───
  const barRef = useRef(null);

  const pred   = result?.prediction   || {};
  const expls  = result?.explanations || [];
  const input  = result?._input       || {};

  const prob      = typeof pred.fire_probability === "number"
    ? pred.fire_probability
    : parseFloat(pred.fire_probability ?? 0) || 0;
  const pct       = Math.round(prob * 100);
  const isFire    = pred.prediction === 1;
  const riskLevel = (pred.risk_level || "LOW").toUpperCase();
  const threshold = pred.threshold ?? "—";

  // useEffect must also come before any return
  useEffect(() => {
    if (!barRef.current) return;
    barRef.current.style.width = "0%";
    const t = setTimeout(() => {
      if (barRef.current) barRef.current.style.width = pct + "%";
    }, 80);
    return () => clearTimeout(t);
  }, [pct]);

  // ── Early return AFTER all hooks ──────────────────────────
  if (!result) {
    return (
      <div className="panel result-card">
        <div className="result-empty">
          <div className="result-empty-icon">⬡</div>
          <p>Enter conditions and click Analyse Fire Risk</p>
        </div>
      </div>
    );
  }

  // ── Input chips ───────────────────────────────────────────
  const chipFields = [
    { k: "temp",  v: input.temp  != null ? `${input.temp}°C`    : "—" },
    { k: "RH",    v: input.RH    != null ? `${input.RH}%`       : "—" },
    { k: "wind",  v: input.wind  != null ? `${input.wind} km/h` : "—" },
    { k: "rain",  v: input.rain  != null ? `${input.rain} mm`   : "—" },
    { k: "FFMC",  v: input.FFMC  != null ? input.FFMC           : "—" },
    { k: "DMC",   v: input.DMC   != null ? input.DMC            : "—" },
    { k: "DC",    v: input.DC    != null ? input.DC             : "—" },
    { k: "ISI",   v: input.ISI   != null ? input.ISI            : "—" },
    { k: "month", v: input.month || "—" },
    { k: "day",   v: input.day   || "—" },
  ];

  const riskColor =
    riskLevel === "LOW"    ? "var(--safe2)"  :
    riskLevel === "MEDIUM" ? "var(--warn)"   :
    riskLevel === "HIGH"   ? "var(--danger)" :
    "var(--ember)";

  return (
    <div className="panel result-card">

      {/* ── Panel header ── */}
      <div className="panel-header">
        <span className="panel-title">Prediction result</span>
        <span
          className="panel-badge"
          style={{
            background:  isFire ? "rgba(239,83,80,0.15)"  : "rgba(38,166,154,0.15)",
            color:       isFire ? "var(--danger)"          : "var(--safe2)",
            borderColor: isFire ? "rgba(239,83,80,0.3)"   : "rgba(38,166,154,0.3)",
          }}
        >
          {isFire ? "Fire Risk Detected" : "No Fire Risk"}
        </span>
      </div>

      {/* ── Risk banner ── */}
      <div className={`risk-banner ${riskLevel}`}>
        <div className="risk-left">
          <div className="risk-level-label">Risk level</div>
          <div className="risk-level-value" style={{ color: riskColor }}>
            {riskLevel}
          </div>
          <div className="risk-verdict">
            <span className={`verdict-icon ${isFire ? "fire" : "no-fire"}`}>
              {isFire ? "!" : "✓"}
            </span>
            <span style={{
              color: "var(--text2)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
            }}>
              {isFire
                ? "Fire risk detected — take precautions"
                : "No significant fire risk at this time"}
            </span>
          </div>
        </div>

        <div className="risk-right">
          <div className="risk-prob-number">
            {pct}
            <span className="risk-prob-unit">%</span>
          </div>
          <div className="risk-threshold">threshold: {threshold}</div>
        </div>
      </div>

      {/* ── Probability bar ── */}
      <div className="prob-bar-section">
        <div className="prob-bar-track">
          <div
            ref={barRef}
            className={`prob-bar-fill ${riskLevel}`}
            style={{ width: "0%", transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)" }}
          />
        </div>
        <div className="prob-bar-labels">
          <span>0%</span>
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
          <span>100%</span>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-value">{pct}%</div>
          <div className="stat-label">Probability</div>
        </div>
        <div className="stat-box">
          <div className="stat-value"
               style={{ color: isFire ? "var(--danger)" : "var(--safe2)" }}>
            {isFire ? "YES" : "NO"}
          </div>
          <div className="stat-label">Fire predicted</div>
        </div>
        <div className="stat-box">
          <div className="stat-value"
               style={{ fontSize: 18, color: riskColor }}>
            {riskLevel}
          </div>
          <div className="stat-label">Risk level</div>
        </div>
      </div>

      {/* ── Explanations ── */}
      {expls.length > 0 && (
        <div className="explanations-section">
          <p className="section-heading">Analysis</p>
          {expls.map((line, i) => (
            <div
              key={i}
              className="explanation-item"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <span className="explanation-bullet" />
              <span className="explanation-text">{line}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Input summary ── */}
      <div className="input-summary">
        <p className="section-heading">Input values used</p>
        <div className="input-chips">
          {chipFields.map(({ k, v }) => (
            <div className="input-chip" key={k}>
              <span className="chip-key">{k}</span>
              <span style={{ color: "var(--text3)" }}>:</span>
              <span className="chip-val">{String(v)}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}