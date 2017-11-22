class Storage {

    constructor(time, element) {
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
            .keydown((e) => {
            const z = 90;
            const y = 89;
            let thisKey = e.which;

            if (e.ctrlKey) {
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
            localStorage.setItem(this._currentState.toString(), this._$text.html());
            localStorage.setItem('current', this._currentState);
        }

        this._isOperation = false;
    }

    _loadText() {
        if (this._currentState >= 1 && localStorage.getItem(this._currentState.toString()) !== null) {
            this._$text.html(localStorage.getItem(this._currentState.toString()));
        }
    }

    undoOperation() {
        this._isOperation = true;

        if (this._currentState !== 1) {
            this._currentState--;
            localStorage.setItem('current', this._currentState.toString());
            this._loadText();
        }
    }

    redoOperation() {
        this._isOperation = true;

        if (localStorage.getItem((this._currentState + 1).toString()) !== null) {
            this._currentState++;
            localStorage.setItem('current', this._currentState.toString());
            this._loadText();
        }
    }

    destroy() {
        this._$text.off('DOMSubtreeModified');
    }
}