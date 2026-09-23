import React from "react";
import type { Photo, Video } from "@media/react";
import { useLightbox } from "@media/ui-react";
import { useMediaEvents } from "@media/react";

type MediaItem = Photo | Video;

export interface MediaLightboxProps {
  items: MediaItem[];
  isOpen: boolean;
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function MediaLightbox({
  items,
  isOpen,
  currentIndex,
  onClose,
  onNavigate,
}: MediaLightboxProps) {
  const { emit } = useMediaEvents();

  const lightbox = useLightbox<MediaItem>({
    items,
    onClose,
    onNavigate: (idx, item) => {
      onNavigate(idx);
      const mediaType = "photographer" in item ? "photo" : "video";
      emit("view", {
        mediaType,
        id: item.id,
        timestamp: Date.now(),
      });
    },
  });

  // Sync open state when changed externally
  React.useEffect(() => {
    if (isOpen && !lightbox.isOpen) {
      lightbox.open(currentIndex);
    } else if (!isOpen && lightbox.isOpen) {
      lightbox.close();
    }
  }, [isOpen, currentIndex, lightbox]);

  const current = lightbox.currentItem;
  const isPhoto = Boolean(current && "photographer" in current);
  const downloadUrl = current
    ? isPhoto
      ? (current as Photo).src.original
      : (current as Video).videoFiles[0]?.link || (current as Video).url
    : "";

  const handleDownload = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!current) return;

      emit("download", {
        mediaType: isPhoto ? "photo" : "video",
        id: current.id,
        url: downloadUrl,
        timestamp: Date.now(),
      });
      window.open(downloadUrl, "_blank", "noopener,noreferrer");
    },
    [emit, current, isPhoto, downloadUrl]
  );

  if (!isOpen || !current) {
    return null;
  }

  return (
    <div {...lightbox.getOverlayProps({ className: "lightbox-backdrop" })}>
      <div {...lightbox.getContentProps({ className: "lightbox-dialog" })}>
        <button {...lightbox.getCloseButtonProps({ className: "lightbox-close-btn" })}>
          ✕
        </button>

        <button {...lightbox.getPrevButtonProps({ className: "lightbox-nav-btn lightbox-prev-btn" })}>
          ‹
        </button>

        <div className="lightbox-media-wrapper">
          {isPhoto ? (
            <img
              src={(current as Photo).src.large2x || (current as Photo).src.large}
              alt={(current as Photo).alt || "Photo"}
              className="lightbox-img"
            />
          ) : (
            <video
              src={(current as Video).videoFiles[0]?.link}
              controls
              autoPlay
              className="lightbox-video"
            />
          )}
        </div>

        <button {...lightbox.getNextButtonProps({ className: "lightbox-nav-btn lightbox-next-btn" })}>
          ›
        </button>

        <div className="lightbox-footer">
          <div>
            <div style={{ fontWeight: 600, color: "#fff", fontSize: "0.95rem" }}>
              {isPhoto
                ? (current as Photo).alt || `Photo by ${(current as Photo).photographer}`
                : `Video by ${(current as Video).user.name}`}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {isPhoto ? `Photographer: ${(current as Photo).photographer}` : `Duration: ${(current as Video).duration}s`}
            </div>
          </div>

          <button onClick={handleDownload} className="btn-download">
            <span>⬇</span> Download {isPhoto ? "Photo" : "Video"}
          </button>
        </div>
      </div>
    </div>
  );
}
