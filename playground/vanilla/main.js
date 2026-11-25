import SimpleParallax from "../../src/vanilla/";
import { createLab } from "../shared/lab.ts";

const stage = document.querySelector(".stage");
const FRAME = `<figure class="frame"><img alt="Parallax demo" src="image.png"></figure>`;
let instance;

// Recreates the effect on every change of a test bench setting.
createLab({
  engine: "vanilla",
  onChange: (options, imageCount) => {
    instance?.destroy();
    if (stage.children.length !== imageCount) {
      stage.innerHTML = FRAME.repeat(imageCount);
    }
    instance = new SimpleParallax(stage.querySelectorAll("img"), options);
  },
});
