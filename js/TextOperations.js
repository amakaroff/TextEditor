class OperationUtils {

    constructor(element, textUtils, errorHandler) {
        this._$text = Utils.getJQueryDOMElement(element);
        this._textUtils = textUtils;
        this._buffer = '';

        this._tagsArray = ['strong', 'em', 'u'];

        this._$fileLoader = new FileLoader((data) => {
            let image = document.createElement('img');
            image.setAttribute('src', data);
            image.setAttribute('class', 'image');
            this._textUtils.insertToSelected(image.outerHTML);
        }, errorHandler);

        this._$text.on('copy paste cut', (event) => {
            this.doAction(event.type);
            event.preventDefault();
        }).click((event) => {
            let element = $(event.target);
            if (!element.hasClass('text')) {
                while (element.prop("tagName") !== 'DIV') {
                    element = element.parent();
                }
            }

            this._currentDiv = element;
        });
    }
    doAction(action) {
        this[action]();
    }

    paste(isAsText) {
        if (this._buffer !== '') {
            let data = isAsText ? Utils.removeAllTags(this._buffer) : this._buffer;
            let part = Utils.getTextParts(this._$text, this._textUtils.getSelectIndex());
            let selectedText = this._textUtils.getSelectText();

            this._tagsArray.forEach((value) => {
                let tag = Utils.createTags(value);
                if (Utils.isLeftOpenTagFirst(part.left, value) && Utils.isRightCloseTagFirst(part.right, value)) {
                    data = tag.close + data + tag.open;
                }

                data = Utils.closeTag(data, value);
                data = Utils.closeShieldedTag(data, selectedText, value);
            });

            this._textUtils.insertToSelected(data, this._tagsArray);
        }
    }

    copy() {
        let data = this._textUtils.getSelectText();
        if (data !== '') {
            let part = Utils.getTextParts(this._$text, this._textUtils.getSelectIndex());
            this._tagsArray.forEach((value) => {
                data = Utils.shieldedTag(part, data, value);
            });

            this._buffer = data;
        }
    }

    cut() {
        this._buffer = this._textUtils.getSelectText();
        let removedText = '';
        let part = Utils.getTextParts(this._$text, this._textUtils.getSelectIndex());

        this._tagsArray.forEach((value) => {
            this._buffer = Utils.shieldedTag(part, this._buffer, value);
            removedText = Utils.closeShieldedTag(removedText, this._buffer, value);
        });

        console.log(removedText);

        this._textUtils.insertToSelected(removedText, this._tagsArray);
    }

    openImage() {
        this._$fileLoader.loadFileUrl('image/*');
    }

    doFormat(format) {
        if (this._currentDiv !== undefined && document.contains(this._currentDiv.get()[0])) {
            this._currentDiv.removeAttr('class');
            this._currentDiv.attr('class', format);
        } else {
            this._$text.children().each((index, value) =>  {
                value = $(value);
                value.removeAttr('class');
                value.attr('class', format);
            });
        }
    }

    createTable(column, row) {
        let table = '<table class="generate-table">';
        for (let i = 0; i < row; i++) {
            table += '<tr>';
            for (let j = 0; j < column; j++) {
                table += '<td class="table-cell"></td>';
            }
            table += '</tr>';
        }
        table += '</table>';

        this._textUtils.insertToSelected(table);
    }
}