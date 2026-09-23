import React from "react";
import ReactDOMServer from "react-dom/server";
import { describe, expect, it } from "vitest";
import { useGrid, useLightbox, useReelSwiper } from "../index";

describe("@media/ui-native", () => {
  it("exports useGrid, useLightbox, and useReelSwiper", () => {
    expect(typeof useGrid).toBe("function");
    expect(typeof useLightbox).toBe("function");
    expect(typeof useReelSwiper).toBe("function");
  });

  it("useGrid returns FlatList-compatible props and works with generic items", () => {
    const items = [{ id: "n1", label: "Native Item 1" }];
    let gridReturn: ReturnType<typeof useGrid<{ id: string; label: string }>> | null = null;

    const TestComponent = () => {
      gridReturn = useGrid({
        data: items,
        getItemKey: (item) => item.id,
      });
      return null;
    };

    ReactDOMServer.renderToString(<TestComponent />);
    const gridProps = gridReturn?.getGridProps();
    expect(gridProps?.data).toEqual(items);
    expect(gridProps?.keyExtractor(items[0]!, 0)).toBe("n1");
    expect(gridProps?.onEndReachedThreshold).toBe(0.5);
  });

  it("useLightbox manages modal visibility and native button props", () => {
    const items = ["A", "B", "C"];
    let lightboxReturn: ReturnType<typeof useLightbox<string>> | null = null;

    const TestComponent = () => {
      lightboxReturn = useLightbox({ items });
      return null;
    };

    ReactDOMServer.renderToString(<TestComponent />);
    const overlayProps = lightboxReturn?.getOverlayProps();
    expect(overlayProps?.visible).toBe(false);
    expect(overlayProps?.transparent).toBe(true);

    const prevButton = lightboxReturn?.getPrevButtonProps();
    expect(prevButton?.disabled).toBe(true);
  });

  it("useReelSwiper returns paging enabled and viewability configs", () => {
    const items = ["Reel1", "Reel2"];
    let reelReturn: ReturnType<typeof useReelSwiper<string>> | null = null;

    const TestComponent = () => {
      reelReturn = useReelSwiper({ items });
      return null;
    };

    ReactDOMServer.renderToString(<TestComponent />);
    const containerProps = reelReturn?.getContainerProps();
    expect(containerProps?.pagingEnabled).toBe(true);
    expect(containerProps?.viewabilityConfig.itemVisiblePercentThreshold).toBe(60);
  });
});
