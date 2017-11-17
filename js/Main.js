class Main {

    constructor() {
        this._$header = $('.header');
        this._$fileDown = $('.file-down');
        this._$editDown = $('.edit-down');
        this._$menu = $('.menu-button');
        this._$button = $('.header.button-header');
        this._$text = $('.text');

        this._fileUtils = new FileUtils(this._$text);
        this._storage = new Storage(1000, this._$text);
        this._operationUtils = new OperationUtils(this._$text);
        this._styleUtils = new StyleUtils(this._$text);

        this._fileCommandMap = new Map();
        this._fileCommandMap.set('Print', () => this._fileUtils.print());
        this._fileCommandMap.set('Import', () => this._fileUtils.importText());
        this._fileCommandMap.set('Export', () => this._fileUtils.exportText());

        this._editCommandMap = new Map();
        this._editCommandMap.set('Undo', () => this._storage.undoOperation());
        this._editCommandMap.set('Redo', () => this._storage.redoOperation());
        this._editCommandMap.set('Copy', () => this._operationUtils.copy());
        this._editCommandMap.set('Paste', () => this._operationUtils.paste());
        this._editCommandMap.set('Cut', () => this._operationUtils.cut());
        this._editCommandMap.set('Paste as text', () => this._operationUtils.pasteAsText());

        this._controlCommandMap = new Map();
        this._controlCommandMap.set('undo', () => this._storage.undoOperation());
        this._controlCommandMap.set('redo', () => this._storage.redoOperation());
        this._controlCommandMap.set('bold', () => this._styleUtils.doBold());
        this._controlCommandMap.set('italic', () => this._styleUtils.doItalic());
        this._controlCommandMap.set('underline', () => this._styleUtils.doUnderline());
        this._controlCommandMap.set('table', undefined);
        this._controlCommandMap.set('image', () => this._operationUtils.openImage());
    }


    main() {
        this._$fileDown.hide();
        this._$editDown.hide();

        this._$header.on('mousemove', (event) => {
            let buttonName = event.target.textContent.trim();
            if (buttonName === 'File') {
                this._$fileDown.show();
            } else if (buttonName === 'Edit') {
                this._$editDown.show();
            }
        });

        this._$menu.on('mouseleave', (event) => {
            let element = $(event.currentTarget).find('.button.menu-button');
            let buttonName = element.text().trim();

            if (buttonName === 'File') {
                this._$fileDown.hide();
            } else if (buttonName === 'Edit') {
                this._$editDown.hide();
            }
        });

        this._$fileDown.click((event) => {
            let buttonName = event.target.innerText.trim();
            let action = this._fileCommandMap.get(buttonName);
            action();
        });

        this._$editDown.click((event) => {
            let buttonName = $(event.target).find('.command').text().trim();
            if (buttonName === undefined) {
                buttonName = event.target.text.trim();
            }

            let action = this._editCommandMap.get(buttonName);
            action();
        });

        this._$button.click((event) => {
            let action = this._controlCommandMap.get(event.target.id);
            action();
        });
    }
}

(() => {
    let main = new Main();
    main.main();
})();