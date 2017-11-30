class TextStorage {

    constructor(element, textUtils, errorHandler, time = 1000, size = 20) {
        this._textUtils = textUtils;
        this._errorHandler = errorHandler;
        this._changeSave = _.debounce(this._saveText, time);
        this.$text = Utils.boxing(element);

        let sizeStorage = localStorage.getItem('size');
        let minIndex = localStorage.getItem('min');
        let current = localStorage.getItem('current');

        if (sizeStorage === null || minIndex === null || current === null) {
            this._refreshStorage(size);
        } else {
            this._size = sizeStorage - 0;
            this._minIndex = minIndex - 0;
            this._currentState = current - 0;
            this._loadText();
        }

        this.$text
            .on('DOMSubtreeModified', () => this._changeSave())
            .keydown((event) => {
                const z = 90;
                const y = 89;
                let thisKey = event.which;

                if (event.ctrlKey) {
                    switch (thisKey) {
                        case z: {
                            this.undoOperation();
                            event.preventDefault();
                            break;
                        }
                        case y: {
                            this.redoOperation();
                            event.preventDefault();
                            break;
                        }
                    }
                }
            });
    }

    _saveText() {
        if (!this._isOperation) {
            this._currentState++;
            if (this._currentState >= this._size + this._minIndex) {
                localStorage.removeItem(this._minIndex.toString());
                this._minIndex++;
            }
            let savedObject = {};
            savedObject.text = this.$text.html();
            savedObject.cursor = this._textUtils.getCursorPosition();
            this._setItem(this._currentState.toString(), JSON.stringify(savedObject));
            this._setItem('current', this._currentState);
            this._setItem('size', this._size);
            this._setItem('min', this._minIndex);
        }

        this._isOperation = false;
    }

    _loadText() {
        let savedObject = JSON.parse(this._getItem(this._currentState.toString()));
        this.$text.html(savedObject.text);
        this._textUtils.setCursorPosition(savedObject.cursor);
    }

    undoOperation() {
        if (this._currentState > this._minIndex) {
            this._currentState--;
            this._isOperation = true;
            this._setItem('current', this._currentState.toString());
            this._loadText();
        }
    }

    redoOperation() {
        if (this._size + this._minIndex > this._currentState + 1 && this._contains(this._currentState + 1)) {
            this._currentState++;
            this._isOperation = true;
            this._setItem('current', this._currentState.toString());
            this._loadText();
        }
    }

    _contains(key) {
        let item = localStorage.getItem(key.toString());
        return item !== null;
    }

    _refreshStorage(size) {
        localStorage.clear();
        if (size !== undefined) {
            this._size = size;
        }
        this._minIndex = 1;
        this._currentState = 0;
        this._saveText();
    }

    _getItem(key) {
        let data = localStorage.getItem(key);
        if (data === null) {
            this._errorHandler.send('Local Storage info is breaking! Refresh data.');
            this._refreshStorage();
            throw Error('Local Storage info is breaking! Refresh data.');
        }

        return data;
    }

    _setItem(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            this._errorHandler.send('Local Storage is overloaded! Please reduce size.');
            this._refreshStorage();
        }
    }
}