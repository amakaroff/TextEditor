class StyleHandler {

    constructor(element, textUtils) {
        this._$text = Utils.boxing(element);
        this._textUtils = textUtils;
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
        let part = Utils.getTextParts(this._$text, this._textUtils.getSelectIndex());

        let openTagCount = Utils.getOpenTagCount(selectedText, tagName);
        let closeTagCount = Utils.getCloseTagCount(selectedText, tagName);

        if (openTagCount !== 0 || closeTagCount !== 0) {
            selectedText = selectedText.replace(new RegExp(`${tag.open}|${tag.close}`, 'g'), '');

            text = selectedText;
            if (!Utils.isLeftOpenTagFirst(part.left, tagName)) {
                text = tag.open + text;
            }

            if (!Utils.isRightCloseTagFirst(part.right, tagName)) {
                text = text + tag.close;
            }
        } else {
            text = selectedText;

            if (Utils.isLeftOpenTagFirst(part.left, tagName)) {
                text = tag.close + text;
            } else {
                text = text + tag.close;
            }

            if (Utils.isRightCloseTagFirst(part.right, tagName)) {
                text = text + tag.open;
            } else {
                text = tag.open + text;
            }
        }

        this._textUtils.insertToSelected(text, tagName);
    }
}
