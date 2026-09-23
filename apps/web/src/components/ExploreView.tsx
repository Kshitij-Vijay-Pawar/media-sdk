import { useState, useDeferredValue } from "react";
import {
  useCuratedPhotos,
  useSearchPhotos,
  usePopularVideos,
  useSearchVideos,
  type Photo,
  type Video,
} from "@media/react";
import { useGrid } from "@media/ui-react";
import { MediaLightbox } from "./MediaLightbox";

export function ExploreView() {
  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");

  // Debounced/deferred query
  const deferredQuery = useDeferredValue(searchInput.trim());

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Photos data layer
  const curatedPhotosState = useCuratedPhotos({ perPage: 16 });
  const searchPhotosState = useSearchPhotos(deferredQuery, { perPage: 16 });

  // Videos data layer
  const popularVideosState = usePopularVideos({ perPage: 16 });
  const searchVideosState = useSearchVideos(deferredQuery, { perPage: 16 });

  // Select active data stream
  const isSearch = deferredQuery.length > 0;
  const isPhotos = activeTab === "photos";

  const currentStream = isPhotos
    ? isSearch
      ? searchPhotosState
      : curatedPhotosState
    : isSearch
      ? searchVideosState
      : popularVideosState;

  const { data, loading, error, fetchNextPage, hasMore } = currentStream;

  // Headless Grid Hook
  const { getGridProps, getItemProps, sentinelRef } = useGrid<Photo | Video>({
    data: data as (Photo | Video)[],
    loading,
    hasMore,
    onLoadMore: fetchNextPage,
    getItemKey: (item) => item.id,
  });

  const handleCardClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="explore-view">
      <div className="search-hero">
        <h1 className="hero-heading">High-Performance Media SDK</h1>
        <p className="hero-subtitle">
          Demonstrating headless architecture, infinite pagination, cached API feeds, and real-time lifecycle tracking.
        </p>

        <div className="search-bar-wrapper">
          <span style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search photos or videos across Pexels..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <div className="media-type-switch">
            <button
              className={`type-btn ${activeTab === "photos" ? "active" : ""}`}
              onClick={() => setActiveTab("photos")}
            >
              Photos
            </button>
            <button
              className={`type-btn ${activeTab === "videos" ? "active" : ""}`}
              onClick={() => setActiveTab("videos")}
            >
              Videos
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="state-message">
          <div style={{ fontSize: "2rem" }}>⚠️</div>
          <div style={{ color: "#f87171", fontWeight: 600 }}>{error.message}</div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Error Code: {error.code} {error.status ? `(HTTP ${error.status})` : ""}
          </p>
        </div>
      ) : data.length === 0 && !loading ? (
        <div className="state-message">
          <div style={{ fontSize: "2rem" }}>🔍</div>
          <div>No {activeTab} found matching "{deferredQuery}"</div>
        </div>
      ) : (
        <>
          <div {...getGridProps({ className: "media-grid" })}>
            {data.map((item, index) => {
              const isPhotoItem = "photographer" in item;
              const photo = item as Photo;
              const video = item as Video;

              return (
                <div
                  key={item.id}
                  {...getItemProps(item, index, { className: "grid-card" })}
                  onClick={() => handleCardClick(index)}
                >
                  <img
                    src={isPhotoItem ? photo.src.medium : video.image}
                    alt={isPhotoItem ? photo.alt : `Video by ${video.user.name}`}
                    className="grid-card-img"
                    loading="lazy"
                  />
                  <div className="grid-card-overlay">
                    <div className="grid-card-meta">
                      <span className="grid-card-author">
                        {isPhotoItem ? photo.photographer : video.user.name}
                      </span>
                      <span className="grid-card-type">
                        {isPhotoItem ? "Photo" : `Video (${video.duration}s)`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div ref={sentinelRef} className="sentinel">
            {loading && <div className="spinner" />}
          </div>
        </>
      )}

      {/* Lightbox Dialog */}
      <MediaLightbox
        items={data as (Photo | Video)[]}
        isOpen={lightboxOpen}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </div>
  );
}
