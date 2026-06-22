import React from "react";
import { createRoot } from "react-dom/client";
import SimpleParallax from "../../src/react";

// Structure identique au playground vanilla pour comparer les deux versions :
// 5 images, mêmes paramètres, même layout.
const images = ["one", "two", "three", "four", "five"];

const App = () => (
  <div style={{ maxWidth: "900px", margin: "0 auto", padding: "80vh 0" }}>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(1, 1fr)",
        gridGap: "40px",
      }}
    >
      {images.map((id) => (
        <SimpleParallax
          delay={0.4}
          key={id}
          orientation="up"
          scale={1.5}
          transition="cubic-bezier(0,0,0,1)"
        >
          <img
            alt="Parallax demo"
            height={1728}
            src="image.png"
            style={{ width: "100%", height: "auto", display: "block" }}
            width={3072}
          />
        </SimpleParallax>
      ))}
    </div>
  </div>
);

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container missing in index.html");
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
