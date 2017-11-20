class OperationUtils {

    constructor(element) {
        this._$text = Utils.getJQueryDOMElement(element);
        this._textUtils = new TextUtils(this._$text);

        this._$fileLoader = new FileLoader((data) => {
            let image = document.createElement('img');
            image.setAttribute('src', data);
            image.setAttribute('class', 'image');
            this._textUtils.insertToSelected(image.outerHTML);
        });

        this._$text.on('copy', () => {
            this.copy();
        });

        this._$text.on('paste', () => {
            this.paste();
            return false;
        });

        this._$text.on('cut', () => {
            this.cut();
        });

        this._$text.on('focus', (event) => {
            console.log(event);
        });

        this._buffer = "";
    }

    paste() {
        this._textUtils.insertToSelected(this._buffer);
    }

    pasteAsText() {
        this._textUtils.insertToSelected(this._buffer.replace(/<\/?[^>]+(>|$)/g, ""));
    }

    copy() {
        this._buffer = this._textUtils.getSelectText();
    }

    cut() {
        this._buffer = this._textUtils.getSelectText();
        this._textUtils.insertToSelected('');
    }

    openImage() {
        this._$fileLoader.loadFileUrl('image/*');
    }

    destroy() {
        this._$text.off('copy');
        this._$text.off('paste');
        this._$text.off('cut');
    }
}