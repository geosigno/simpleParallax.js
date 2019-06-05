// check wether the element is a Node List, a HTML Collection or an array
// return an array of nodes
const convertToArray = (elements) => {
    if (NodeList.prototype.isPrototypeOf(elements) || HTMLCollection.prototype.isPrototypeOf(elements)) return Array.from(elements);
    if (typeof elements === 'string' || elements instanceof String) return document.querySelectorAll(elements);
    return [elements];
};

export default convertToArray;
