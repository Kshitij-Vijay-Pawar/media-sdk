import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MediaProvider } from "@media/react";
import "./index.css";
import App from "./App.tsx";

const apiKey =
  import.meta.env.VITE_PEXELS_API_KEY ||
  "DBtXcZaSOPfbKXtgnrj9nq1ZNSghsgS6ifpmLybRtaSC06oF6og4kj7h";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MediaProvider apiKey={apiKey} cacheTTL={5 * 60 * 1000}>
      <App />
    </MediaProvider>
  </StrictMode>
);
