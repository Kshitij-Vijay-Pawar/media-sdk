import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useLightbox } from "../hooks/useLightbox";

// Generic non-Pexels mock data shape (e.g. Gallery artworks)
interface Artwork {
  id: number;
  title: string;
  artist: string;
  url: string;
}

const galleryArtworks: Artwork[] = [
  {
    id: 1,
    title: "Starry Twilight",
    artist: "Vincent M.",
    url: "https://picsum.photos/seed/art1/900/600",
  },
  {
    id: 2,
    title: "Ethereal Mountains",
    artist: "Georgia O.",
    url: "https://picsum.photos/seed/art2/900/600",
  },
  {
    id: 3,
    title: "Urban Reflection",
    artist: "Claude M.",
    url: "https://picsum.photos/seed/art3/900/600",
  },
  {
    id: 4,
    title: "Golden Hour Waves",
    artist: "Katsushika H.",
    url: "https://picsum.photos/seed/art4/900/600",
  },
];

const LightboxDemo = () => {
  const {
    isOpen,
    currentIndex,
    currentItem,
    open,
    hasPrev,
    hasNext,
    getOverlayProps,
    getContentProps,
    getCloseButtonProps,
    getNextButtonProps,
    getPrevButtonProps,
  } = useLightbox({
    items: galleryArtworks,
  });

  return (
    <div style={{ fontFamily: "sans-serif", padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "8px" }}>Headless Lightbox Component (Generic Artwork Model)</h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Click any artwork below to open the modal. Supports keyboard navigation (<code>Escape</code>, <code>ArrowLeft</code>, <code>ArrowRight</code>) and body scroll locking.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
        {galleryArtworks.map((art, idx) => (
          <div
            key={art.id}
            onClick={() => open(idx)}
            style={{
              cursor: "pointer",
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid #e2e8f0",
            }}
          >
            <img src={art.url} alt={art.title} style={{ width: "100%", height: "140px", objectFit: "cover" }} />
            <div style={{ padding: "8px" }}>
              <div style={{ fontWeight: "600", fontSize: "14px" }}>{art.title}</div>
              <div style={{ color: "#64748b", fontSize: "12px" }}>{art.artist}</div>
            </div>
          </div>
        ))}
      </div>

      {isOpen && currentItem && (
        <div
          {...getOverlayProps({
            style: {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            },
          })}
        >
          <div
            {...getContentProps({
              style: {
                position: "relative",
                maxWidth: "800px",
                width: "90%",
                background: "#0f172a",
                color: "#ffffff",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              },
            })}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "18px" }}>{currentItem.title}</h3>
                <span style={{ fontSize: "13px", color: "#94a3b8" }}>{currentItem.artist}</span>
              </div>
              <button
                {...getCloseButtonProps({
                  style: {
                    background: "transparent",
                    border: "none",
                    color: "#ffffff",
                    fontSize: "20px",
                    cursor: "pointer",
                    padding: "4px 8px",
                  },
                })}
              >
                ✕
              </button>
            </div>

            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img
                src={currentItem.url}
                alt={currentItem.title}
                style={{ width: "100%", maxHeight: "60vh", objectFit: "contain" }}
              />

              <button
                {...getPrevButtonProps({
                  style: {
                    position: "absolute",
                    left: "12px",
                    background: "rgba(0,0,0,0.5)",
                    border: "none",
                    color: "#ffffff",
                    fontSize: "24px",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    cursor: hasPrev ? "pointer" : "not-allowed",
                    opacity: hasPrev ? 1 : 0.3,
                  },
                })}
              >
                ‹
              </button>

              <button
                {...getNextButtonProps({
                  style: {
                    position: "absolute",
                    right: "12px",
                    background: "rgba(0,0,0,0.5)",
                    border: "none",
                    color: "#ffffff",
                    fontSize: "24px",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    cursor: hasNext ? "pointer" : "not-allowed",
                    opacity: hasNext ? 1 : 0.3,
                  },
                })}
              >
                ›
              </button>
            </div>

            <div style={{ padding: "12px 16px", textAlign: "center", fontSize: "13px", color: "#94a3b8" }}>
              Artwork {currentIndex + 1} of {galleryArtworks.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const meta: Meta<typeof LightboxDemo> = {
  title: "Headless UI / useLightbox",
  component: LightboxDemo,
};

export default meta;
type Story = StoryObj<typeof LightboxDemo>;

export const Default: Story = {};
