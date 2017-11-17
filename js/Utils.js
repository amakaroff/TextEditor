class Utils {

    static getJQueryDOMElement(element) {
        if (element instanceof HTMLElement) {
            return $(element);
        }

        return element;
    }

    static getLengthOfArray(array) {
        if (array === null) {
            return 0;
        } else {
            return array.length;
        }
    }
}
