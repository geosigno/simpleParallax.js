export const getRangeMax = (height: number, scale: number) => {
    return height * scale - height;
};

export const convertPercentageToRange = (
    percentage: number,
    rangeMax: number
) => {
    return Math.ceil((percentage / 100) * rangeMax - rangeMax / 2);
};

export const getPercentageVisible = (
    boundingClientRect: DOMRect,
    windowHeight: number
): number => {
    const { top, height } = boundingClientRect;

    const start = -height;
    const end = windowHeight;

    if (top < start) {
        return 0;
    }

    if (top > end) {
        return 100;
    }

    const percentage = ((top - start) / (end - start)) * 100;

    return Math.min(Math.max(percentage, 0), 100);
};

export const getTranslateValue = (
    value: number,
    orientation:
        | 'up'
        | 'right'
        | 'down'
        | 'left'
        | 'up left'
        | 'up right'
        | 'down left'
        | 'down right'
) => {
    switch (orientation) {
        case 'up':
            return `0, ${value}px, 0`;
        case 'right':
            return `${-value}px, 0, 0`;
        case 'down':
            return `0, ${-value}px, 0`;
        case 'left':
            return `${value}px, 0, 0`;
        case 'up left':
            return `${value}px, ${value}px, 0`;
        case 'up right':
            return `${-value}px, ${value}px, 0`;
        case 'down left':
            return `${value}px, ${-value}px, 0`;
        case 'down right':
            return `${-value}px, ${-value}px, 0`;
        default:
            return `0, ${value}px, 0`;
    }
};
