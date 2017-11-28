class ErrorHandler {

    constructor(modal) {
        this._$error = Utils.boxing(modal);
        this._$errorBody = this._$error.find('.modal-body');
    }

    send(text) {
        this._$errorBody.text(text);
        this._$error.modal('show');
    }
}