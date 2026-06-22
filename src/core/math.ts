export const clamp = (value: number, min: number, max: number): number =>
	Math.min(max, Math.max(min, value));

// Progression de l'élément dans le viewport, normalisée [0,1].
// top = position viewport-relative du haut de l'élément.
export const getProgress = (
	top: number,
	viewportHeight: number,
	elementHeight: number
): number => {
	const span = viewportHeight + elementHeight;
	if (span === 0) return 0;
	return clamp((viewportHeight - top) / span, 0, 1);
};

// Borne la progression à maxTransition (exprimé 0..100 ; 0 = désactivé).
export const applyMaxTransition = (p: number, maxTransition: number): number => {
	if (maxTransition > 0 && p * 100 > maxTransition) {
		return maxTransition / 100;
	}
	return p;
};

// Amplitude de translation possible, en pixels.
export const getRange = (elementHeight: number, scale: number): number =>
	elementHeight * (scale - 1);

// Valeur de translation en pixels, 0 au centre, arrondie à l'entier.
export const getTranslate = (p: number, range: number): number =>
	Math.round((p - 0.5) * range);
