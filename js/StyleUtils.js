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
        let tagName = this._tagMap.get(action);
        let tag = Utils.createTags(tagName);

        let text = this._$text.html();

        let selectedText = this._textUtils.getSelectText();
        let index = this._textUtils.getSelectIndex();

        let leftPart = text.substring(0, index.start);
        let rightPart = text.substring(index.end, text.length);

        let firstLeftOpenTag = leftPart.lastIndexOf(tag.open);
        let firstLeftCloseTag = leftPart.lastIndexOf(tag.close);

        let firstRightOpenTag = rightPart.indexOf(tag.open);
        let firstRightCloseTag = rightPart.indexOf(tag.close);

        let openTagCount = Utils.getOpenTagCount(selectedText, tagName);
        let closeTagCount = Utils.getCloseTagCount(selectedText, tagName);

        if (openTagCount !== 0 || closeTagCount !== 0) {
            selectedText = selectedText.replace(new RegExp(tag.open, 'g'), '');
            selectedText = selectedText.replace(new RegExp(tag.close, 'g'), '');

            text = selectedText;
            if (firstLeftOpenTag <= firstLeftCloseTag) {
                text = tag.open + text;
            }

            if (firstRightOpenTag === -1 && firstRightCloseTag === -1) {
                text = text + tag.close;
            } else  if (firstRightOpenTag <= firstRightCloseTag && firstRightOpenTag !== -1) {
                text = text + tag.close;
            }
        } else {
            text = selectedText;

            if ((firstLeftOpenTag > firstLeftCloseTag || firstLeftCloseTag === -1) && firstLeftOpenTag !== -1) {
                text = tag.close + text;
            } else {
                text = text + tag.close;
            }

            if ((firstRightOpenTag > firstRightCloseTag || firstRightOpenTag === -1) && firstRightCloseTag !== - 1) {
                text = text + tag.open;
            } else {
                text = tag.open + text;
            }
        }

        this._textUtils.insertToSelected(text, tagName);
    }
}
