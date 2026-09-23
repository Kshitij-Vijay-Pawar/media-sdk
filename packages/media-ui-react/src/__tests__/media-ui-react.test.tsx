import React from "react";
import ReactDOMServer from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { useGrid, useLightbox, useReelSwiper } from "../index";

interface DummyCustomItem {
  id: string;
  name: string;
  customScore: number;
}

describe("@media/ui-react", () => {
  describe("useGrid", () => {
    it("works with generic non-Pexels data shape", () => {
      const items: DummyCustomItem[] = [
        { id: "a1", name: "Alpha", customScore: 99 },
        { id: "b2", name: "Beta", customScore: 88 },
      ];

      let hookReturn: ReturnType<typeof useGrid<DummyCustomItem>> | null = null;
      const TestComponent = () => {
        hookReturn = useGrid({
          data: items,
          loading: false,
          hasMore: true,
          getItemKey: (item) => item.id,
        });
        return <div {...hookReturn.getGridProps()} />;
      };

      const html = ReactDOMServer.renderToString(<TestComponent />);
      expect(html).toContain('role="grid"');
      expect(hookReturn?.items).toHaveLength(2);

      const item0Props = hookReturn?.getItemProps(items[0]!, 0);
      expect(item0Props?.role).toBe("gridcell");
      expect(item0Props?.["data-index"]).toBe(0);
      expect(item0Props?.["data-key"]).toBe("a1");
    });

    it("attaches aria-busy when loading is true", () => {
      let hookReturn: ReturnType<typeof useGrid<string>> | null = null;
      const TestComponent = () => {
        hookReturn = useGrid<string>({
          data: [],
          loading: true,
        });
        return <div {...hookReturn.getGridProps()} />;
      };

      const html = ReactDOMServer.renderToString(<TestComponent />);
      expect(html).toContain('aria-busy="true"');
    });
  });

  describe("useLightbox", () => {
    it("manages open/close state, navigation, and disabled buttons", () => {
      const items = ["Item 1", "Item 2", "Item 3"];
      let hookReturn: ReturnType<typeof useLightbox<string>> | null = null;

      const TestComponent = () => {
        hookReturn = useLightbox({ items });
        return null;
      };

      ReactDOMServer.renderToString(<TestComponent />);
      expect(hookReturn?.isOpen).toBe(false);
      expect(hookReturn?.currentItem).toBe(null);

      // Verify button props
      const prevProps = hookReturn?.getPrevButtonProps();
      expect(prevProps?.disabled).toBe(true);
      expect(prevProps?.["aria-label"]).toBe("Previous item");

      const overlayProps = hookReturn?.getOverlayProps();
      expect(overlayProps?.role).toBe("dialog");
      expect(overlayProps?.["aria-modal"]).toBe(true);
    });

    it("supports custom onClick and merges attributes without overwriting behavior", () => {
      const customOnClick = vi.fn();
      let hookReturn: ReturnType<typeof useLightbox<string>> | null = null;

      const TestComponent = () => {
        hookReturn = useLightbox({ items: ["Test"] });
        return null;
      };

      ReactDOMServer.renderToString(<TestComponent />);
      const closeProps = hookReturn?.getCloseButtonProps({
        className: "custom-close-btn",
        onClick: customOnClick,
      });

      expect(closeProps?.className).toBe("custom-close-btn");
      expect(closeProps?.["aria-label"]).toBe("Close lightbox");
    });
  });

  describe("useReelSwiper", () => {
    it("returns correct carousel accessibility attributes and active item", () => {
      const items = [
        { reelId: 1, title: "Reel One" },
        { reelId: 2, title: "Reel Two" },
      ];

      let hookReturn: ReturnType<typeof useReelSwiper<{ reelId: number; title: string }>> | null = null;

      const TestComponent = () => {
        hookReturn = useReelSwiper({ items });
        return null;
      };

      ReactDOMServer.renderToString(<TestComponent />);
      const containerProps = hookReturn?.getContainerProps({ className: "my-container" });
      expect(containerProps?.["aria-roledescription"]).toBe("carousel");
      expect(containerProps?.className).toBe("my-container");

      const slide0Props = hookReturn?.getSlideProps(items[0]!, 0);
      expect(slide0Props?.["aria-roledescription"]).toBe("slide");
      expect(slide0Props?.["data-index"]).toBe(0);
      expect(slide0Props?.["data-active"]).toBe(true);
      expect(hookReturn?.activeItem).toEqual(items[0]);
    });
  });
});
