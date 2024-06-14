// check if media is fully loaded
const isImageLoaded = (media) => {
    // if the media is a video, return true
    if (
        media.tagName.toLowerCase() !== 'img' &&
        media.tagName.toLowerCase() !== 'picture'
    ) {
        return true;
    }

    // check if media is set as the parameter
    if (!media) {
        return false;
    }

    // check if media has been 100% loaded
    if (!media.complete) {
        return false;
    }

    // check if the media is displayed
    if (typeof media.naturalWidth !== 'undefined' && media.naturalWidth === 0) {
        return false;
    }

    return true;
};

export default isImageLoaded;
