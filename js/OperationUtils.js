class OperationUtils {

    constructor(element) {
        this._$text = Utils.getJQueryDOMElement(element);
        this._textUtils = new TextUtils(this._$text);
        this._index = undefined;
        this._commandMap = new Map();

        this._commandMap.set(67, () => this.copy());
        this._commandMap.set(88, () => this.cut());
        this._commandMap.set(86, () => this.paste());

        this._$fileLoader = new FileLoader((data) => {
            let image = document.createElement('img');
            image.setAttribute('src', data);
            image.setAttribute('class', 'image');
            this._textUtils.insertToSelected(image.outerHTML);
        });

        this._$text
            .on('copy paste cut', (event) => {
                this.doAction(event.type);
                event.preventDefault();
            })
            .focusout(() => {
                this._index = this._textUtils.getSelectIndex();
                this.focusIn = true;
            })
            .focusin(() => {
                this._index = this._textUtils.getSelectIndex();
                this.focusIn = true;
            });

        this._buffer = "";
    }

    doAction(action) {
        this._fillIndex();
        this[action]();
        this.focusIn = false;
    }

    _fillIndex() {
        if (!this.focusIn) {
            this._index = this._textUtils.getSelectIndex();
        }
    }

    paste() {
        this._textUtils.insertToSelected(this._buffer, undefined, this._index);
    }

    pasteAsText() {
        this._fillIndex();
        this._textUtils.insertToSelected(this._buffer.replace(/<\/?[^>]+(>|$)/g, ""), '', this._index);
        this.focusIn = false;
    }

    copy() {
        let data = this._textUtils.getSelectText(this._index);
        if (data !== '') {
            this._buffer = data;
        }
    }

    cut() {
        this._buffer = this._textUtils.getSelectText(this._index);
        this._textUtils.insertToSelected('', undefined, this._index);
    }

    openImage() {
        this._$fileLoader.loadFileUrl('image/*');
    }

    destroy() {
        //some
        this._$text.off();
    }
}