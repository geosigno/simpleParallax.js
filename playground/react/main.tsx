import React from "react";
import { createRoot } from "react-dom/client";
import SimpleParallax from "../../src/react";

// Structure identique au playground vanilla pour comparer les deux versions :
// 5 images, mêmes paramètres, même layout.
const App = () => {
  const images = [
    "image.png",
    "image.png",
    "image.png",
    "image.png",
    "image.png",
  ];

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "80vh 0" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(1, 1fr)",
          gridGap: "40px",
        }}
      >
        {images.map((src, index) => (
          <SimpleParallax
            key={index}
            orientation="up"
            scale={1.5}
            delay={0.4}
            transition="cubic-bezier(0,0,0,1)"
          >
            <img
              src={src}
              alt={`image-${index}`}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </SimpleParallax>
        ))}
      </div>
    </div>
  );
};

const container = document.getElementById("root");
if (!container) throw new Error("Root container missing in index.html");

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
