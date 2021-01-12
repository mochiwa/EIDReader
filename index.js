/**
 * This class is responsible to parse a xml file given with the method "parse"
 * once the file is parsed you can use method from class to get content
 */
class XMLParser {
    constructor(xmlDocument) {
        this.parser = new DOMParser();
        this.xmlDoc = new DOMParser().parseFromString(xmlDocument, "text/xml");
    }

    /**
     * Read value between <tagName></tagName>
     * @param {string} tagName
     * @returns {string}
     */
    getTagValue(tagName) {
        let tag = this.xmlDoc.getElementsByTagName(tagName)[0];
        if (tag === undefined) {
            return "";
        }
        return tag.childNodes[0].nodeValue;
    }

    /**
     * Read value of attribute from tag ex :  <tagName att1="something"></tagName>
     * @param {string} tagName
     * @param {string} attribute
     * @returns {null || string} 
     */
    getAttributeOfTag(tagName, attribute) {
        let tag = this.xmlDoc.getElementsByTagName(tagName)[0];
        if (tag === undefined || tag.attributes[attribute] === undefined) {
            return null;
        }
        return tag.attributes[attribute].nodeValue;
    }
}

/**
 * This class generate and drop box awares when something dropped in,
 * when it's the case the dropbox emit dataDropped event
 */
class Dropbox {
    static get DATA_DROPPED_EVENT() {return 'dataDropped';}

    /**
     * @param {HTMLElement} parent the parent to attach the dropbox
     * @param {string} properties.dropBox_id set the id of the drop box | default is dropbox
     * @param {string} properties.dropBox_class set the class of the drop box | default is dropbox
     * @param {string} properties.dropBox_style_dragOver set the class of the drag over | default is dropbox--dragover
     * @param {string} properties.dropElementFormat set the data format expected to be dropped | default is text
     * @param {string} properties.dropEffect set the drop effet| default is copy
     * @returns {nm$_EidApp.DropBox}
     */
    constructor(properties = {}) {
        this.properties = Object.assign({}, {
            dropBox_id: 'dropbox',
            dropBox_style_DragOver: 'dropbox--dragover',
            dropElementFormat: 'text',
            dropEffect: 'copy',
        }, properties);
        this.dataDropped = null;
        this.dropBox = document.getElementById(this.properties.dropBox_id);
        this.dropBox.addEventListener('drop', (e) => this.handleDrop(e), false);
        this.dropBox.addEventListener('dragover', (e) => this.handleDragOver(e), false);
        this.dropBox.addEventListener('dragleave', (e) => this.handleDragLeave(e), false);
    }

    /**
     * Return the data dropped
     * @returns {unresolved}
     */
    getDataDropped() {
        return this.dataDropped;
    }
   
    getDropBox(){
        return this.dropBox;
    }

    /**
     * save the data dropped in dataDropped attribute in 'dropElementFormat' the format from the property
     * then dropBox emits new event 'dataDropped' 
     * @param {type} event
     * @returns {undefined}
     */
    handleDrop(event) {
        event.stopPropagation();
        event.preventDefault();
        this.dataDropped = event.dataTransfer.getData(this.properties.dropElementFormat);
        let dataDroppedEvent = new CustomEvent(Dropbox.DATA_DROPPED_EVENT);
        this.dropBox.dispatchEvent(dataDroppedEvent);
        this.dropBox.classList.remove(this.properties.dropBox_style_DragOver);
    }

    /**
     * apply the visual effect dropEffect defined from properties and append
     * the css class dropBox_style_DragOver from properties
     * @param {type} event
     * @returns {undefined}
     */
    handleDragOver(event) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = this.properties.dropEffect;
        this.dropBox.classList.add(this.properties.dropBox_style_DragOver);
    }
    /**
     * when drag leave remove the style from property dropBox_style_dragOver
     * @param {type} event
     */
    handleDragLeave(event) {
        event.stopPropagation();
        event.preventDefault();
        this.dropBox.classList.remove(this.properties.dropBox_style_DragOver);
    }

}

/**
 * This class read the data from the picture of the eid-viewer an return a object
 * with the id informations
 */
class EidParser{
    constructor(xmlDocument){
        this.xmlDocument=xmlDocument;
    }
    parse(){
        const parser = new XMLParser(this.xmlDocument);
        let data = {
            "name": parser.getTagValue("name"),
            "forename": parser.getTagValue("firstname").split(" ")[0],
            "secondName": parser.getTagValue("firstname").split(" ")[1],
            "nationality": parser.getTagValue("nationality"),
            "placeOfBirth": parser.getTagValue("placeofbirth"),
            "photo": parser.getTagValue("photo"),
            "niss": this.format('xx.xx.xx-xxx.xx', parser.getAttributeOfTag("identity", "nationalnumber")),
            "birthday": this.format('xxxx/xx/xx', parser.getAttributeOfTag("identity", "dateofbirth")),
            "gender": parser.getAttributeOfTag("identity", "gender"),
            "title": parser.getAttributeOfTag("identity", "title"),
            "specialTitle": parser.getAttributeOfTag("identity", "specialstatus"),
            "streetAndNumber": parser.getTagValue("streetandnumber"),
            "postalCode": parser.getTagValue("zip"),
            "city": parser.getTagValue("municipality"),
        };
        return data;
    }
    /**
     * Format string from input to a specified mask , the mask should be like xx-xx/xx...
     * example :
     *      in : 93122788811 mask : xx.xx.xx-xxx.xx
     *      output : 93.12.27-888.11
     * @param {type} mask each character must be a x 
     * @param {type} number
     * @returns {nm$_EidApp.exports.format.output|String}
     */
    format(mask, number) {
        let str = '' + number;
        let output = '';
        //var s = ''+number, r = '';
        for (var iterator_mask = 0, iterator_str = 0; iterator_mask < mask.length && iterator_str < str.length; iterator_mask++) {
            if (mask.charAt(iterator_mask) === 'x') {
                output += str.charAt(iterator_str++);
            } else {
                output += mask.charAt(iterator_mask);
            }
        }
        return output;
    }
}

class EidReader {
    constructor(dropbox) {
        this.dropBox = dropbox;
        this.dropBox.getDropBox().addEventListener(Dropbox.DATA_DROPPED_EVENT, (e) => {
            e.preventDefault();
            let data = new EidParser(this.dropBox.getDataDropped()).parse();
            console.log(data);
        }, false);
    }
}

new EidReader(new Dropbox({ dropbox_id: 'dropbox_container' }))