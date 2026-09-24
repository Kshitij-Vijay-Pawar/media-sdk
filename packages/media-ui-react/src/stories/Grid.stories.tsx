import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useGrid } from "../hooks/useGrid";

// Generic non-Pexels mock data shape proving full decoupling
interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
}

const initialProducts: Product[] = Array.from({ length: 8 }, (_, i) => ({
  id: `prod-${i + 1}`,
  name: `Premium Product #${i + 1}`,
  imageUrl: `https://picsum.photos/seed/prod${i + 1}/400/300`,
  price: (i + 1) * 25,
}));

const GridDemo = () => {
  const [items, setItems] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleLoadMore = () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setTimeout(() => {
      setItems((prev) => [
        ...prev,
        ...Array.from({ length: 4 }, (_, i) => ({
          id: `prod-${prev.length + i + 1}`,
          name: `Premium Product #${prev.length + i + 1}`,
          imageUrl: `https://picsum.photos/seed/prod${prev.length + i + 1}/400/300`,
          price: (prev.length + i + 1) * 25,
        })),
      ]);
      if (items.length >= 20) {
        setHasMore(false);
      }
      setLoading(false);
    }, 800);
  };

  const { getGridProps, getItemProps, sentinelRef } = useGrid({
    data: items,
    loading,
    hasMore,
    onLoadMore: handleLoadMore,
  });

  return (
    <div style={{ fontFamily: "sans-serif", padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "8px" }}>Headless Grid Component (Generic Product Model)</h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Demonstrating <code>useGrid</code> with prop-getters, keyboard navigation, and infinite scroll sentinel.
      </p>

      <div
        {...getGridProps({
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
          },
        })}
      >
        {items.map((product, idx) => (
          <div
            key={product.id}
            {...getItemProps(product, idx, {
              style: {
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                background: "#ffffff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              },
            })}
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "4px" }}
            />
            <div style={{ fontWeight: "600", fontSize: "14px" }}>{product.name}</div>
            <div style={{ color: "#2563eb", fontWeight: "700" }}>${product.price}</div>
          </div>
        ))}
      </div>

      <div ref={sentinelRef} style={{ height: "40px", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "20px" }}>
        {loading && <span style={{ color: "#2563eb" }}>Loading more products...</span>}
        {!hasMore && <span style={{ color: "#94a3b8" }}>Reached end of catalogue</span>}
      </div>
    </div>
  );
};

const meta: Meta<typeof GridDemo> = {
  title: "Headless UI / useGrid",
  component: GridDemo,
};

export default meta;
type Story = StoryObj<typeof GridDemo>;

export const Default: Story = {};
