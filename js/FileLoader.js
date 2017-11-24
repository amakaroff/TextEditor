class FileLoader {

    constructor(callback) {
        this._reader = new FileReader();
        this._reader.onload = (event) => {
            if (callback instanceof Function) {
                callback(this._reader.result, event);
            }
        };
    }

    loadFileData(type) {
        this._loadFile(type, 'data');
    }

    loadFileUrl(type) {
        this._loadFile(type, 'url');
    }

    _loadFile(type, load) {
        let input = document.createElement('input');
        input.setAttribute('type', 'file');
        if (type !== undefined) {
            input.setAttribute('accept', type);
        }
        input.click();

        let $input = $(input);

        $input.on('change', (event) => {
            let files = event.target.files;
            if (files.length === 1) {
                let file = files[0];
                let fileName = file.name;
                if (!type.includes('.') || fileName.substring(fileName.lastIndexOf('.'), fileName.length) === type) {
                    if (load !== undefined) {
                        if (load === 'data') {
                            this._reader.readAsText(file);
                        } else if (load === 'url') {
                            this._reader.readAsDataURL(file);
                        }
                    }
                }
            }
        });
    }
}