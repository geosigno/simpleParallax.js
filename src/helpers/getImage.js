const getImage = (element) => {
    if (element.tagName.toLowerCase() === 'picture') return element.querySelector('img');
    return element;
};

export default getImage;
