import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createMediaClient, MediaError } from "../index";

describe("@media/core SDK", () => {
  const mockApiKey = "test-pexels-key-12345";

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("attaches API key to requests via Authorization header", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ page: 1, per_page: 15, photos: [], total_results: 0 }),
    } as Response);

    const client = createMediaClient({ apiKey: mockApiKey });
    await client.searchPhotos("test");

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, options] = fetchSpy.mock.calls[0];
    expect(url.toString()).toContain("https://api.pexels.com/v1/search");
    const headers = options?.headers as Record<string, string>;
    expect(headers?.Authorization).toBe(mockApiKey);
  });

  it("passes pagination params (page, perPage) correctly to the API", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ page: 2, per_page: 10, photos: [], total_results: 50 }),
    } as Response);

    const client = createMediaClient({ apiKey: mockApiKey });
    await client.searchPhotos("forest", { page: 2, perPage: 10 });

    const [url] = fetchSpy.mock.calls[0];
    const parsedUrl = new URL(url.toString());
    expect(parsedUrl.searchParams.get("query")).toBe("forest");
    expect(parsedUrl.searchParams.get("page")).toBe("2");
    expect(parsedUrl.searchParams.get("per_page")).toBe("10");
  });

  it("successful searchPhotos returns correctly typed + camelCase paginated response", async () => {
    const mockRawPhoto = {
      id: 101,
      width: 1920,
      height: 1080,
      url: "https://pexels.com/photo/101",
      photographer: "Jane Doe",
      photographer_url: "https://pexels.com/@janedoe",
      photographer_id: 42,
      avg_color: "#123456",
      src: {
        original: "https://images.pexels.com/101.jpg",
        large2x: "https://images.pexels.com/101_large2x.jpg",
        large: "https://images.pexels.com/101_large.jpg",
        medium: "https://images.pexels.com/101_medium.jpg",
        small: "https://images.pexels.com/101_small.jpg",
        portrait: "https://images.pexels.com/101_portrait.jpg",
        landscape: "https://images.pexels.com/101_landscape.jpg",
        tiny: "https://images.pexels.com/101_tiny.jpg",
      },
      liked: false,
      alt: "Scenic landscape",
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        page: 1,
        per_page: 1,
        photos: [mockRawPhoto],
        total_results: 100,
        next_page: "https://api.pexels.com/v1/search?page=2",
        prev_page: null,
      }),
    } as Response);

    const client = createMediaClient({ apiKey: mockApiKey });
    const response = await client.searchPhotos("nature");

    expect(response.page).toBe(1);
    expect(response.perPage).toBe(1);
    expect(response.totalResults).toBe(100);
    expect(response.nextPage).toBe("https://api.pexels.com/v1/search?page=2");
    expect(response.prevPage).toBeNull();
    expect(response.data).toHaveLength(1);

    const photo = response.data[0];
    expect(photo.id).toBe(101);
    expect(photo.photographer).toBe("Jane Doe");
    expect(photo.photographerUrl).toBe("https://pexels.com/@janedoe");
    expect(photo.photographerId).toBe(42);
    expect(photo.avgColor).toBe("#123456");
    expect(photo.src.large2x).toBe("https://images.pexels.com/101_large2x.jpg");
    expect(photo.src.tiny).toBe("https://images.pexels.com/101_tiny.jpg");
  });

  it("successful searchVideos returns correctly typed + camelCase paginated response", async () => {
    const mockRawVideo = {
      id: 202,
      width: 1920,
      height: 1080,
      url: "https://pexels.com/video/202",
      image: "https://images.pexels.com/videos/202.jpg",
      duration: 15,
      user: {
        id: 99,
        name: "John Film",
        url: "https://pexels.com/@johnfilm",
      },
      video_files: [
        {
          id: 501,
          quality: "hd",
          file_type: "video/mp4",
          width: 1920,
          height: 1080,
          fps: 30,
          link: "https://videos.pexels.com/202_hd.mp4",
        },
      ],
      video_pictures: [
        {
          id: 601,
          picture: "https://images.pexels.com/videos/pic_601.jpg",
          nr: 0,
        },
      ],
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        page: 1,
        per_page: 1,
        videos: [mockRawVideo],
        total_results: 50,
      }),
    } as Response);

    const client = createMediaClient({ apiKey: mockApiKey });
    const response = await client.searchVideos("ocean");

    expect(response.data).toHaveLength(1);
    const video = response.data[0];
    expect(video.id).toBe(202);
    expect(video.duration).toBe(15);
    expect(video.user.name).toBe("John Film");
    expect(video.videoFiles[0].fileType).toBe("video/mp4");
    expect(video.videoPictures[0].picture).toBe("https://images.pexels.com/videos/pic_601.jpg");
  });

  it("401 response throws MediaError with code AUTH", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => "Unauthorized",
    } as Response);

    const client = createMediaClient({ apiKey: "bad-key" });
    await expect(client.searchPhotos("test")).rejects.toThrow(MediaError);
    await expect(client.searchPhotos("test")).rejects.toMatchObject({
      code: "AUTH",
      status: 401,
    });
  });

  it("404 response throws MediaError with code NOT_FOUND", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => "Not Found",
    } as Response);

    const client = createMediaClient({ apiKey: mockApiKey });
    await expect(client.getPhoto(999999999)).rejects.toMatchObject({
      code: "NOT_FOUND",
      status: 404,
    });
  });

  it("429 response throws MediaError with code RATE_LIMIT", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 429,
      text: async () => "Too Many Requests",
    } as Response);

    const client = createMediaClient({ apiKey: mockApiKey });
    await expect(client.getCuratedPhotos()).rejects.toMatchObject({
      code: "RATE_LIMIT",
      status: 429,
    });
  });

  it("network failure throws MediaError with code NETWORK", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("Failed to fetch"));

    const client = createMediaClient({ apiKey: mockApiKey });
    await expect(client.searchPhotos("test")).rejects.toMatchObject({
      code: "NETWORK",
    });
  });

  it("duplicate concurrent requests are de-duped (only 1 fetch call)", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
      // Simulate small network delay
      await new Promise((resolve) => setTimeout(resolve, 20));
      return {
        ok: true,
        json: async () => ({ page: 1, per_page: 15, photos: [], total_results: 0 }),
      } as Response;
    });

    const client = createMediaClient({ apiKey: mockApiKey });
    const [res1, res2] = await Promise.all([
      client.searchPhotos("cats"),
      client.searchPhotos("cats"),
    ]);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(res1).toEqual(res2);
  });

  it("cache returns previous result within TTL window", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ page: 1, per_page: 15, photos: [], total_results: 0 }),
    } as Response);

    const client = createMediaClient({ apiKey: mockApiKey, cacheTTL: 1000 });
    await client.searchPhotos("dogs");
    await client.searchPhotos("dogs");

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("cache miss after TTL expiry triggers a new fetch", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ page: 1, per_page: 15, photos: [], total_results: 0 }),
    } as Response);

    // Short 20ms TTL
    const client = createMediaClient({ apiKey: mockApiKey, cacheTTL: 20 });
    await client.searchPhotos("birds");
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    await new Promise((resolve) => setTimeout(resolve, 35));

    await client.searchPhotos("birds");
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("clearCache() forces a fresh request", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ page: 1, per_page: 15, photos: [], total_results: 0 }),
    } as Response);

    const client = createMediaClient({ apiKey: mockApiKey, cacheTTL: 60000 });
    await client.searchPhotos("trees");
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    client.clearCache();

    await client.searchPhotos("trees");
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("event emitter fires view and download events with correct payloads", () => {
    const client = createMediaClient({ apiKey: mockApiKey });
    const viewHandler = vi.fn();
    const downloadHandler = vi.fn();

    client.on("view", viewHandler);
    client.on("download", downloadHandler);

    client.emit("view", { mediaType: "photo", id: 10, timestamp: 123456 });
    client.emit("download", { mediaType: "video", id: 20, url: "https://test.mp4", timestamp: 123457 });

    expect(viewHandler).toHaveBeenCalledWith({ mediaType: "photo", id: 10, timestamp: 123456 });
    expect(downloadHandler).toHaveBeenCalledWith({
      mediaType: "video",
      id: 20,
      url: "https://test.mp4",
      timestamp: 123457,
    });
  });

  it("on/off subscribe/unsubscribe works correctly", () => {
    const client = createMediaClient({ apiKey: mockApiKey });
    const handler = vi.fn();

    const unsubscribe = client.on("view", handler);
    client.emit("view", { mediaType: "photo", id: 1, timestamp: 100 });
    expect(handler).toHaveBeenCalledTimes(1);

    unsubscribe();
    client.emit("view", { mediaType: "photo", id: 2, timestamp: 200 });
    expect(handler).toHaveBeenCalledTimes(1);

    // Also testing client.off
    const handler2 = vi.fn();
    client.on("view", handler2);
    client.off("view", handler2);
    client.emit("view", { mediaType: "photo", id: 3, timestamp: 300 });
    expect(handler2).not.toHaveBeenCalled();
  });

  it("default console logger is registered on init", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const client = createMediaClient({ apiKey: mockApiKey });

    client.emit("view", { mediaType: "photo", id: 99, timestamp: 123 });
    expect(consoleSpy).toHaveBeenCalledWith(
      "[MediaCore] View event:",
      expect.objectContaining({ id: 99, mediaType: "photo" }),
    );
  });
});
