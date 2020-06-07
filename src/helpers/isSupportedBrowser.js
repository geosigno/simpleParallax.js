// need closest support
// https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
// need Intersection Observer support
// https://github.com/w3c/IntersectionObserver/tree/master/polyfill

const isSupportedBrowser = () => Element.prototype.closest && 'IntersectionObserver' in window;

export default isSupportedBrowser;
