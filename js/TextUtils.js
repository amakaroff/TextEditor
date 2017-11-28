class TextUtils {

    constructor(element) {
        this._$text = Utils.boxing(element);

        this._$text.focusout(() => {
            this._savedIndex = this.getSelectIndex();
            this.focusOut = true;
        }).focusin(() => {
            this.focusOut = false;
        });

        this._tableClosed = ['</td>', '</td></tr>', '</td></tr></tbody></table>'];
    }

    getStartIndex(range, firstIndex) {
        let $storage = $('<div>');
        $storage.append(range.cloneContents().cloneNode(true));
        let text = $storage.html();
        let fullText = this._$text.html();

        if (text[text.length - 1] === '>') {
            while (text !== '' && text !== fullText.substring(firstIndex, firstIndex + text.length) && text[text.length - 1] === '>') {
                text = text.substring(0, text.lastIndexOf('<'));
            }
        }

        if (text[0] === '<') {
            if (text == '') {
                text = $storage.html();
            }
            while (text !== '' && text !== fullText.substring(firstIndex, firstIndex + text.length) && text[0] === '<') {
                text = text.substring(text.indexOf('>') + 1, text.length);
            }
        }

        for (let value of this._tableClosed) {
            if (text.endsWith(value)) {
                text = text.substring(0, text.length - value.length);
                break;
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
            preSelectionRange.selectNodeContents(Utils.unboxing(this._$text));
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

    getCursorPosition(text) {
        let partOfText;
        if (text === undefined) {
            let index = this.getSelectIndex();
            partOfText = this._$text.html().substring(0, index.end);
        } else {
            partOfText = text;
        }

        return Utils.removeAllTags(partOfText).length;
    }

    getSelectText(index) {
        let selectIndex = index ? index : this.getSelectIndex();
        return this._$text.html().substring(selectIndex.start, selectIndex.end);
    }

    insertToSelected(data, removedTag) {
        let selectIndex = this.getSelectIndex();
        let text = this._$text.html();
        let tempText = text.substring(0, selectIndex.start) + data;
        text = tempText + text.substring(selectIndex.end, text.length);
        let cursorPosition = this.getCursorPosition(tempText);
        if (removedTag !== undefined) {
            if (removedTag instanceof Array) {
                removedTag.forEach((tag) => {
                    text = Utils.removeEmptyTags(text, tag);
                });
            } else {
                text = Utils.removeEmptyTags(text, removedTag);
            }
        }
        this._$text.html(text);
        this.setCursorPosition(cursorPosition);
    }

    setCursorPosition(cursorPosition) {
        let element = Utils.unboxing(this._$text);
        let charIndex = 0;
        let range = document.createRange();
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