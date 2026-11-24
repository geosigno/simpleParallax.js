// Banc d'essai commun aux playgrounds vanilla et React : panneau de réglages,
// outils de scroll reproductibles et enregistreur du mouvement en direct.
import "./lab.css";
import { DEFAULTS } from "../../src/core/constants";
import {
  applyMaxTransition,
  getProgress,
  getRange,
  getTranslate,
} from "../../src/core/math";
import type { Easing, Orientation } from "../../src/core/types";

export interface LabOptions {
  delay: number;
  easing: Easing;
  maxTransition: number;
  orientation: Orientation;
  overflow: boolean;
  scale: number;
}

interface LabConfig {
  engine: string;
  onChange: (options: LabOptions, imageCount: number) => void;
}

interface Sample {
  dt: number;
  // première mesure d'une nouvelle image tracée : le tracé repart de là
  isBreak: boolean;
  target: number;
  value: number;
}

const ORIENTATIONS: Orientation[] = [
  "up",
  "right",
  "down",
  "left",
  "up left",
  "up right",
  "down left",
  "down right",
];
const EASINGS: Easing[] = ["smooth", "spring", "bounce"];
const IMAGE_COUNTS = [5, 20, 60];

const PIXELS_PER_SAMPLE = 2;
const READOUT_INTERVAL = 250;
const JUMP_DISTANCE = 600;
const WHEEL_NOTCH = 100;
const WHEEL_NOTCHES = 12;
const WHEEL_INTERVAL = 110;
const AUTO_SPEED = 600;
// une frame est comptée « lente » au-delà de 1,5 × la durée habituelle
const SLOW_FRAME_RATIO = 1.5;
const FRAME_BAR_HEIGHT = 18;
const FRAME_BAR_SCALE = 34;
// Encres du tracé : mêmes valeurs que les variables de lab.css. Écrites en dur
// parce que Safari ne les restitue pas au canvas via getComputedStyle.
const INK = {
  frame: "#b3bfcc",
  target: "#e5484d",
  value: "#2f5bea",
  warn: "#f2a900",
};
const TRANSLATE_PATTERN = /translate3d\((?<x>-?[\d.]+)px, (?<y>-?[\d.]+)px/u;

const pick = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Élément introuvable : ${selector}`);
  }
  return element;
};

const options = (values: readonly (string | number)[], selected: unknown) =>
  values
    .map(
      (value) =>
        `<option${value === selected ? " selected" : ""}>${value}</option>`
    )
    .join("");

const template = (engine: string) => `
  <aside class="lab-bench" id="lab-bench">
    <header class="lab-head">
      <p class="lab-kicker">simpleParallax · ${engine}</p>
      <h1>Banc d'essai</h1>
    </header>
    <form class="lab-controls">
      <fieldset class="lab-easing">
        <legend>easing</legend>
        ${EASINGS.map(
          (easing) => `
          <label>
            <input name="easing" type="radio" value="${easing}"${easing === DEFAULTS.easing ? " checked" : ""}>
            <span>${easing}</span>
          </label>`
        ).join("")}
      </fieldset>
      <label class="lab-field">
        <span>delay <output data-for="delay"></output> s</span>
        <input max="2" min="0" name="delay" step="0.1" type="range" value="${DEFAULTS.delay}">
      </label>
      <label class="lab-field">
        <span>scale <output data-for="scale"></output></span>
        <input max="3" min="1.1" name="scale" step="0.1" type="range" value="${DEFAULTS.scale}">
      </label>
      <label class="lab-field">
        <span>maxTransition <output data-for="maxTransition"></output> %</span>
        <input max="99" min="0" name="maxTransition" step="1" type="range" value="${DEFAULTS.maxTransition}">
      </label>
      <label class="lab-field">
        <span>orientation</span>
        <select name="orientation">${options(ORIENTATIONS, DEFAULTS.orientation)}</select>
      </label>
      <label class="lab-field">
        <span>images</span>
        <select name="imageCount">${options(IMAGE_COUNTS, IMAGE_COUNTS[0])}</select>
      </label>
      <label class="lab-check">
        <input name="overflow" type="checkbox"${DEFAULTS.overflow ? " checked" : ""}>
        <span>overflow</span>
      </label>
    </form>
    <div class="lab-tools">
      <p class="lab-label">Scroll reproductible</p>
      <button data-tool="jump" type="button">Saut de ${JUMP_DISTANCE} px</button>
      <button data-tool="wheel" type="button">Molette simulée</button>
      <button aria-pressed="false" data-tool="auto" type="button">Défilement auto</button>
    </div>
    <pre class="lab-snippet"></pre>
  </aside>
  <section class="lab-recorder" aria-label="Enregistreur de mouvement">
    <canvas></canvas>
    <dl class="lab-readouts">
      <div><dt>fps</dt><dd data-readout="fps">–</dd></div>
      <div><dt>pire frame</dt><dd data-readout="worst">–</dd></div>
      <div><dt>frames lentes</dt><dd data-readout="slow">0</dd></div>
      <div><dt>scroll</dt><dd data-readout="speed">–</dd></div>
      <div><dt>retard</dt><dd data-readout="lag">–</dd></div>
    </dl>
    <p class="lab-legend">
      <span class="lab-pen-target">cible</span>
      <span class="lab-pen-value">image affichée</span>
      <span class="lab-pen-frame">durée des frames</span>
    </p>
    <p class="lab-notice" hidden>Mouvement réduit activé sur cet appareil : l'effet est désactivé.</p>
  </section>
  <button aria-controls="lab-bench" aria-expanded="false" class="lab-toggle" type="button">Réglages</button>
`;

// Valeur de translation lue sur l'image, dans la convention du moteur
// (positive quand l'image a dépassé le centre).
const readValue = (image: HTMLElement, orientation: Orientation): number => {
  const groups = TRANSLATE_PATTERN.exec(image.style.transform)?.groups;
  if (!groups) {
    return 0;
  }
  const [x, y] = [Number(groups.x), Number(groups.y)];
  if (orientation.includes("up")) {
    return -y;
  }
  if (orientation.includes("down")) {
    return y;
  }
  return orientation === "left" ? -x : x;
};

export const createLab = ({ engine, onChange }: LabConfig): (() => void) => {
  const root = document.createElement("div");
  root.className = "lab";
  root.innerHTML = template(engine);
  document.body.append(root);

  const form = pick<HTMLFormElement>(root, ".lab-controls");
  const snippet = pick<HTMLElement>(root, ".lab-snippet");
  const canvas = pick<HTMLCanvasElement>(root, "canvas");
  const context = canvas.getContext("2d");
  const toggle = pick<HTMLButtonElement>(root, ".lab-toggle");
  const autoButton = pick<HTMLButtonElement>(root, '[data-tool="auto"]');
  const readout = (name: string) =>
    pick<HTMLElement>(root, `[data-readout="${name}"]`);
  const readouts = {
    fps: readout("fps"),
    worst: readout("worst"),
    slow: readout("slow"),
    speed: readout("speed"),
    lag: readout("lag"),
  };

  pick<HTMLElement>(root, ".lab-notice").hidden = !window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let current: LabOptions = { ...DEFAULTS };

  // --- Réglages -----------------------------------------------------------
  const apply = () => {
    const data = new FormData(form);
    current = {
      delay: Number(data.get("delay")),
      easing: data.get("easing") as Easing,
      maxTransition: Number(data.get("maxTransition")),
      orientation: data.get("orientation") as Orientation,
      overflow: data.has("overflow"),
      scale: Number(data.get("scale")),
    };
    for (const output of form.querySelectorAll("output")) {
      output.textContent = String(data.get(output.dataset.for ?? ""));
    }
    snippet.textContent = JSON.stringify(current, null, 2);
    // nouveau réglage, nouvelle mesure
    slowFrames = 0;
    onChange(current, Number(data.get("imageCount")));
  };
  form.addEventListener("input", apply);

  toggle.addEventListener("click", () => {
    const isOpen = root.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.textContent = isOpen ? "Fermer" : "Réglages";
  });

  // --- Outils de scroll ---------------------------------------------------
  let autoDirection = 0;
  const tools: Record<string, () => void> = {
    jump: () => window.scrollBy(0, JUMP_DISTANCE),
    wheel: () => {
      for (let notch = 0; notch < WHEEL_NOTCHES; notch += 1) {
        setTimeout(
          () => window.scrollBy(0, WHEEL_NOTCH),
          notch * WHEEL_INTERVAL
        );
      }
    },
    auto: () => {
      autoDirection = autoDirection === 0 ? 1 : 0;
      autoButton.setAttribute("aria-pressed", String(autoDirection !== 0));
    },
  };
  pick<HTMLElement>(root, ".lab-tools").addEventListener("click", (event) => {
    const { tool } = (event.target as HTMLElement).dataset;
    if (tool) {
      tools[tool]();
    }
  });

  const autoScroll = (dt: number) => {
    if (autoDirection === 0) {
      return;
    }
    const limit = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY >= limit) {
      autoDirection = -1;
    } else if (window.scrollY <= 0) {
      autoDirection = 1;
    }
    window.scrollBy(0, (autoDirection * AUTO_SPEED * dt) / 1000);
  };

  // --- Enregistreur -------------------------------------------------------
  const samples: Sample[] = [];
  let traced: HTMLElement | null = null;
  let isNewTrace = false;
  let range = 0;
  let usualFrame = 0;
  let slowFrames = 0;
  let worstFrame = 0;
  let framesSinceReadout = 0;
  let lastReadout = performance.now();
  let lastFrame = lastReadout;
  let lastScrollY = window.scrollY;
  let speed = 0;

  // l'image tracée est celle la plus proche du centre de l'écran
  const pickTraced = () => {
    const center = window.innerHeight / 2;
    let closest: HTMLElement | null = null;
    let closestDistance = Number.POSITIVE_INFINITY;
    for (const frame of document.querySelectorAll<HTMLElement>(".frame")) {
      const rect = frame.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - center);
      if (distance < closestDistance) {
        closest = frame;
        closestDistance = distance;
      }
    }
    if (closest !== traced) {
      isNewTrace = true;
      traced?.classList.remove("is-traced");
      closest?.classList.add("is-traced");
      traced = closest;
    }
  };

  const measure = (dt: number) => {
    const image = traced?.querySelector("img");
    if (!(traced && image)) {
      return;
    }
    const rect = traced.getBoundingClientRect();
    const progress = applyMaxTransition(
      getProgress(rect.top, document.documentElement.clientHeight, rect.height),
      current.maxTransition
    );
    range = getRange(image.clientHeight, current.scale);
    samples.push({
      dt,
      isBreak: isNewTrace,
      target: getTranslate(progress, range),
      value: readValue(image, current.orientation),
    });
    isNewTrace = false;
    const capacity = Math.ceil(canvas.clientWidth / PIXELS_PER_SAMPLE);
    if (samples.length > capacity) {
      samples.splice(0, samples.length - capacity);
    }
  };

  const draw = () => {
    if (!context) {
      return;
    }
    const ratio = window.devicePixelRatio;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
      canvas.width = width * ratio;
      canvas.height = height * ratio;
    }
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);

    const traceHeight = height - FRAME_BAR_HEIGHT;
    const middle = traceHeight / 2;
    const toY = (value: number) =>
      range > 0 ? middle - (value / range) * (traceHeight - 8) : middle;
    const toX = (index: number) =>
      width - (samples.length - index) * PIXELS_PER_SAMPLE;

    // durée de chaque frame, en bas du graphe
    for (const [index, sample] of samples.entries()) {
      const isSlow = sample.dt > usualFrame * SLOW_FRAME_RATIO;
      const bar = Math.min(sample.dt / FRAME_BAR_SCALE, 1) * FRAME_BAR_HEIGHT;
      context.fillStyle = isSlow ? INK.warn : INK.frame;
      context.fillRect(toX(index), height - bar, PIXELS_PER_SAMPLE - 0.5, bar);
    }

    const trace = (key: "target" | "value", color: string, line: number) => {
      context.beginPath();
      for (const [index, sample] of samples.entries()) {
        if (sample.isBreak) {
          context.moveTo(toX(index), toY(sample[key]));
        } else {
          context.lineTo(toX(index), toY(sample[key]));
        }
      }
      context.strokeStyle = color;
      context.lineWidth = line;
      context.lineJoin = "round";
      context.stroke();
    };
    trace("target", INK.target, 1.5);
    trace("value", INK.value, 2);
  };

  const updateReadouts = (now: number) => {
    const elapsed = now - lastReadout;
    const last = samples.at(-1);
    readouts.fps.textContent = String(
      Math.round((framesSinceReadout * 1000) / elapsed)
    );
    readouts.worst.textContent = `${worstFrame.toFixed(0)} ms`;
    readouts.slow.textContent = String(slowFrames);
    readouts.speed.textContent = `${Math.round(speed)} px/s`;
    readouts.lag.textContent = last
      ? `${Math.abs(last.target - last.value).toFixed(1)} px`
      : "–";
    framesSinceReadout = 0;
    worstFrame = 0;
    lastReadout = now;
    pickTraced();
  };

  let frameId = 0;
  const tick = (now: number) => {
    const dt = now - lastFrame;
    lastFrame = now;
    framesSinceReadout += 1;
    worstFrame = Math.max(worstFrame, dt);
    // moyenne glissante de la durée d'une frame, pour repérer les lentes
    usualFrame = usualFrame === 0 ? dt : usualFrame * 0.95 + dt * 0.05;
    if (dt > usualFrame * SLOW_FRAME_RATIO) {
      slowFrames += 1;
    }
    speed = dt > 0 ? (Math.abs(window.scrollY - lastScrollY) * 1000) / dt : 0;
    lastScrollY = window.scrollY;

    autoScroll(dt);
    measure(dt);
    draw();
    if (now - lastReadout >= READOUT_INTERVAL) {
      updateReadouts(now);
    }
    frameId = requestAnimationFrame(tick);
  };

  apply();
  pickTraced();
  frameId = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frameId);
    root.remove();
  };
};
