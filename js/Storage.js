class TextStorage {

    constructor(time, element) {
        this._textUtils = new TextUtils(element);
        this._changeSave = _.debounce(this._saveText, time);
        this._$text = Utils.getJQueryDOMElement(element);

        this._currentState = localStorage.getItem('current');
        if (this._currentState === null) {
            this._saveText();
        } else {
            this._currentState -= 0;
            this._loadText();
        }

        this._$text
            .on('DOMSubtreeModified', () => this._changeSave())
            .keydown((event) => {
            const z = 90;
            const y = 89;
            let thisKey = event.which;

            if (event.ctrlKey) {
                switch (thisKey) {
                    case z: {
                        this.undoOperation();
                        break;
                    }
                    case y: {
                        this.redoOperation();
                        break;
                    }
                }
            }
        });
    }

    _saveText() {
        if (!this._isOperation) {
            this._currentState = (this._currentState === null) ? 1 : this._currentState + 1;
            let savedObject = {};
            savedObject.text = this._$text.html();
            savedObject.cursor = this._textUtils.getSelectIndex().end;
            localStorage.setItem(this._currentState.toString(), JSON.stringify(savedObject));
            localStorage.setItem('current', this._currentState);
        }

        this._isOperation = false;
    }

    _loadText() {
        if (this._currentState >= 1 && localStorage.getItem(this._currentState.toString()) !== null) {
            let savedObject = JSON.parse(localStorage.getItem(this._currentState.toString()));
            this._$text.html(savedObject.text);
            this._textUtils.setCursorPosition(savedObject.cursor);
        }
    }

    undoOperation() {
        if (this._currentState !== 1) {
            this._currentState--;
            this._isOperation = true;
            localStorage.setItem('current', this._currentState.toString());
            this._loadText();
        }
    }

    redoOperation() {
        if (localStorage.getItem((this._currentState + 1).toString()) !== null) {
            this._currentState++;
            this._isOperation = true;
            localStorage.setItem('current', this._currentState.toString());
            this._loadText();
        }
    }

    destroy() {
        this._$text.off('DOMSubtreeModified');
    }
}