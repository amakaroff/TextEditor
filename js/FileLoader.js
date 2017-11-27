class FileLoader {

    constructor(callback, errorHandler) {
        this._reader = new FileReader();
        this._reader.onload = (event) => {
            if (callback instanceof Function) {
                callback(this._reader.result, event);
            }
        };
        this._errorHandler = errorHandler;
    }

    loadFileData(type) {
        this._loadFile(type, 'data');
    }

    loadFileUrl(type) {
        this._loadFile(type, 'url');
    }

    _loadFile(type = '*', load) {
        let $input = $('<input/>');
        $input.attr('type', 'file');
        $input.attr('accept', type);
        $input.get()[0].click();
        $input.on('change', (event) => {
            let files = event.target.files;
            if (files.length === 1) {
                let file = files[0];
                let fileName = file.name;
                if (type.endsWith('*') || fileName.substring(fileName.lastIndexOf('.'), fileName.length) === type) {
                    if (load === 'data') {
                        this._reader.readAsText(file);
                    } else if (load === 'url') {
                        this._reader.readAsDataURL(file);
                    }
                } else {
                    let fileType = type.substring(type.lastIndexOf('.') + 1, type.length);
                    this._errorHandler.send(`File type should be ${fileType}!`);
                }
            }
        });
    }
}