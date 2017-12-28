'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isiOS = exports.isAndroid = exports.base64 = undefined;
exports.default = callNative;

var _base = require('./base64');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var base64 = new _base2.default();

var u = navigator.userAgent;

var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端

var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

function callNative(data) {
    var param = base64.encode(JSON.stringify(data));

    // let prevIframe = NativeJsBridge.iframe

    var iframe = document.createElement("iframe");

    iframe.style.display = 'none';

    document.body.appendChild(iframe);

    if (isAndroid) {

        iframe.src = "atzuche.dynamic:param=" + param;
    } else if (isiOS) {

        iframe.src = "https://atzuche.dynamic/?param=" + param;
    }

    // NativeJsBridge.iframe = iframe

    setTimeout(function () {

        iframe.parentNode.removeChild(iframe);
    }, 30);

    return false;
}

exports.base64 = base64;
exports.isAndroid = isAndroid;
exports.isiOS = isiOS;