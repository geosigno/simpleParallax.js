import { useCallback, useEffect, useRef, useState } from 'react';

const useGetImageHeight = (src: string) => {
    const [imageHeight, setImageHeight] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const imageRef = useRef<HTMLImageElement | null>(null);

    const updateImageHeight = useCallback(() => {
        if (imageRef.current) {
            setImageHeight(imageRef.current.height);
        }
    }, []);

    useEffect(() => {
        const handleImageLoad = () => {
            setIsLoaded(true);
            updateImageHeight();
        };

        const imgElement = imageRef.current;
        if (imgElement) {
            // If the image is already loaded (cached), directly get its height
            if (imgElement.complete) {
                handleImageLoad();
            } else {
                imgElement.addEventListener('load', handleImageLoad);
            }
        }

        // Add resize event listener
        window.addEventListener('resize', updateImageHeight);

        // Cleanup event listeners
        return () => {
            if (imgElement) {
                imgElement.removeEventListener('load', handleImageLoad);
            }
            window.removeEventListener('resize', updateImageHeight);
        };
    }, [src, updateImageHeight]);

    return [imageRef, imageHeight, isLoaded] as const;
};

export default useGetImageHeight;
