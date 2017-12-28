import callNative, {
    base64,
    isAndroid, 
    isiOS 
} from './callNative'

let NativeJsBridge = {
    callback: {
        _fnIndex: 0,
        _addEvents: function(fn, type = '0') {
            // type: 0单个按钮  1不销毁按钮 ,用于头不右上角
            let fnName, arrayFnName = []
            this._fnIndex++

                fnName = 'at_' + this._fnIndex

            arrayFnName.push(fnName)
            this[fnName] = function(data) {
                fn(data)
                if (type !== '1') {
                    this._clear(arrayFnName)
                }
            }
            return fnName;
        },
        _addMultiEvents: function(events = []) {

            let arrayFnName = []
            this._fnIndex++

            for (let i = 0; i < events.length; i++) {
                let fnName

                fnName = 'at_' + i + this._fnIndex

                arrayFnName.push(fnName)

                this[fnName] = (data) => {
                    events[i](data)
                    this._clear(arrayFnName)
                }
            }

            return arrayFnName
        },
        fn: function(res) {
            res = base64.decode(res)

            res = JSON.parse(res)
            
            // 判断是否是自动执行的页面进入和页面挂起
            if(res.fnId === 'resume' || res.fnId === 'pause'){
                NativeJsBridge[res.fnId]()
                return
            }

            this[res.fnId](res.data)
        },
        _clear: function(fnName) {
            for (let i = 0; i < fnName.length; i++) {
                delete this[fnName[i]]
            }
        }
    },
    // loading
    loading: {
        show() {
            callNative({
                info: {
                    type: '2001'
                }
            })
        },
        hide() {
            callNative({
                info: {
                    type: "2005"
                }
            })
        }
    },
    // toast
    toast(data) {
        callNative({
            info: {
                type: "2004"
            },
            data: {
                text: data.toString()
            }
        })
    },
    // alert
    alert({
        title = '标题',
        text = '内容',
        okText = '确定',
        ok = null
    }) {

        const fnName = NativeJsBridge.callback._addEvents(ok)

        callNative({
            info: {
                type: '2003'
            },
            data: {
                title: title,
                text: text,
                okText: okText,
                ok: fnName
            }
        })

    },
    // confirm
    confirm({
        title = '标题',
        text = '内容',
        okText = '确定',
        cancelText = '取消',
        ok = null,
        cancel = null
    }) {

        const fnNames = NativeJsBridge.callback._addMultiEvents([ok, cancel])

        callNative({
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
        })
    },
    // 打开新窗口
    openWindow({
        title = '标题',
        url = 'https://www.atzuche.com',
        isShowStatusBar = true,
        isShowNaviBar = true
    }) {

        callNative({
            info: {
                type: '1101'
            },
            data: {
                title: title,
                url: url,
                isShowStatusBar: isShowStatusBar, // 是否显示状态栏，安卓中无效
                isShowNaviBar: isShowNaviBar
            }
        })
    },
    //关闭窗口
    closeWindow(number = 1, type = 'move') {
        switch(type){
            case 'slideDown':
                callNative({
                    info: {
                        type: '1001'
                    },
                    data: {
                        pageId: '0021'
                    }
                })
            break
            default:
                callNative({
                    info: {
                        type: '10006'
                    },
                    data: {
                        number: number
                    }
                })
            break;
        }
    },
    // 设置新窗口标题
    setTitle(data) {
        callNative({
            info: {
                type: '1102'
            },
            data: {
                title: data || '标题'
            }
        })
    },
    // 设置顶部状态栏和statusbar
    setStatusBar({
        isShowStatusBar = false,
        isShowNaviBar = false
    }) {

        callNative({
            info: {
                type: '1103'
            },
            data: {
                isShowStatusBar: isShowStatusBar,
                isShowNaviBar: isShowNaviBar
            }
        })
    },
    // 打开登录窗口
    openLogin({
        success = null,
        cancel = null
    }) {

        const fnNames = NativeJsBridge.callback._addMultiEvents([success, cancel])

        callNative({
            info: {
                type: "1002"
            },
            data: {
                success: fnNames[0],
                cancel: fnNames[1]
            }
        })
    },
    // 获取经纬度
    getLocation({
        callback = null
    }) {

        const fnName = NativeJsBridge.callback._addEvents(callback)

        callNative({
            info: {
                type: '9005'
            },
            data: {
                callback: fnName
            }
        })
    },

    // 获取实时经纬度
    //  ios不支持
    getRealTimeLocation({
        callback = null
    }) {

        const fnName = NativeJsBridge.callback._addEvents(callback)

        callNative({
            info: {
                type: '10007'
            },
            data: {
                callback: fnName
            }
        })
    },

    // 添加右上角按钮
    addRightBtn({
        btnText = '',
        callback = null
    }) {

        const fnName = NativeJsBridge.callback._addEvents(callback, '1')

        callNative({
            info: {
                type: '9004'
            },
            data: {
                btnText: btnText,
                callback: fnName
            }
        })
    },
    // 获取设备号
    getDeviceNum({
        callback = null
    }) {

        const fnName = NativeJsBridge.callback._addEvents(callback)

        callNative({
            info: {
                type: '9003'
            },
            data: {
                callback: fnName
            }
        })
    },
    // 获取token
    getToken({
        callback = null
    }) {

        const fnName = NativeJsBridge.callback._addEvents(callback)

        callNative({
            info: {
                type: '9002'
            },
            data: {
                callback: fnName
            }
        })
    },
    // 微信授权
    wxOAuth({
        success = null,
        error = null
    }) {

        const fnNames = NativeJsBridge.callback._addMultiEvents([success, error])

        // 0成功 1拒绝 2取消 
        callNative({
            info: {
                type: '10005'
            },
            data: {
                success: fnNames[0],
                error: fnNames[1]
            }
        })
    },
    // 分享操作
    share({
        shareTitle = '分享标题',
        text = '分享内容',
        url = 'https://www.atzuche.com',
        sharePicUrl = 'https://carphoto.atzuche.com/web/images/share.png',
        ways = "sinaWeibo,tencentWeibo,weixinFriend,friendsCircle,shortMessage,email",
        sourceType = '', //4邀请有礼分享
        success = null,
        cancel = null
    }) {

        const fnNames = NativeJsBridge.callback._addMultiEvents([success, cancel])

        callNative({
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
        })
    },
    // 进入车辆详情
    carDetail({
        carNo = '',
        sceneId = ''
    }) {

        callNative({
            info: {
                type: '1001'
            },
            data: {
                pageId: '0001',
                carNo: carNo,
                sceneId: sceneId
            }
        })
    },
    // 进入首页
    home() {

        callNative({
            info: {
                type: '1001'
            },
            data: {
                pageId: '0007'
            }
        })

    },
    // popup对话框
    popup({
        title = '标题',
        url = ''
    }) {
        // url为相对地址
        callNative({
            info: {
                type: '1001'
            },
            data: {
                pageId: '0011',
                title: title,
                url: url
            }
        })
    },
    // 添加凹凸官方电话至通讯录
    phoneToAddressList() {
        callNative({
            info: {
                type: '1001'
            },
            data: {
                pageId: '0018'
            }
        })
    },
    // 支付
    pay({
        orderNo = '',
        finish = null,
        cancel = null
    }){
        if(!orderNo){
            NativeJsBridge.alert({
                text: 'orderNo不能为空'
            }) 

            return
        }
        
        const fnNames = NativeJsBridge.callback._addMultiEvents([finish, cancel])

        callNative({
            info: {
                type: '10001'
            },
            data: {
                orderNo: orderNo,
                source: 'h5',
                finish: fnNames[0],
                cancel: fnNames[1]
            }
        })
    },
    // 身份认证
    identityAuth({
        finish = null,
        cancel = null
    }){
        const fnNames = NativeJsBridge.callback._addMultiEvents([finish, cancel])

        callNative({
            info: {
                type: '10002'
            },
            data: {
                source: 'h5',
                finish: fnNames[0],
                cancel: fnNames[1]
            }
        })
    },

    // 禁止ios系统回弹，安卓不支持
    setWebviewBounces({
        isBounces = 1
    }){
        if(isAndroid){
            return
        }

        callNative({
            info: {
                type: '10008'
            },
            data: {
                isBounces: isBounces
            }
        })
    }
}

window.NativeJsBridge = NativeJsBridge

export default NativeJsBridge