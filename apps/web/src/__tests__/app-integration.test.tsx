import ReactDOMServer from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MediaProvider, useCuratedPhotos } from "@media/react";
import { useGrid, type GridProps } from "@media/ui-react";
import App from "../App";

describe("Web App Smoke & Integration Tests", () => {
  it("renders full App inside MediaProvider without crashing", () => {
    const html = ReactDOMServer.renderToString(
      <MediaProvider apiKey="test-key">
        <App />
      </MediaProvider>
    );

    expect(html).toContain("Media Studio");
    expect(html).toContain("Explore &amp; Search");
    expect(html).toContain("Reels Swiper");
    expect(html).toContain("Activity Log");
  });

  it("composes @media/react data hook with @media/ui-react useGrid correctly", () => {
    let capturedGridProps: GridProps | null = null;

    const IntegratedGridComponent = () => {
      const { data, loading, fetchNextPage, hasMore } = useCuratedPhotos({ perPage: 10 });
      const { getGridProps, getItemProps } = useGrid({
        data,
        loading,
        hasMore,
        onLoadMore: fetchNextPage,
      });

      capturedGridProps = getGridProps({ className: "test-integrated-grid" });

      return (
        <div {...capturedGridProps}>
          {data.map((item, i) => (
            <div key={item.id} {...getItemProps(item, i)}>
              {item.alt}
            </div>
          ))}
        </div>
      );
    };

    const html = ReactDOMServer.renderToString(
      <MediaProvider apiKey="test-key">
        <IntegratedGridComponent />
      </MediaProvider>
    );

    expect(html).toContain('role="grid"');
    expect(html).toContain("test-integrated-grid");
    expect((capturedGridProps as GridProps | null)?.role).toBe("grid");
  });
});
