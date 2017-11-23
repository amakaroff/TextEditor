class FileUtils {

    constructor(element) {
        this._loader = new FileLoader((result) => {
            let data = JSON.parse(result);
            if (data.data) {
                this._$text.html(decodeURI(data.data));
            }
        });

        this._$text = Utils.getJQueryDOMElement(element);
    }

    print() {
        const first = 0;
        let text = this._$text.html();
        let $IFrame = $('<iframe id="frame" style="display: none">');
        $('body').append($IFrame);
        let newDocument = $IFrame[first].contentDocument || $IFrame[first].contentWindow.document;
        let newWindow = $IFrame[first].contentWindow || $IFrame[first];
        newDocument.getElementsByTagName('body')[first].innerHTML = text;
        newWindow.print();
        $('#frame').remove();
    }

    exportText() {
        let text = this._$text.html();
        let objectToJson = {};
        objectToJson.data = text;
        let link = document.createElement('a');
        let file = new File([JSON.stringify(objectToJson)], {'type': 'json'});
        link.href = window.URL.createObjectURL(file);
        link.download = 'text.json';
        link.click();
    }

    importText() {
        this._loader.loadFileData('.json');
    }
}