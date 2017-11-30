class FileHandler {

    constructor(element, errorHandler) {
        this._loader = new FileLoader((result) => {
            try {
                let data = JSON.parse(result);
                if (data.data) {
                    this.$text.html(decodeURI(data.data));
                }
            } catch (error) {
                this._errorHandler.send('File can\'t be loaded!');
            }
        }, errorHandler);

        this._errorHandler = errorHandler;
        this.$text = Utils.boxing(element);

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
        let text = this.$text.html();
        let $IFrame = $('<iframe style="display: none">');
        let iFrame = Utils.unboxing($IFrame);
        this.$text.append($IFrame);
        let newDocument = iFrame.contentDocument || iFrame.contentWindow.document;
        let newWindow = iFrame.contentWindow || iFrame;
        $('head', newDocument).html(this._innerStyle);
        $('body', newDocument).html(text);
        newWindow.print();
        $IFrame.remove();
    }

    exportText() {
        let text = this.$text.html();
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