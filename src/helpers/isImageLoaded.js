// check if media is fully loaded
const isImageLoaded = (media, callback) => {
    // if the media is a video, return true
    if (media.tagName.toLowerCase() !== 'img') {
        return callback();
    }

    // check if media has been 100% loaded
    // check if the media is displayed
    if (!media.complete || (typeof media.naturalWidth !== 'undefined' && media.naturalWidth === 0)) {
        return media.addEventListener('load', () => {
            // timeout to ensure the image is fully painted into the DOM
            setTimeout(() => callback(), 10);
        });
    }

    return callback();
};

export default isImageLoaded;
