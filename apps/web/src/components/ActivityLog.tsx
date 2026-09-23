import { useState, useEffect } from "react";
import { useMediaEvents } from "@media/react";

interface LogEvent {
  id: string;
  type: "view" | "download";
  mediaType: "photo" | "video";
  mediaId: number;
  url?: string;
  timestamp: number;
}

export function ActivityLog() {
  const [isOpen, setIsOpen] = useState(true);
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const { on } = useMediaEvents();

  useEffect(() => {
    const unsubView = on("view", (event) => {
      setLogs((prev) => [
        {
          id: `${Date.now()}-${Math.random()}`,
          type: "view",
          mediaType: event.mediaType,
          mediaId: event.id,
          timestamp: event.timestamp,
        },
        ...prev.slice(0, 49),
      ]);
    });

    const unsubDownload = on("download", (event) => {
      setLogs((prev) => [
        {
          id: `${Date.now()}-${Math.random()}`,
          type: "download",
          mediaType: event.mediaType,
          mediaId: event.id,
          url: event.url,
          timestamp: event.timestamp,
        },
        ...prev.slice(0, 49),
      ]);
    });

    return () => {
      unsubView();
      unsubDownload();
    };
  }, [on]);

  return (
    <div className="activity-log-dock">
      <div
        className="activity-log-header"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
      >
        <div className="activity-log-title">
          <span className="pulse-dot" />
          <span>Activity Log ({logs.length})</span>
        </div>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
          {isOpen ? "▼" : "▲"}
        </span>
      </div>

      {isOpen && (
        <div className="activity-log-list">
          {logs.length === 0 ? (
            <div style={{ color: "var(--text-muted)", padding: "0.5rem", textAlign: "center" }}>
              No events captured yet. Open an item or download to fire SDK events.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className={`activity-log-entry ${log.type}`}>
                <div className="log-meta">
                  <span className={`log-tag ${log.type}`}>[{log.type}]</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <div>
                  <strong>{log.mediaType.toUpperCase()}</strong> #{log.mediaId}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
