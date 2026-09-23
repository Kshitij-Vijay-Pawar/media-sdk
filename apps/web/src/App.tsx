import { useState } from "react";
import { ExploreView } from "./components/ExploreView";
import { ReelsView } from "./components/ReelsView";
import { ActivityLog } from "./components/ActivityLog";
import "./App.css";

function App() {
  const [activeView, setActiveView] = useState<"explore" | "reels">("explore");

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand">
          <div className="brand-icon">M</div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="brand-title">Media Studio</span>
              <span className="brand-badge">Headless v1.0</span>
            </div>
          </div>
        </div>

        <nav className="nav-tabs">
          <button
            className={`nav-tab-btn ${activeView === "explore" ? "active" : ""}`}
            onClick={() => setActiveView("explore")}
          >
            Explore & Search
          </button>
          <button
            className={`nav-tab-btn ${activeView === "reels" ? "active" : ""}`}
            onClick={() => setActiveView("reels")}
          >
            Reels Swiper
          </button>
        </nav>
      </header>

      <main className="main-view">
        {activeView === "explore" ? <ExploreView /> : <ReelsView />}
      </main>

      {/* Real-time Activity Log Event Monitor */}
      <ActivityLog />
    </div>
  );
}

export default App;
