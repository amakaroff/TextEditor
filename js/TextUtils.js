class TextUtils {

    constructor(element) {
        this._$text = Utils.getJQueryDOMElement(element);
    }

    getStartIndex(range, firstIndex) {
        let div = document.createElement('div');
        div.appendChild(range.cloneContents().cloneNode(true));
        let text = div.innerHTML;
        let fullText = this._$text.html();

        if (text[text.length - 1] === '>') {
            while (text !== '' && text !== fullText.substring(firstIndex, firstIndex + text.length) && text[text.length - 1] === '>') {
                text = text.substring(0, text.lastIndexOf('<'));
            }
        }

        if (text[0] === '<') {
            text = div.innerHTML;
            while (text !== '' && text !== fullText.substring(firstIndex, firstIndex + text.length) && text[0] === '<') {
                text = text.substring(text.indexOf('>') + 1, text.length);
            }
        }

        return text.length;
    }

    getSelectIndex() {
        if (window.getSelection && document.createRange) {
            let range = window.getSelection().getRangeAt(0);
            let preSelectionRange = range.cloneRange();
            preSelectionRange.selectNodeContents(this._$text.get()[0]);
            preSelectionRange.setEnd(range.startContainer, range.startOffset);

            let start = this.getStartIndex(preSelectionRange, 0);

            return {
                start: start,
                end: start + this.getStartIndex(range, start)
            };
        } else {
            //Some shit happens
            let selectedTextRange = document.selection.createRange();
            let preSelectionTextRange = document.body.createTextRange();
            preSelectionTextRange.moveToElementText(this._$text.get()[0]);
            preSelectionTextRange.setEndPoint("EndToStart", selectedTextRange);
            let start = preSelectionTextRange.text.length;

            return {
                start: start,
                end: start + selectedTextRange.text.length
            };
        }
    }

    getSelectText() {
        let selectIndex = this.getSelectIndex();
        return this._$text.html().substring(selectIndex.start, selectIndex.end);
    }

    insertToSelected(data, removedTag) {
        if (data instanceof HTMLElement) {
            data = data.outerHTML;
        }

        let selectIndex = this.getSelectIndex();
        let text = this._$text.html();
        text = text.substring(0, selectIndex.start) + data + text.substring(selectIndex.end, text.length);
        if (removedTag !== undefined) {
            let openTag = '<' + removedTag + '>';
            let closeTag = '</' + removedTag + '>';
            text = text.replace(new RegExp(openTag + closeTag + '|' + closeTag + openTag, 'g'), '');
        }
        this._$text.html(text);
    }
}