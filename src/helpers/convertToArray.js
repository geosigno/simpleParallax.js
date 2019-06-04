// check wether the element is a Node List, a HTML Collection or an array
// return an array of nodes
const convertToArray = elements => {
    if (NodeList.prototype.isPrototypeOf(elements)) return elements;
    if (HTMLCollection.prototype.isPrototypeOf(elements)) return Array.from(elements);
    else return [elements];
};

export default convertToArray;
