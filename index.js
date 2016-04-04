module.exports = (function (global) {
    "use strict";

    var _edgeRgx = /(edge)\/(.*)$/i,
        _ieRgx = /(Trident)\/[\d|\.]+;[\s|\w|\d|\.|;]*rv:([\d|\.]+)\)/i,
        _ieCompatRgx = /(MSIE)\s([\d|\.]+);/i,
        _safariRgx = /version\/([\d|\.]+)\s(?:Mobile\/([\d|\w]+))?\s?(Safari)\/\d/i,
        _chromeRgx = /(chrome)\/([\d|\.]+)(?:\s(mobile))?/i,
        _chromeIosRgx = /(CriOS)\/([\d|\.]+)(?:\s(mobile))?/i,
        _ffRgx = /(?:(android))?;.*(firefox)\/([\d|\.]+)/i,

        _retrievedDetails = null;

    function _testUserAgent(rgx, browser, indxs, ua) {
        var res = rgx.exec(ua);

        indxs = indxs || [1, 2, 3]; //[agent, version, mobile]

        return (res ?
            Promise.resolve({
                name: browser,
                agent: res[indxs[0]],
                version: res[indxs[1]],
                mobile: !!res[indxs[2]]
            }) :
            Promise.reject(ua));
    }

    var _testSafari = _testUserAgent.bind(null, _safariRgx, "Safari", [3, 1, 2]),
        _testEdge = _testUserAgent.bind(null, _edgeRgx, "Edge", null),
        _testChrome = _testUserAgent.bind(null, _chromeRgx, "Chrome", null),
        _testChromeIos = _testUserAgent.bind(null, _chromeIosRgx, "Chrome for iOS", null),
        _testFirefox = _testUserAgent.bind(null, _ffRgx, "Firefox", [2, 3, 1]);

    function _testIe(ua) {
        return _testUserAgent(_ieRgx, "Internet Explorer", null, ua)
            .catch(_testUserAgent.bind(null, _ieCompatRgx, "Internet Explorer", null));
    }

    function getUaDetails() {

        return new Promise(function (resolve, reject) {
            if (_retrievedDetails) {
                resolve(_retrievedDetails);
            }
            else {
                reject(global.navigator.userAgent);
            }
        })
            .catch(_testEdge)
            .catch(_testIe)
            .catch(_testChrome)
            .catch(_testChromeIos)
            .catch(_testFirefox)
            .catch(_testSafari)
            .then(function (details) {
                _retrievedDetails = details;
                return details;
            })
    }

    return {
        getUADetails: getUaDetails
    };
})(self);
