'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _callNative = require('./callNative');

var _callNative2 = _interopRequireDefault(_callNative);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NativeJsBridge = {
    callback: {
        _fnIndex: 0,
        _addEvents: function _addEvents(fn) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0';

            // type: 0单个按钮  1不销毁按钮 ,用于头不右上角
            var fnName = void 0,
                arrayFnName = [];
            this._fnIndex++;

            fnName = 'at_' + this._fnIndex;

            arrayFnName.push(fnName);
            this[fnName] = function (data) {
                fn(data);
                if (type !== '1') {
                    this._clear(arrayFnName);
                }
            };
            return fnName;
        },
        _addMultiEvents: function _addMultiEvents() {
            var _this = this;

            var events = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];


            var arrayFnName = [];
            this._fnIndex++;

            var _loop = function _loop(i) {
                var fnName = void 0;

                fnName = 'at_' + i + _this._fnIndex;

                arrayFnName.push(fnName);

                _this[fnName] = function (data) {
                    events[i](data);
                    _this._clear(arrayFnName);
                };
            };

            for (var i = 0; i < events.length; i++) {
                _loop(i);
            }

            return arrayFnName;
        },
        fn: function fn(res) {
            res = _callNative.base64.decode(res);

            res = JSON.parse(res);

            // 判断是否是自动执行的页面进入和页面挂起
            if (res.fnId === 'resume' || res.fnId === 'pause') {
                NativeJsBridge[res.fnId]();
                return;
            }

            this[res.fnId](res.data);
        },
        _clear: function _clear(fnName) {
            for (var i = 0; i < fnName.length; i++) {
                delete this[fnName[i]];
            }
        }
    },
    // loading
    loading: {
        show: function show() {
            (0, _callNative2.default)({
                info: {
                    type: '2001'
                }
            });
        },
        hide: function hide() {
            (0, _callNative2.default)({
                info: {
                    type: "2005"
                }
            });
        }
    },
    // toast
    toast: function toast(data) {
        (0, _callNative2.default)({
            info: {
                type: "2004"
            },
            data: {
                text: data.toString()
            }
        });
    },

    // alert
    alert: function alert(_ref) {
        var _ref$title = _ref.title,
            title = _ref$title === undefined ? '标题' : _ref$title,
            _ref$text = _ref.text,
            text = _ref$text === undefined ? '内容' : _ref$text,
            _ref$okText = _ref.okText,
            okText = _ref$okText === undefined ? '确定' : _ref$okText,
            _ref$ok = _ref.ok,
            ok = _ref$ok === undefined ? null : _ref$ok;


        var fnName = NativeJsBridge.callback._addEvents(ok);

        (0, _callNative2.default)({
            info: {
                type: '2003'
            },
            data: {
                title: title,
                text: text,
                okText: okText,
                ok: fnName
            }
        });
    },

    // confirm
    confirm: function confirm(_ref2) {
        var _ref2$title = _ref2.title,
            title = _ref2$title === undefined ? '标题' : _ref2$title,
            _ref2$text = _ref2.text,
            text = _ref2$text === undefined ? '内容' : _ref2$text,
            _ref2$okText = _ref2.okText,
            okText = _ref2$okText === undefined ? '确定' : _ref2$okText,
            _ref2$cancelText = _ref2.cancelText,
            cancelText = _ref2$cancelText === undefined ? '取消' : _ref2$cancelText,
            _ref2$ok = _ref2.ok,
            ok = _ref2$ok === undefined ? null : _ref2$ok,
            _ref2$cancel = _ref2.cancel,
            cancel = _ref2$cancel === undefined ? null : _ref2$cancel;


        var fnNames = NativeJsBridge.callback._addMultiEvents([ok, cancel]);

        (0, _callNative2.default)({
            info: {
                type: '2002'
            },
            data: {
                title: title,
                text: text,
                okText: okText,
                ok: fnNames[0],
                cancelText: cancelText,
                cancel: fnNames[1]
            }
        });
    },

    // 打开新窗口
    openWindow: function openWindow(_ref3) {
        var _ref3$title = _ref3.title,
            title = _ref3$title === undefined ? '标题' : _ref3$title,
            _ref3$url = _ref3.url,
            url = _ref3$url === undefined ? 'https://www.atzuche.com' : _ref3$url,
            _ref3$isShowStatusBar = _ref3.isShowStatusBar,
            isShowStatusBar = _ref3$isShowStatusBar === undefined ? true : _ref3$isShowStatusBar,
            _ref3$isShowNaviBar = _ref3.isShowNaviBar,
            isShowNaviBar = _ref3$isShowNaviBar === undefined ? true : _ref3$isShowNaviBar;


        (0, _callNative2.default)({
            info: {
                type: '1101'
            },
            data: {
                title: title,
                url: url,
                isShowStatusBar: isShowStatusBar, // 是否显示状态栏，安卓中无效
                isShowNaviBar: isShowNaviBar
            }
        });
    },

    //关闭窗口
    closeWindow: function closeWindow() {
        var number = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'move';

        switch (type) {
            case 'slideDown':
                (0, _callNative2.default)({
                    info: {
                        type: '1001'
                    },
                    data: {
                        pageId: '0021'
                    }
                });
                break;
            default:
                (0, _callNative2.default)({
                    info: {
                        type: '10006'
                    },
                    data: {
                        number: number
                    }
                });
                break;
        }
    },

    // 设置新窗口标题
    setTitle: function setTitle(data) {
        (0, _callNative2.default)({
            info: {
                type: '1102'
            },
            data: {
                title: data || '标题'
            }
        });
    },

    // 设置顶部状态栏和statusbar
    setStatusBar: function setStatusBar(_ref4) {
        var _ref4$isShowStatusBar = _ref4.isShowStatusBar,
            isShowStatusBar = _ref4$isShowStatusBar === undefined ? false : _ref4$isShowStatusBar,
            _ref4$isShowNaviBar = _ref4.isShowNaviBar,
            isShowNaviBar = _ref4$isShowNaviBar === undefined ? false : _ref4$isShowNaviBar;


        (0, _callNative2.default)({
            info: {
                type: '1103'
            },
            data: {
                isShowStatusBar: isShowStatusBar,
                isShowNaviBar: isShowNaviBar
            }
        });
    },

    // 打开登录窗口
    openLogin: function openLogin(_ref5) {
        var _ref5$success = _ref5.success,
            success = _ref5$success === undefined ? null : _ref5$success,
            _ref5$cancel = _ref5.cancel,
            cancel = _ref5$cancel === undefined ? null : _ref5$cancel;


        var fnNames = NativeJsBridge.callback._addMultiEvents([success, cancel]);

        (0, _callNative2.default)({
            info: {
                type: "1002"
            },
            data: {
                success: fnNames[0],
                cancel: fnNames[1]
            }
        });
    },

    // 获取经纬度
    getLocation: function getLocation(_ref6) {
        var _ref6$callback = _ref6.callback,
            callback = _ref6$callback === undefined ? null : _ref6$callback;


        var fnName = NativeJsBridge.callback._addEvents(callback);

        (0, _callNative2.default)({
            info: {
                type: '9005'
            },
            data: {
                callback: fnName
            }
        });
    },


    // 获取实时经纬度
    //  ios不支持
    getRealTimeLocation: function getRealTimeLocation(_ref7) {
        var _ref7$callback = _ref7.callback,
            callback = _ref7$callback === undefined ? null : _ref7$callback;


        var fnName = NativeJsBridge.callback._addEvents(callback);

        (0, _callNative2.default)({
            info: {
                type: '10007'
            },
            data: {
                callback: fnName
            }
        });
    },


    // 添加右上角按钮
    addRightBtn: function addRightBtn(_ref8) {
        var _ref8$btnText = _ref8.btnText,
            btnText = _ref8$btnText === undefined ? '' : _ref8$btnText,
            _ref8$callback = _ref8.callback,
            callback = _ref8$callback === undefined ? null : _ref8$callback;


        var fnName = NativeJsBridge.callback._addEvents(callback, '1');

        (0, _callNative2.default)({
            info: {
                type: '9004'
            },
            data: {
                btnText: btnText,
                callback: fnName
            }
        });
    },

    // 获取设备号
    getDeviceNum: function getDeviceNum(_ref9) {
        var _ref9$callback = _ref9.callback,
            callback = _ref9$callback === undefined ? null : _ref9$callback;


        var fnName = NativeJsBridge.callback._addEvents(callback);

        (0, _callNative2.default)({
            info: {
                type: '9003'
            },
            data: {
                callback: fnName
            }
        });
    },

    // 获取token
    getToken: function getToken(_ref10) {
        var _ref10$callback = _ref10.callback,
            callback = _ref10$callback === undefined ? null : _ref10$callback;


        var fnName = NativeJsBridge.callback._addEvents(callback);

        (0, _callNative2.default)({
            info: {
                type: '9002'
            },
            data: {
                callback: fnName
            }
        });
    },

    // 微信授权
    wxOAuth: function wxOAuth(_ref11) {
        var _ref11$success = _ref11.success,
            success = _ref11$success === undefined ? null : _ref11$success,
            _ref11$error = _ref11.error,
            error = _ref11$error === undefined ? null : _ref11$error;


        var fnNames = NativeJsBridge.callback._addMultiEvents([success, error]);

        // 0成功 1拒绝 2取消 
        (0, _callNative2.default)({
            info: {
                type: '10005'
            },
            data: {
                success: fnNames[0],
                error: fnNames[1]
            }
        });
    },

    // 分享操作
    share: function share(_ref12) {
        var _ref12$shareTitle = _ref12.shareTitle,
            shareTitle = _ref12$shareTitle === undefined ? '分享标题' : _ref12$shareTitle,
            _ref12$text = _ref12.text,
            text = _ref12$text === undefined ? '分享内容' : _ref12$text,
            _ref12$url = _ref12.url,
            url = _ref12$url === undefined ? 'https://www.atzuche.com' : _ref12$url,
            _ref12$sharePicUrl = _ref12.sharePicUrl,
            sharePicUrl = _ref12$sharePicUrl === undefined ? 'https://carphoto.atzuche.com/web/images/share.png' : _ref12$sharePicUrl,
            _ref12$ways = _ref12.ways,
            ways = _ref12$ways === undefined ? "sinaWeibo,tencentWeibo,weixinFriend,friendsCircle,shortMessage,email" : _ref12$ways,
            _ref12$sourceType = _ref12.sourceType,
            sourceType = _ref12$sourceType === undefined ? '' : _ref12$sourceType,
            _ref12$success = _ref12.success,
            success = _ref12$success === undefined ? null : _ref12$success,
            _ref12$cancel = _ref12.cancel,
            cancel = _ref12$cancel === undefined ? null : _ref12$cancel;


        var fnNames = NativeJsBridge.callback._addMultiEvents([success, cancel]);

        (0, _callNative2.default)({
            info: {
                type: '1001'
            },
            data: {
                pageId: '0005',
                shareTitle: shareTitle,
                text: text,
                url: url,
                sharePicUrl: sharePicUrl,
                ways: ways,
                success: fnNames[0],
                cancel: fnNames[1],
                sourceType: sourceType
            }
        });
    },

    // 进入车辆详情
    carDetail: function carDetail(_ref13) {
        var _ref13$carNo = _ref13.carNo,
            carNo = _ref13$carNo === undefined ? '' : _ref13$carNo,
            _ref13$sceneId = _ref13.sceneId,
            sceneId = _ref13$sceneId === undefined ? '' : _ref13$sceneId;


        (0, _callNative2.default)({
            info: {
                type: '1001'
            },
            data: {
                pageId: '0001',
                carNo: carNo,
                sceneId: sceneId
            }
        });
    },

    // 进入首页
    home: function home() {

        (0, _callNative2.default)({
            info: {
                type: '1001'
            },
            data: {
                pageId: '0007'
            }
        });
    },

    // popup对话框
    popup: function popup(_ref14) {
        var _ref14$title = _ref14.title,
            title = _ref14$title === undefined ? '标题' : _ref14$title,
            _ref14$url = _ref14.url,
            url = _ref14$url === undefined ? '' : _ref14$url;

        // url为相对地址
        (0, _callNative2.default)({
            info: {
                type: '1001'
            },
            data: {
                pageId: '0011',
                title: title,
                url: url
            }
        });
    },

    // 添加凹凸官方电话至通讯录
    phoneToAddressList: function phoneToAddressList() {
        (0, _callNative2.default)({
            info: {
                type: '1001'
            },
            data: {
                pageId: '0018'
            }
        });
    },

    // 支付
    pay: function pay(_ref15) {
        var _ref15$orderNo = _ref15.orderNo,
            orderNo = _ref15$orderNo === undefined ? '' : _ref15$orderNo,
            _ref15$finish = _ref15.finish,
            finish = _ref15$finish === undefined ? null : _ref15$finish,
            _ref15$cancel = _ref15.cancel,
            cancel = _ref15$cancel === undefined ? null : _ref15$cancel;

        if (!orderNo) {
            NativeJsBridge.alert({
                text: 'orderNo不能为空'
            });

            return;
        }

        var fnNames = NativeJsBridge.callback._addMultiEvents([finish, cancel]);

        (0, _callNative2.default)({
            info: {
                type: '10001'
            },
            data: {
                orderNo: orderNo,
                source: 'h5',
                finish: fnNames[0],
                cancel: fnNames[1]
            }
        });
    },

    // 身份认证
    identityAuth: function identityAuth(_ref16) {
        var _ref16$finish = _ref16.finish,
            finish = _ref16$finish === undefined ? null : _ref16$finish,
            _ref16$cancel = _ref16.cancel,
            cancel = _ref16$cancel === undefined ? null : _ref16$cancel;

        var fnNames = NativeJsBridge.callback._addMultiEvents([finish, cancel]);

        (0, _callNative2.default)({
            info: {
                type: '10002'
            },
            data: {
                source: 'h5',
                finish: fnNames[0],
                cancel: fnNames[1]
            }
        });
    },


    // 禁止ios系统回弹，安卓不支持
    setWebviewBounces: function setWebviewBounces(_ref17) {
        var _ref17$isBounces = _ref17.isBounces,
            isBounces = _ref17$isBounces === undefined ? 1 : _ref17$isBounces;

        if (_callNative.isAndroid) {
            return;
        }

        (0, _callNative2.default)({
            info: {
                type: '10008'
            },
            data: {
                isBounces: isBounces
            }
        });
    }
};

window.NativeJsBridge = NativeJsBridge;

exports.default = NativeJsBridge;