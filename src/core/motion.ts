// Moteur d'animation : rapproche à chaque frame la valeur affichée d'une image
// de la cible fixée par le scroll. Aucune dépendance au DOM.
import { clamp } from "./math.js";
import type { ParallaxOptions } from "./types.js";

// Valeur affichée d'une image et sa vitesse (px/s, utilisée par les ressorts).
export interface Motion {
  value: number;
  velocity: number;
}

// Réglés pour que ~98 % du trajet soit parcouru au bout de `delay` secondes.
const SMOOTH_RATIO = 4;
const SPRING_RATIO = 6;
// En dessous de ces seuils (px, px/s), l'image se pose sur sa cible.
const SETTLE_DISTANCE = 0.05;
const SETTLE_VELOCITY = 1;
// Amortissement du rebond : 1 = aucun dépassement, plus bas = rebond plus marqué.
// Il dépend de l'élan : rebond franc après un scroll rapide, discret après un lent.
const BOUNCE_DAMPING_FAST = 0.54;
const BOUNCE_DAMPING_SLOW = 0.77;
// Élan (en part de l'amplitude) à partir duquel le rebond est maximal.
const BOUNCE_FULL_MOMENTUM = 0.1;

// Ressort sous-amorti : dépasse la cible puis y revient. Le dépassement est
// borné à l'amplitude pour ne jamais découvrir le bord de l'image.
const bounce = (
  motion: Motion,
  target: number,
  delay: number,
  range: number,
  seconds: number
): void => {
  const omega = SPRING_RATIO / delay;
  const offset = motion.value - target;
  // élan en px : écart à la cible et vitesse combinés
  const momentum = Math.hypot(offset, motion.velocity / omega);
  const intensity =
    range > 0 ? Math.min(momentum / (range * BOUNCE_FULL_MOMENTUM), 1) : 1;
  const ratio =
    BOUNCE_DAMPING_SLOW +
    (BOUNCE_DAMPING_FAST - BOUNCE_DAMPING_SLOW) * intensity;
  const damping = ratio * omega;
  const frequency = omega * Math.sqrt(1 - ratio ** 2);
  const swing = (motion.velocity + damping * offset) / frequency;
  const decay = Math.exp(-damping * seconds);
  const cos = Math.cos(frequency * seconds);
  const sin = Math.sin(frequency * seconds);

  motion.value = clamp(
    target + decay * (offset * cos + swing * sin),
    -range / 2,
    range / 2
  );
  motion.velocity =
    decay *
    ((frequency * swing - damping * offset) * cos -
      (frequency * offset + damping * swing) * sin);
};

// Vrai quand l'image est posée sur sa cible, à l'arrêt.
export const isSettled = (motion: Motion, target: number): boolean =>
  motion.value === target && motion.velocity === 0;

// Rapproche `motion` de `target` pendant dt (ms), indépendamment de la cadence.
// Retourne false si la valeur n'a pas bougé (rien à redessiner).
// - smooth : parcourt une fraction de la distance restante (départ vif, fin douce)
// - spring : ressort sans rebond (départ doux, fin douce)
// - bounce : ressort avec rebond (dépasse légèrement la cible puis revient)
export const advance = (
  motion: Motion,
  target: number,
  { delay, easing }: Pick<ParallaxOptions, "delay" | "easing">,
  range: number,
  dt: number
): boolean => {
  // image posée sur sa cible : rien à calculer (cas de loin le plus fréquent)
  if (isSettled(motion, target)) {
    return false;
  }
  const previous = motion.value;
  const distance = target - previous;
  const seconds = dt / 1000;

  if (delay <= 0) {
    motion.value = target;
  } else if (easing === "bounce") {
    bounce(motion, target, delay, range, seconds);
  } else if (easing === "spring") {
    const omega = SPRING_RATIO / delay;
    const decay = Math.exp(-omega * seconds);
    const offset = (motion.velocity - omega * distance) * seconds;
    motion.value = target + (offset - distance) * decay;
    motion.velocity = (motion.velocity - omega * offset) * decay;
  } else {
    motion.value =
      previous + distance * (1 - Math.exp((-SMOOTH_RATIO * seconds) / delay));
  }

  // écart et vitesse imperceptibles : l'image se pose sur sa cible
  const isAtRest =
    Math.abs(target - motion.value) < SETTLE_DISTANCE &&
    Math.abs(motion.velocity) < SETTLE_VELOCITY;
  if (isAtRest) {
    motion.value = target;
    motion.velocity = 0;
  }
  return motion.value !== previous;
};
