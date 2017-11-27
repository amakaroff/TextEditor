class TextEditor {

    constructor() {
        this._$fileDown = $('#file-menu');
        this._$editDown = $('#edit-menu');
        this._$button = $('.header.button-header');
        this._$format = $('.format-down-menu');
        this._$error = $('.modal');
        this._$table = $('.table-down-menu');
        this._$column = $('#column');
        this._$row = $('#row');

        this._$text = $('.text');

        this._errorHandler = new ErrorHandler(this._$error);
        this._textUtils = new TextUtils(this._$text);
        this.fileUtils = new FileHandler(this._$text, this._errorHandler);
        this.storage = new TextStorage(this._$text, this._textUtils, this._errorHandler, 500);
        this.operationUtils = new OperationUtils(this._$text, this._textUtils, this._errorHandler);
        this.styleUtils = new StyleHandler(this._$text, this._textUtils);

        this._fileCommandMap = new Map();
        this._fileCommandMap.set('Print', () => this.fileUtils.print());
        this._fileCommandMap.set('Import', () => this.fileUtils.importText());
        this._fileCommandMap.set('Export', () => this.fileUtils.exportText());

        this._editCommandMap = new Map();
        this._editCommandMap.set('Undo', () => this.storage.undoOperation());
        this._editCommandMap.set('Redo', () => this.storage.redoOperation());
        this._editCommandMap.set('Copy', () => this.operationUtils.copy());
        this._editCommandMap.set('Paste', () => this.operationUtils.paste());
        this._editCommandMap.set('Cut', () => this.operationUtils.cut());
        this._editCommandMap.set('Paste as text', () => this.operationUtils.paste(true));

        this._controlCommandMap = new Map();
        this._controlCommandMap.set('undo', () => this.storage.undoOperation());
        this._controlCommandMap.set('redo', () => this.storage.redoOperation());
        this._controlCommandMap.set('bold', () => this.styleUtils.doBold());
        this._controlCommandMap.set('italic', () => this.styleUtils.doItalic());
        this._controlCommandMap.set('underline', () => this.styleUtils.doUnderline());
        this._controlCommandMap.set('image', () => this.operationUtils.openImage());
    }

    init() {
        this._$fileDown.click((event) => {
            if ($(event.target).hasClass('dropdown-menu')) {
                return;
            }
            let buttonName = event.target.innerText;
            Utils.isFunction(this._fileCommandMap.get(buttonName))();
        });

        this._$editDown.click((event) => {
            let $elem = Utils.getNodeByClass($(event.target), 'down-button', 'command');
            if ($elem === undefined) {
                return;
            }
            let buttonName = $elem.text();
            Utils.isFunction(this._editCommandMap.get(buttonName))();
        });

        this._$button.click((event) => {
            let buttonName = event.target.id;
            if (buttonName === '' || buttonName === undefined) {
                let tag = Utils.getNodeByClass($(event.target), 'functional-button-list', 'fa-lg');
                if (tag !== undefined) {
                    buttonName = tag.text();
                }
            }

            if (buttonName !== '' && buttonName !== undefined) {
                Utils.isFunction(this._controlCommandMap.get(buttonName))(this);
            }
        });

        this._$format.click((event) => {
            let element = Utils.getNodeByClass($(event.target), 'table-down-button', 'fa');
            if (element === undefined) {
                return;
            }
            let format = '';
            if (element.hasClass('fa-align-justify')) {
                format = 'justify';
            } else if (element.hasClass('fa-align-center')) {
                format = 'center';
            } else if (element.hasClass('fa-align-left')) {
                format = 'left';
            } else if (element.hasClass('fa-align-right')) {
                format = 'right';
            } else {
                throw Error('Format has not found!');
            }
            this.operationUtils.doFormat(format);
        });

        this._$table.click((event) => {
            if (event.target.innerText === 'Create') {
                this.operationUtils.createTable(this._$column.val(), this._$row.val());
                this._$column.val(0);
                this._$row.val(0);
                return;
            } else if (event.target.innerText === 'Close') {
                this._$column.val(0);
                this._$row.val(0);
                return;
            }

            event.stopPropagation();
        });
    }

    addButton(id, img, callback) {
        if ($(`#${id}`).length > 0) {
            throw Error('Current id exists!');
        }
        let newButton = $('<img/>');
        newButton.addClass('new-button');
        newButton.attr('id', id);
        newButton.attr('src', img);
        this._controlCommandMap.set(id, Utils.isFunction(callback));
        this._$button.append(newButton);
    }
}

(() => {
    let textEditor = new TextEditor();
    textEditor.init();
    textEditor.addButton('gomer', 'https://www.sunhome.ru/i/wallpapers/31/gomer-simpson-kartinka.orig.jpg', (editor) => {
        alert('Beer... arrggghhhh');
    });

    textEditor.addButton('lion', 'https://kartinki.detki.today/wp-content/uploads/2017/07/kartinka-dlya-detey-lev-1150x863.jpg', (editor) => {
        alert('Rrrrrrr!');
    });
})();