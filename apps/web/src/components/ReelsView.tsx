import { useRef, useEffect, useCallback } from "react";
import { usePopularVideos, useMediaEvents, type Video } from "@media/react";
import { useReelSwiper } from "@media/ui-react";

export function ReelsView() {
  const { data: videos, loading, error } = usePopularVideos({ perPage: 20 });
  const { emit } = useMediaEvents();
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

  const { getContainerProps, getSlideProps, activeIndex } = useReelSwiper<Video>({
    items: videos,
    threshold: 0.6,
    onActiveChange: (_index, video) => {
      emit("view", {
        mediaType: "video",
        id: video.id,
        timestamp: Date.now(),
      });
    },
  });

  // Autoplay active video, pause and reset inactive videos
  useEffect(() => {
    videoRefs.current.forEach((videoEl, index) => {
      if (index === activeIndex) {
        videoEl.play().catch(() => {
          // Autoplay might be blocked by browser policy until user interaction
        });
      } else {
        videoEl.pause();
      }
    });
  }, [activeIndex]);

  const handleDownload = useCallback((video: Video) => {
    const downloadUrl = video.videoFiles[0]?.link || video.url;
    emit("download", {
      mediaType: "video",
      id: video.id,
      url: downloadUrl,
      timestamp: Date.now(),
    });
    window.open(downloadUrl, "_blank", "noopener,noreferrer");
  }, [emit]);

  if (loading && videos.length === 0) {
    return (
      <div className="state-message">
        <div className="spinner" />
        <div>Loading trending reels...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-message">
        <div style={{ color: "#f87171" }}>Failed to load reels: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="reels-container">
      <div {...getContainerProps({ className: "reels-scroll-snap-wrapper" })}>
        {videos.map((video, index) => {
          const videoUrl = video.videoFiles[0]?.link;

          return (
            <div
              key={video.id}
              {...getSlideProps(video, index, { className: "reel-slide" })}
            >
              {videoUrl ? (
                <video
                  ref={(el) => {
                    if (el) videoRefs.current.set(index, el);
                    else videoRefs.current.delete(index);
                  }}
                  src={videoUrl}
                  poster={video.image}
                  className="reel-video"
                  loop
                  playsInline
                  muted
                />
              ) : (
                <img src={video.image} alt="Video poster" className="reel-video" />
              )}

              <div className="reel-overlay">
                <div>
                  <h3 style={{ fontSize: "1rem", color: "#fff", fontWeight: 700 }}>
                    @{video.user.name}
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    Duration: {video.duration}s • Reel #{index + 1}
                  </p>
                </div>

                <button
                  onClick={() => handleDownload(video)}
                  className="btn-download"
                  style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}
                >
                  ⬇ Save
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
