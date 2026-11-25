import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import SimpleParallax from "../../src/react";
import { createLab, type LabOptions } from "../shared/lab";

interface LabState {
  imageCount: number;
  options: LabOptions;
}

// Same test bench as the vanilla playground: the settings arrive as props.
const App = () => {
  const [lab, setLab] = useState<LabState | null>(null);

  useEffect(
    () =>
      createLab({
        engine: "react",
        onChange: (options, imageCount) => setLab({ options, imageCount }),
      }),
    []
  );

  if (!lab) {
    return null;
  }

  return (
    <main className="stage">
      {Array.from({ length: lab.imageCount }, (_, index) => index).map(
        (index) => (
          <figure className="frame" key={index}>
            <SimpleParallax {...lab.options}>
              <img
                alt="Parallax demo"
                height={1728}
                src="image.png"
                width={3072}
              />
            </SimpleParallax>
          </figure>
        )
      )}
    </main>
  );
};

const container = document.querySelector("#root");
if (!container) {
  throw new Error("Root container missing in index.html");
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
