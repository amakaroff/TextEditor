class OperationUtils {

    constructor(element, textUtils, errorHandler) {
        this.$text = Utils.boxing(element);
        this._textUtils = textUtils;
        this._localBuffer = '';

        this._tagsArray = ['strong', 'em', 'u'];

        this._$fileLoader = new FileLoader((data) => {
            let image = document.createElement('img');
            image.setAttribute('src', data);
            image.setAttribute('class', 'image');
            this._textUtils.insertToSelected(image.outerHTML);
        }, errorHandler);

        this.$text.on('copy paste cut', (event) => {
            this.doAction(event.type, event.originalEvent.clipboardData);
            event.preventDefault();
        }).click((event) => {
            let element = $(event.target);
            if (!element.is('[contenteditable]')) {
                while (element.prop("tagName") !== 'DIV') {
                    element = element.parent();
                }
            }

            this._currentDiv = element;
        });
    }

    doAction(action, clipboardData) {
        this[action](clipboardData);
    }

    paste(clipboardData) {
        let buf = '';
        if (clipboardData === undefined || typeof(clipboardData) === "boolean") {
            buf = clipboardData ? Utils.removeAllTags(this._localBuffer) : this._localBuffer;
        } else if (clipboardData instanceof ClipboardData) {
            buf = clipboardData.getData('Text');
        }

        if (buf !== '') {
            let part = Utils.getTextParts(this.$text, this._textUtils.getSelectIndex());
            let selectedText = this._textUtils.getSelectText();

            this._tagsArray.forEach((value) => {
                let tag = Utils.createTags(value);
                if (Utils.isLeftOpenTagFirst(part.left, value) && Utils.isRightCloseTagFirst(part.right, value)) {
                    buf = tag.close + buf + tag.open;
                }

                buf = Utils.closeTag(buf, value);
                buf = Utils.closeShieldedTag(buf, selectedText, value);
            });

            this._textUtils.insertToSelected(buf, this._tagsArray);
        }
    }

    copy(clipboardData) {
        let data = this._textUtils.getSelectText();
        if (data !== '') {
            let part = Utils.getTextParts(this.$text, this._textUtils.getSelectIndex());
            this._tagsArray.forEach((value) => {
                data = Utils.shieldedTag(part, data, value);
            });

            clipboardData.setData('Text', data);
            this._localBuffer = data;
        }
    }

    cut(clipboardData) {
        let selectedText = this._textUtils.getSelectText();
        if (selectedText !== '') {
            let buf = selectedText;
            let removedText = '';
            let part = Utils.getTextParts(this.$text, this._textUtils.getSelectIndex());

            this._tagsArray.forEach((value) => {
                buf = Utils.shieldedTag(part, buf, value);
                removedText = Utils.closeShieldedTag(removedText, buf, value);
            });

            clipboardData.setData('Text', buf);
            this._localBuffer = buf;
            this._textUtils.insertToSelected(removedText, this._tagsArray);
        }
    }

    openImage() {
        this._$fileLoader.loadFileUrl('image/*');
    }

    doFormat(format) {
        if (this._currentDiv !== undefined && document.contains(Utils.unboxing(this._currentDiv))) {
            this._currentDiv.removeAttr('class');
            this._currentDiv.attr('class', format);
        } else {
            this.$text.children().each((index, value) => {
                value = $(value);
                value.removeAttr('class');
                value.attr('class', format);
            });
        }
    }

    createTable(column, row) {
        if (column !== 0 && row !== 0) {
            let table = '<table class="generate-table">';
            table += `<tr>${'<td class="table-cell"></td>'.repeat(column)}</tr>`.repeat(row);
            table += '</table>';

            this._textUtils.insertToSelected(table);
        }
    }
}