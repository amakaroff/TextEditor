class TextUtils {

    constructor(element) {
        this.$text = Utils.boxing(element);

        this.$text.focusout((event) => {
            console.log(event);
            this.$text.focus();
        });
    }

    getStartIndex(range, firstIndex) {
        let $storage = $('<div>');
        $storage.append(range.cloneContents().cloneNode(true));
        let text = $storage.html();
        let fullText = this.$text.html();

        if (text[text.length - 1] === '>') {
            while (text !== '' && text !== fullText.substring(firstIndex, firstIndex + text.length) && text[text.length - 1] === '>') {
                text = text.substring(0, text.lastIndexOf('<'));
            }
        }

        if (text[0] === '<') {
            if (text === '') {
                text = $storage.html();
            }
            while (text !== '' && text !== fullText.substring(firstIndex, firstIndex + text.length) && text[0] === '<') {
                text = text.substring(text.indexOf('>') + 1, text.length);
            }
        }

        while (text.endsWith('</td>') || text.endsWith('</tr>') || text.endsWith('</table>') || text.endsWith('</tbody>')) {
            text = text.substring(0, text.lastIndexOf('<'));
        }

        return text.length;
    }

    getSelectIndex() {
        if (window.getSelection().rangeCount > 0) {
            let range = window.getSelection().getRangeAt(0);
            let preSelectionRange = range.cloneRange();
            preSelectionRange.selectNodeContents(Utils.unboxing(this.$text));
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
            partOfText = this.$text.html().substring(0, index.end);
        } else {
            partOfText = text;
        }

        return Utils.removeAllTags(partOfText).length;
    }

    getSelectText(index) {
        let selectIndex = index ? index : this.getSelectIndex();
        return this.$text.html().substring(selectIndex.start, selectIndex.end);
    }

    insertToSelected(data, removedTag) {
        let selectIndex = this.getSelectIndex();
        let text = this.$text.html();
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
        this.$text.html(text);
        this.setCursorPosition(cursorPosition);
    }

    setCursorPosition(cursorStart) {
        let element = Utils.unboxing(this.$text);
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
                if (!foundStart && cursorStart >= charIndex && cursorStart <= nextCharIndex) {
                    range.setStart(node, cursorStart - charIndex);
                    foundStart = true;
                }
                if (foundStart && cursorStart >= charIndex && cursorStart <= nextCharIndex) {
                    range.setEnd(node, cursorStart - charIndex);
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