const isSupportedBrowser = (): boolean =>
  !!Element.prototype.closest && "IntersectionObserver" in window;

export default isSupportedBrowser;
