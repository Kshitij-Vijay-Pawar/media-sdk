import React from "react";
import ReactDOMServer from "react-dom/server";
import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  MediaProvider,
  useMediaClient,
  useSearchPhotos,
  useSearchVideos,
  useCuratedPhotos,
  usePopularVideos,
  usePhoto,
  useVideo,
  useMediaEvents,
  MediaError,
} from "../index";

describe("@media/react", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("MediaProvider and useMediaClient", () => {
    it("throws clear error when hook is used outside MediaProvider", () => {
      const TestComponent = () => {
        useMediaClient();
        return null;
      };

      expect(() => {
        ReactDOMServer.renderToString(<TestComponent />);
      }).toThrow(/useMediaClient must be used within a MediaProvider/);
    });

    it("provides MediaClient instance when rendered inside MediaProvider", () => {
      let clientInstance: ReturnType<typeof useMediaClient> | null = null;
      const TestComponent = () => {
        clientInstance = useMediaClient();
        return <div>loaded</div>;
      };

      const html = ReactDOMServer.renderToString(
        <MediaProvider apiKey="test-api-key">
          <TestComponent />
        </MediaProvider>
      );

      expect(html).toContain("loaded");
      expect(clientInstance).toBeDefined();
      expect(typeof clientInstance.searchPhotos).toBe("function");
    });
  });

  describe("Hooks exports and contracts", () => {
    it("re-exports all expected hooks, errors, and types", () => {
      expect(typeof MediaProvider).toBe("function");
      expect(typeof useMediaClient).toBe("function");
      expect(typeof useSearchPhotos).toBe("function");
      expect(typeof useSearchVideos).toBe("function");
      expect(typeof useCuratedPhotos).toBe("function");
      expect(typeof usePopularVideos).toBe("function");
      expect(typeof usePhoto).toBe("function");
      expect(typeof useVideo).toBe("function");
      expect(typeof useMediaEvents).toBe("function");
      expect(MediaError).toBeDefined();
    });
  });
});
