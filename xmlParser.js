/**
 * This class is responsible to parse a xml file given with the method "parse"
 * once the file is parsed you can use method from class to get content
 */
export default class XMLParser {
    constructor() {
        this.parser = new DOMParser();
        this.xmlDoc = null;
    }
    /**
     * parse the xml
     * @param {type} xmlDocument
     * @returns {unresolved}
     */
    parse(xmlDocument) {
        this.xmlDoc = this.parser.parseFromString(xmlDocument, "text/xml");
        return this.xmlDoc;
    }
    /**
     * delete the xml doc
     * @returns {undefined}
     */
    clear() {
        this.xmlDoc = null;
    }

    /**
     * Read value between <tagName></tagName>
     * @param {type} tagName
     * @returns {.xmlDoc@call;@arr;getElementsByTagName.childNodes.nodeValue|String}
     */
    readTagContent(tagName) {
        let tag = this.xmlDoc.getElementsByTagName(tagName)[0];
        if (tag === undefined) {
            return "";
        }
        return tag.childNodes[0].nodeValue;
    }

    /**
     * Read value from attribute from tag ex :  <tagName att1="something"></tagName>
     * @param {type} tagName
     * @param {type} attribute
     * @returns {unresolved}
     */
    readAttributeOf(tagName, attribute) {
        let tag = this.xmlDoc.getElementsByTagName(tagName)[0];
        if (tag === undefined || tag.attributes[attribute] === undefined) {
            return "/";
        }
        return tag.attributes[attribute].nodeValue;
    }
}