class Utils {

    static isFunction(action) {
        if (action instanceof Function) {
            return action;
        } else {
            throw Error(action.toString() + ' is not a function!');
        }
    }

    static getJQueryDOMElement(element) {
        if (element instanceof HTMLElement) {
            return $(element);
        }

        return element;
    }

    static getLengthOfArray(array) {
        if (array === null) {
            return 0;
        } else {
            return array.length;
        }
    }

    static getNodeByClass(element, upperClass, lowerClass) {
        if (element.hasClass(lowerClass)) {
            return element;
        } else {
            while (!element.hasClass(upperClass)) {
                element = element.parent();
            }

            return element.find('.' + lowerClass);
        }
    }

    static isLeftOpenTagFirst(textPart, tag) {
        let openTag = '<' + tag + '>';
        let closeTag = '</' + tag + '>';

        let firstLeftOpenTag = textPart.lastIndexOf(openTag);
        let firstLeftCloseTag = textPart.lastIndexOf(closeTag);

        return firstLeftOpenTag > firstLeftCloseTag || firstLeftCloseTag === -1 && firstLeftOpenTag !== -1;
    }

    static isRightCloseTagFirst(textPart, tag) {
        let openTag = '<' + tag + '>';
        let closeTag = '</' + tag + '>';

        let firstRightOpenTag = textPart.indexOf(openTag);
        let firstRightCloseTag = textPart.indexOf(closeTag);

        return firstRightCloseTag < firstRightOpenTag || firstRightOpenTag === -1 && firstRightCloseTag !== -1;
    }


    static getTextParts(elem, index) {
        let text = elem.html();
        let part = {};
        part.left = text.substring(0, index.start);
        part.right = text.substring(index.end, text.length);

        return part;
    }

    static createTags(tagName) {
        let tag = {};
        tag.open = '<' + tagName + '>';
        tag.close = '</' + tagName + '>';

        return tag;
    }
}
