var httpService = (function () {
    'use strict';

    var request = new XMLHttpRequest();

    function createRequest(data, callback) {
        request.open(data.action, data.url, true);
        setHeaders(data.headers);
        request.send(data.postData !== undefined ? data.postData : null); // For POSTing data, if needed
        request.onreadystatechange = function () {
            if (request.readyState == XMLHttpRequest.DONE) {
                callback({
                    status: request.status,
                    statusText: request.statusText,
                    responseText: request.responseText
                });
            }
        };
    }

    function setHeaders(headers) {
        if (headers !== undefined) {
            for (var i = 0; i < headers.length; i++) {
                request.setRequestHeader(headers[i].header, headers[i].value);
            }
        }
    }

    return {
        get: function (data, callback) {
            data.action = 'GET';
            createRequest(data, callback);
        }

        /*
        Can add all HTTP methods as needed. An example for POST:

        post: function (data, callback) {
            data.action = 'POST';
            data.headers = [{
                header: 'Content-type',
                value: 'application/x-www-form-urlencoded'
            },
            {
                header: 'Content-length',
                value: data.postData.length
            }];
            createRequest(data, callback);
        }
        */
    };
})();