class OperationUtils {

    constructor(element) {
        this._$text = Utils.getJQueryDOMElement(element);
        this._textUtils = new TextUtils(this._$text);
        this._index = undefined;
        this._commandMap = new Map();

        this._tagsArray = ['strong', 'em', 'u'];

        this._commandMap.set(67, () => this.copy());
        this._commandMap.set(88, () => this.cut());
        this._commandMap.set(86, () => this.paste());

        this._$fileLoader = new FileLoader((data) => {
            let image = document.createElement('img');
            image.setAttribute('src', data);
            image.setAttribute('class', 'image');
            this._textUtils.insertToSelected(image.outerHTML, '', this._index);
        });

        this._$text.on('copy paste cut', (event) => {
            this.doAction(event.type);
            event.preventDefault();
        });

        this._buffer = "";
    }

    doAction(action) {
        this[action]();
    }

    paste() {
        if (this._buffer !== '') {

            let data = this._buffer;
            let part = Utils.getTextParts(this._$text, this._textUtils.getSelectIndex());

            this._tagsArray.forEach((value) => {
                let tag = Utils.createTags(value);
                if (Utils.isLeftOpenTagFirst(part.left, value) && Utils.isRightCloseTagFirst(part.right, value)) {
                    data = tag.open + data + tag.close;
                }
            });

            this._textUtils.insertToSelected(data, undefined);
        }
    }

    pasteAsText() {
        this._textUtils.insertToSelected(Utils.removeAllTags(this._buffer), '');
    }

    copy() {
        let data = this._textUtils.getSelectText();
        let part = Utils.getTextParts(this._$text, this._textUtils.getSelectIndex());

        this._tagsArray.forEach((value) => {
            let tag = Utils.createTags(value);
            if (Utils.isLeftOpenTagFirst(part.left, value) && Utils.isRightCloseTagFirst(part.right, value)) {
                data = tag.open + data + tag.close;
            }
        });

        if (data !== '') {
            this._buffer = data;
        }
    }

    cut() {
        this._buffer = this._textUtils.getSelectText();
        this._textUtils.insertToSelected('', undefined);
    }

    openImage() {
        this._$fileLoader.loadFileUrl('image/*');
    }
}