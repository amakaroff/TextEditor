class StyleUtils {

    constructor(element) {
        this._$text = Utils.getJQueryDOMElement(element);
        this._textUtils = new TextUtils(this._$text);
        this._tagMap = new Map();
        this._tagMap.set('bold', 'strong');
        this._tagMap.set('italic', 'em');
        this._tagMap.set('underline', 'u');
    }

    doBold() {
        this.doAction('bold');
    }

    doItalic() {
        this.doAction('italic');
    }

    doUnderline() {
        this.doAction('underline');
    }

    doAction(action) {
        let tag = this._tagMap.get(action);

        let openTag = '<' + tag + '>';
        let closeTag = '</' + tag + '>';

        let text = this._$text.html();

        let selectedText = this._textUtils.getSelectText();
        let index = this._textUtils.getSelectIndex();

        let leftPart = text.substring(0, index.start);
        let rightPart = text.substring(index.end, text.length);

        let firstLeftOpenTag = leftPart.lastIndexOf(openTag);
        let firstLeftCloseTag = leftPart.lastIndexOf(closeTag);

        let firstRightOpenTag = rightPart.indexOf(openTag);
        let firstRightCloseTag = rightPart.indexOf(closeTag);

        let openTagCount = Utils.getLengthOfArray(selectedText.match(new RegExp(openTag, 'g')));
        let closeTagCount = Utils.getLengthOfArray(selectedText.match(new RegExp(closeTag, 'g')));

        if (openTagCount !== 0 || closeTagCount !== 0) {
            selectedText = selectedText.replace(new RegExp(openTag, 'g'), '');
            selectedText = selectedText.replace(new RegExp(closeTag, 'g'), '');

            text = selectedText;
            if (firstLeftOpenTag <= firstLeftCloseTag) {
                text = openTag + text;
            }

            if (firstRightOpenTag === -1 && firstRightCloseTag === -1) {
                text = text + closeTag;
            } else  if (firstRightOpenTag <= firstRightCloseTag && firstRightOpenTag !== -1) {
                text = text + closeTag;
            }
        } else {
            text = selectedText;

            if ((firstLeftOpenTag > firstLeftCloseTag || firstLeftCloseTag === -1) && firstLeftOpenTag !== -1) {
                text = closeTag + text;
            } else {
                text = text + closeTag;
            }

            if ((firstRightOpenTag > firstRightCloseTag || firstRightOpenTag === -1) && firstRightCloseTag !== - 1) {
                text = text + openTag;
            } else {
                text = openTag + text;
            }
        }

        this._textUtils.insertToSelected(text, tag);
    }
}
