class OperationUtils {

    constructor(element) {
        this._$text = Utils.getJQueryDOMElement(element);
        this._$fileLoader = new FileLoader((data, event) => {
            alert(11);
            console.log(event.target.result);
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

        this._buffer = "";
        this._textUtils = new TextUtils(this._$text);
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