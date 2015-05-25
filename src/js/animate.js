var animate = (function () {
    'use strict';

    var hide = function (elem) {
        elem.style.display = 'none';
    };

    var show = function (elem) {
        elem.style.display = 'block';
    };

    var toggle = function (elem) {
        if (!elem.style.display || elem.style.display === 'block') {
            hide(elem);
        } else {
            show(elem);
        }
    };

    return {
        hide: hide,
        show: show,
        toggle: toggle

        // Add more animate functionality within this module
    };
})();