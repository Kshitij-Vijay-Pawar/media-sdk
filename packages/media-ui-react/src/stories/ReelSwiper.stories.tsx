import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useReelSwiper } from "../hooks/useReelSwiper";

// Generic non-Pexels mock reel data shape (e.g. Micro-learning stories)
interface ReelStory {
  id: string;
  topic: string;
  creator: string;
  color: string;
  duration: string;
}

const microLessons: ReelStory[] = [
  { id: "story-1", topic: "Intro to CSS Container Queries", creator: "DevTuts", color: "#3b82f6", duration: "0:45" },
  { id: "story-2", topic: "Understanding React 19 Actions", creator: "FrontendMaster", color: "#8b5cf6", duration: "1:12" },
  { id: "story-3", topic: "Headless Architecture Patterns", creator: "SystemDesignDaily", color: "#ec4899", duration: "0:58" },
  { id: "story-4", topic: "High Performance Web Animations", creator: "MotionLab", color: "#10b981", duration: "1:05" },
];

const ReelSwiperDemo = () => {
  const [activeStory, setActiveStory] = useState<ReelStory>(microLessons[0]!);

  const { getContainerProps, getSlideProps, activeIndex, scrollNext, scrollPrev } = useReelSwiper({
    items: microLessons,
    threshold: 0.6,
    onActiveChange: (_index, item) => {
      setActiveStory(item);
    },
  });

  return (
    <div style={{ fontFamily: "sans-serif", padding: "24px", maxWidth: "500px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "8px" }}>Headless Reel Swiper (Generic Story Model)</h2>
      <p style={{ color: "#666", marginBottom: "16px", fontSize: "14px" }}>
        Vertical snap-scrolling reel with IntersectionObserver detection (threshold 0.6).
      </p>

      <div style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "14px", fontWeight: "600" }}>Active: {activeStory.topic}</span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={scrollPrev} disabled={activeIndex === 0} style={{ padding: "4px 10px", borderRadius: "4px" }}>
            ▲ Prev
          </button>
          <button onClick={scrollNext} disabled={activeIndex === microLessons.length - 1} style={{ padding: "4px 10px", borderRadius: "4px" }}>
            ▼ Next
          </button>
        </div>
      </div>

      <div
        {...getContainerProps({
          style: {
            height: "450px",
            overflowY: "scroll",
            scrollSnapType: "y mandatory",
            borderRadius: "16px",
            border: "2px solid #1e293b",
            background: "#020617",
          },
        })}
      >
        {microLessons.map((item, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={item.id}
              {...getSlideProps(item, idx, {
                style: {
                  height: "450px",
                  scrollSnapAlign: "start",
                  scrollSnapStop: "always",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "24px",
                  boxSizing: "border-box",
                  background: `linear-gradient(180deg, ${item.color} 0%, #090d16 100%)`,
                  color: "#ffffff",
                  position: "relative",
                  transition: "opacity 0.3s ease",
                  opacity: isActive ? 1 : 0.6,
                },
              })}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ background: "rgba(0,0,0,0.4)", padding: "4px 10px", borderRadius: "20px", fontSize: "12px" }}>
                  {item.duration}
                </span>
                <span style={{ fontSize: "12px", opacity: 0.8 }}>#{idx + 1} of {microLessons.length}</span>
              </div>

              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>{isActive ? "▶️" : "⏸️"}</div>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>{item.topic}</h3>
                <p style={{ margin: 0, fontSize: "14px", opacity: 0.85 }}>By @{item.creator}</p>
              </div>

              <div style={{ fontSize: "12px", textAlign: "center", opacity: 0.7 }}>
                {isActive ? "Currently in active focus view" : "Scroll to focus"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const meta: Meta<typeof ReelSwiperDemo> = {
  title: "Headless UI / useReelSwiper",
  component: ReelSwiperDemo,
};

export default meta;
type Story = StoryObj<typeof ReelSwiperDemo>;

export const Default: Story = {};
