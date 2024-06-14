import { useEffect, useState } from 'react';
import { Orientation, SimpleParallaxProps } from '../types';
import {
    convertPercentageToRange,
    getPercentageVisible,
    getRangeMax,
    getTranslateValue
} from '../utils';
import useWindowHeight from './useWindowHeight';

const useGetTransitionValue = ({
    isLoaded,
    imageHeight,
    scale,
    boundingClientRect,
    orientation,
    maxTransition
}: {
    isLoaded: boolean;
    imageHeight: number;
    scale: number;
    boundingClientRect: DOMRect;
    orientation: Orientation;
    maxTransition: SimpleParallaxProps['maxTransition'];
}) => {
    const [maxRange, setMaxRange] = useState(0);
    const [translateValue, setTranslateValue] = useState(0);
    const [transitionValue, setTransitionValue] = useState('');
    const [visibilityPercentage, setVisibilityPercentage] = useState(0);

    const windowHeight = useWindowHeight();

    useEffect(() => {
        if (!isLoaded) return;
        const range = getRangeMax(imageHeight, scale);
        setMaxRange(range);
    }, [isLoaded, imageHeight, scale]);

    useEffect(() => {
        if (!isLoaded || !windowHeight || !boundingClientRect) return;

        let percentage = getPercentageVisible(boundingClientRect, windowHeight);

        if (maxTransition) {
            percentage = Math.min(percentage, 100 -maxTransition);
        }

        setVisibilityPercentage(percentage);
    }, [isLoaded, boundingClientRect, windowHeight]);

    useEffect(() => {
        const value = convertPercentageToRange(visibilityPercentage, maxRange);

        setTranslateValue(value);
    }, [visibilityPercentage, maxRange]);

    useEffect(() => {
        const value = getTranslateValue(translateValue, orientation);

        setTransitionValue(value);
    }, [translateValue, orientation]);

    return transitionValue;
};

export default useGetTransitionValue;
