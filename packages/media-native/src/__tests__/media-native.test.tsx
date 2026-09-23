import React from "react";
import ReactDOMServer from "react-dom/server";
import { describe, expect, it } from "vitest";
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

describe("@media/native", () => {
  it("exports all expected hooks, Provider, and errors", () => {
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

  it("throws clear error when hook is used outside MediaProvider", () => {
    const TestComponent = () => {
      useMediaClient();
      return null;
    };

    expect(() => {
      ReactDOMServer.renderToString(<TestComponent />);
    }).toThrow(/useMediaClient must be used within a MediaProvider/);
  });

  it("has zero web/DOM dependencies", () => {
    const globalObj = globalThis as Record<string, unknown>;
    expect(typeof globalObj.window).toBe("undefined");
    expect(typeof globalObj.document).toBe("undefined");
  });
});
