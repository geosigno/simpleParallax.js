// Détecte la propriété CSS transform supportée (avec préfixes legacy).
const cssTransform = (): string => {
	const prefixes =
		"transform webkitTransform mozTransform oTransform msTransform".split(" ");
	const style = document.createElement("div").style as CSSStyleDeclaration & Record<string, unknown>;
	let transform: string | undefined;
	let i = 0;
	while (transform === undefined && i < prefixes.length) {
		if (style[prefixes[i]] !== undefined) {
			transform = prefixes[i];
		}
		i += 1;
	}
	return transform ?? "transform";
};

export default cssTransform();
