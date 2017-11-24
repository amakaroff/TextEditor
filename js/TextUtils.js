class TextUtils {

    constructor(element) {
        this._$text = Utils.getJQueryDOMElement(element);

        this._$text.focusout(() => {
            this._savedIndex = this.getSelectIndex();
            this.focusOut = true;
        })
            .focusin(() => {
                this.focusOut = false;
            });
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
        if (this.focusOut) {
            return this._savedIndex;
        }

        if (window.getSelection().rangeCount > 0) {
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
            return {
                start: 0,
                end: 0
            };
        }
    }

    getSelectText(selected) {
        let selectIndex;
        if (selected === undefined) {
            selectIndex = this.getSelectIndex();
        } else {
            selectIndex = selected;
        }

        return this._$text.html().substring(selectIndex.start, selectIndex.end);
    }

    insertToSelected(data, removedTag, selected) {
        if (data instanceof HTMLElement) {
            data = data.outerHTML;
        }

        let selectIndex;
        if (selected === undefined) {
            selectIndex = this.getSelectIndex();
        } else {
            selectIndex = selected;
        }
        let text = this._$text.html();
        let tempText = text.substring(0, selectIndex.start) + data;
        text = tempText + text.substring(selectIndex.end, text.length);
        let cursorPosition = tempText.replace(/<\/?[^>]+(>|$)/g, "").length;
        if (removedTag !== undefined) {
            let openTag = '<' + removedTag + '>';
            let closeTag = '</' + removedTag + '>';
            text = text.replace(new RegExp(openTag + closeTag + '|' + closeTag + openTag, 'g'), '');
        }
        this._$text.html(text);
        this.setCursorPosition(cursorPosition);
    }

    setCursorPosition(cursorPosition) {
        let element = this._$text.get()[0];
        let charIndex = 0, range = document.createRange();
        range.setStart(element, 0);
        range.collapse(true);
        let nodeStack = [element];
        let node;
        let foundStart = false;
        let stop = false;

        while (!stop && (node = nodeStack.pop())) {
            if (node.nodeType === 3) {
                let nextCharIndex = charIndex + node.length;
                if (!foundStart && cursorPosition >= charIndex && cursorPosition <= nextCharIndex) {
                    range.setStart(node, cursorPosition - charIndex);
                    foundStart = true;
                }
                if (foundStart && cursorPosition >= charIndex && cursorPosition <= nextCharIndex) {
                    range.setEnd(node, cursorPosition - charIndex);
                    stop = true;
                }
                charIndex = nextCharIndex;
            } else {
                let i = node.childNodes.length;
                while (i--) {
                    nodeStack.push(node.childNodes[i]);
                }
            }
        }

        let selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
}