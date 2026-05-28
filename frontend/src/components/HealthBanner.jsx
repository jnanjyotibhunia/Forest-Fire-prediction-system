import { useEffect, useState } from "react";

export default function HealthBanner() {
  const [state, setState] = useState("checking");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/health")
      .then((res) => res.json())
      .then(() => setState("online"))
      .catch(() => setState("offline"));
  }, []);

  const dotClass =
    state === "online"   ? "online"   :
    state === "offline"  ? "offline"  : "checking";

  const message =
    state === "online"   ? "API online — Forest Fire Prediction API v1.0 — Model ready" :
    state === "offline"  ? "API offline — start uvicorn on port 8000 to connect" :
                           "Connecting to prediction API…";

  return (
    <div className="health-banner">
      <span className={`status-dot ${dotClass}`} />
      <span className="health-sep">//</span>
      <span>{message}</span>
    </div>
  );
}