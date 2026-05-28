import { useState } from "react";

const MONTHS = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
const DAYS   = ["mon","tue","wed","thu","fri","sat","sun"];

const DEFAULT = {
  X: 7, Y: 5,
  month: "aug", day: "fri",
  FFMC: 90.2, DMC: 130.5, DC: 650.0, ISI: 8.5,
  temp: 32.0, RH: 25.0, wind: 6.0, rain: 0.0,
};

const PRESETS = {
  extreme: { X:7, Y:5, month:"aug", day:"sun", FFMC:96.2, DMC:180.5, DC:800.0, ISI:18.5, temp:42.0, RH:8.0,  wind:18.0, rain:0.0 },
  high:    { X:5, Y:4, month:"jul", day:"sat", FFMC:91.0, DMC:130.0, DC:650.0, ISI:10.0, temp:35.0, RH:18.0, wind:12.0, rain:0.0 },
  medium:  { X:4, Y:3, month:"may", day:"fri", FFMC:78.0, DMC:60.0,  DC:300.0, ISI:5.5,  temp:26.0, RH:42.0, wind:7.0,  rain:0.0 },
  low:     { X:2, Y:2, month:"jan", day:"mon", FFMC:55.0, DMC:20.0,  DC:90.0,  ISI:2.0,  temp:12.0, RH:82.0, wind:2.0,  rain:4.0 },
};

export default function PredictionForm({ setResult }) {
  const [formData, setFormData] = useState(DEFAULT);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const set = (key, val) =>
    setFormData((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Build payload — numbers must be numbers not strings
    const payload = {
      X:    parseInt(formData.X,    10),
      Y:    parseInt(formData.Y,    10),
      month: formData.month,
      day:   formData.day,
      FFMC:  parseFloat(formData.FFMC),
      DMC:   parseFloat(formData.DMC),
      DC:    parseFloat(formData.DC),
      ISI:   parseFloat(formData.ISI),
      temp:  parseFloat(formData.temp),
      RH:    parseFloat(formData.RH),
      wind:  parseFloat(formData.wind),
      rain:  parseFloat(formData.rain),
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/predict/explain", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setResult({ ...data, _input: payload });
    } catch (err) {
      setError(err.message || "Could not reach API. Is uvicorn running on port 8000?");
    } finally {
      setLoading(false);
    }
  };

  const fillPreset = (key) => setFormData(PRESETS[key]);

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">Input conditions</span>
        <span className="panel-badge">12 features</span>
      </div>

      <form className="prediction-form" onSubmit={handleSubmit}>
        {/* Presets */}
        <p className="form-section-label">Quick presets</p>
        <div className="form-grid" style={{ marginBottom: 18 }}>
          {Object.keys(PRESETS).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => fillPreset(k)}
              style={{
                padding: "7px 0",
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                color: "var(--text)",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                cursor: "pointer",
                transition: "border-color 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--fire)";
                e.currentTarget.style.color = "var(--fire)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text)";
              }}
            >
              {k}
            </button>
          ))}
        </div>

        {/* Location */}
        <p className="form-section-label">Location</p>
        <div className="coord-row">
          <div className="form-group">
            <label>X grid<span>*</span></label>
            <input type="number" step="1" min="1" max="9"
              value={formData.X}
              onChange={(e) => set("X", e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Y grid<span>*</span></label>
            <input type="number" step="1" min="1" max="9"
              value={formData.Y}
              onChange={(e) => set("Y", e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Month<span>*</span></label>
            <select value={formData.month} onChange={(e) => set("month", e.target.value)}>
              {MONTHS.map((m) => <option key={m} value={m}>{m.charAt(0).toUpperCase()+m.slice(1)}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Day<span>*</span></label>
            <select value={formData.day} onChange={(e) => set("day", e.target.value)}>
              {DAYS.map((d) => <option key={d} value={d}>{d.charAt(0).toUpperCase()+d.slice(1)}</option>)}
            </select>
          </div>
        </div>

        {/* FWI System */}
        <p className="form-section-label">FWI indices</p>
        <div className="form-grid">
          <div className="form-group">
            <label>FFMC<span>*</span></label>
            <input type="number" step="0.1" min="0" max="101"
              value={formData.FFMC}
              onChange={(e) => set("FFMC", e.target.value)} required />
          </div>
          <div className="form-group">
            <label>DMC<span>*</span></label>
            <input type="number" step="0.1" min="0"
              value={formData.DMC}
              onChange={(e) => set("DMC", e.target.value)} required />
          </div>
          <div className="form-group">
            <label>DC<span>*</span></label>
            <input type="number" step="0.1" min="0"
              value={formData.DC}
              onChange={(e) => set("DC", e.target.value)} required />
          </div>
          <div className="form-group">
            <label>ISI<span>*</span></label>
            <input type="number" step="0.1" min="0"
              value={formData.ISI}
              onChange={(e) => set("ISI", e.target.value)} required />
          </div>
        </div>

        {/* Weather */}
        <p className="form-section-label">Weather conditions</p>
        <div className="form-grid">
          <div className="form-group">
            <label>Temperature (°C)<span>*</span></label>
            <input type="number" step="0.1"
              value={formData.temp}
              onChange={(e) => set("temp", e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Humidity (%)<span>*</span></label>
            <input type="number" step="1" min="0" max="100"
              value={formData.RH}
              onChange={(e) => set("RH", e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Wind (km/h)<span>*</span></label>
            <input type="number" step="0.1" min="0"
              value={formData.wind}
              onChange={(e) => set("wind", e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Rain (mm)</label>
            <input type="number" step="0.1" min="0"
              value={formData.rain}
              onChange={(e) => set("rain", e.target.value)} />
          </div>
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? (
            <span className="btn-loading">
              <span className="spinner" />
              Analysing conditions…
            </span>
          ) : (
            "Analyse Fire Risk"
          )}
        </button>

        {error && <div className="error-box">Error: {error}</div>}
      </form>
    </div>
  );
}