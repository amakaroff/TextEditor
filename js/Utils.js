class Utils {

    static isFunction(action) {
        if (action instanceof Function) {
            return action;
        } else {
            throw Error(action + ' is not a function!');
        }
    }

    static getJQueryDOMElement(element) {
        if (element instanceof HTMLElement) {
            return $(element);
        }

        return element;
    }

    static getLengthOfArray(array) {
        return array ? array.length : 0;

    }

    static getNodeByClass(element, upperClass, lowerClass) {
        if (element.hasClass(lowerClass)) {
            return element;
        } else {
            while (!element.hasClass(upperClass)) {
                element = element.parent();
                if (element.prop("tagName") === undefined) {
                    return undefined;
                }
            }

            return element.find('.' + lowerClass);
        }
    }

    static isLeftOpenTagFirst(textPart, tagName) {
        let tag = Utils.createTags(tagName);

        let firstLeftOpenTag = textPart.lastIndexOf(tag.open);
        let firstLeftCloseTag = textPart.lastIndexOf(tag.close);

        return firstLeftOpenTag > firstLeftCloseTag || firstLeftCloseTag === -1 && firstLeftOpenTag !== -1;
    }

    static isRightCloseTagFirst(textPart, tagName) {
        let tag = Utils.createTags(tagName);

        let firstRightOpenTag = textPart.indexOf(tag.open);
        let firstRightCloseTag = textPart.indexOf(tag.close);

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
        tag.open = `<${tagName}>`;
        tag.close = `</${tagName}>`;

        return tag;
    }

    static removeAllTags(text) {
        return text.replace(/<\/?[^>]+(>|$)/g, "");
    }

    static removeEmptyTags(text, tagName) {
        let tag = Utils.createTags(tagName);
        return text.replace(new RegExp(tag.open + tag.close + '|' + tag.close + tag.open, 'g'), '');
        //TODO: fix
        /*let replaced = new RegExp(tag.open + "<\/?[^>]+(>|$)" + tag.close, 'g');
        let array = text.match(replaced);
        let index = 0;
        while (index < array.length) {
            let deletedIndex = text.indexOf(replaced);

        }*/
    }

    static getOpenTagCount(text, tagName) {
        let tag = Utils.createTags(tagName);
        return Utils.getLengthOfArray(text.match(new RegExp(tag.open, 'g')));
    }

    static getCloseTagCount(text, tagName) {
        let tag = Utils.createTags(tagName);
        return Utils.getLengthOfArray(text.match(new RegExp(tag.close, 'g')));
    }

    static closeTag(text, tagName) {
        let tag = Utils.createTags(tagName);
        let openTagCount = Utils.getOpenTagCount(text, tagName);
        let closeTagCount = Utils.getCloseTagCount(text, tagName);

        if (openTagCount > closeTagCount) {
            text = text + tag.close;
        } else if (closeTagCount > openTagCount) {
            text = tag.open + text;
        }

        return text;
    }

    static shieldedTag(part, text, tagName) {
        let tag = Utils.createTags(tagName);
        if (Utils.isLeftOpenTagFirst(part.left, tagName) && Utils.isRightCloseTagFirst(part.right, tagName)) {
            text = tag.open + text + tag.close;
        }

        return text;
    }

    static closeShieldedTag(text, selectedText, tagName) {
        let tag = Utils.createTags(tagName);
        let openTagCount = Utils.getOpenTagCount(selectedText, tagName);
        let closeTagCount = Utils.getCloseTagCount(selectedText, tagName);

        if (openTagCount > closeTagCount) {
            text = text + tag.open;
        } else if (closeTagCount > openTagCount) {
            text = tag.close + text;
        }

        return text;
    }
}
