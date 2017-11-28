class FileHandler {

    constructor(element, errorHandler) {
        this._loader = new FileLoader((result) => {
            try {
                let data = JSON.parse(result);
                if (data.data) {
                    this._$text.html(decodeURI(data.data));
                }
            } catch (error) {
                this._errorHandler.send('File can\'t be loaded!');
            }
        }, errorHandler);

        this._errorHandler = errorHandler;
        this._$text = Utils.boxing(element);

        //I know that is bad solution, but this is the only thing which is working
        this._innerStyle = `<style>.table-cell{background-color: cornflowerblue; border: 1px solid black;
                            width: 50px; height: 30px; padding: 2px;}
                            .image {width: 250px; height: 250px; float: left; padding: 7px;}
                            .left {text-align: left;} .right {text-align: right;}
                            .center {text-align: center;} .justify {text-align: justify;}
                            .generate-table {display: inline-block;}
                            </style>`;
    }

    print() {
        let text = this._$text.html();
        const first = 0;

        let $IFrame = $('<iframe id="frame" style="display: none">');
        this._$text.append($IFrame);
        let newDocument = $IFrame[first].contentDocument || $IFrame[first].contentWindow.document;
        let newWindow = $IFrame[first].contentWindow || $IFrame[first];
        newDocument.getElementsByTagName('head')[first].innerHTML = this._innerStyle;
        newDocument.getElementsByTagName('body')[first].innerHTML = text;
        newWindow.print();
        $('#frame').remove();
    }

    exportText() {
        let text = this._$text.html();
        let objectToJson = {data: text};
        let $link = $('<a/>');
        $link.attr('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(objectToJson)));
        $link.attr('download', 'text.json');
        Utils.unboxing($link).click();
    }

    importText() {
        this._loader.loadFileData('.json');
    }
}