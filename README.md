### at-jssdk说明文档

#### 使用方法

```bash
	$ npm install at-js-sdk
```


```javascript
	
	//at会暴露调用原生的接口

	import at from 'at-js-sdk'

```
#### 接口参数说明

<font color=#f00 face="黑体">所有参数都会有默认值，外部可以不传此参数，但是不可以传空值，否则无法调用原生代码。

对于其中所有涉及到url的地方，全部使用https。</font>


#### APP-H5键值对(部分)
```javascript
	{
	    2001: '显示loading'
	    2005: '隐藏loading'
	    2004: 'toast'
	    2003: 'alert'
	    2002: 'confirm弹框'
	    1101: '打开新窗口'
	    1102: '新窗口标题'
	    1103: '设置状态栏安卓不支持'
	    1002:'打开登录窗口'
	 	9005: '经纬度'
		9004:'添加右上角按钮'
		9003: '获取设备号'
        10006: '关闭窗口'
	 	10005: '微信授权'
	 	1001&pageId=0005: '分享'
	 	1001&pageId=0001: '车辆详情'
	 	1001&pageId=0007:'进入首页'
	 	1001&pageId=0018:	'添加凹凸官方电话至通讯录'
	 	1001&pageId=0011: '弹出浮层'
        1001&pageId=0021: '关闭弹出浮层'
        10001: '支付'
        10002: '身份认证'
        10007: '获取实时定位（目前该方法只在安卓中有效）'
        10008: '禁止网页回弹'
	}
```


#### api接口说明

* loading
	* 描述：显示loading动画
	* 注：<font color=#f00 face="黑体">此方法安卓不支持，ios支持</font>
	* 使用方法：
```javascript
	//显示loading框
	at.loading.show()

	//关闭loading框
	at.loading.hide()
```

* toast
	* 描述：toast提示框
	* 使用方法：
```javascript
	at.toast('描述文案')
```
 
* alert
	* 描述：alert提示弹框
	* 使用方法：
```javascript
	at.alert({
		title: '测试标题',
        text: '测试内容',
        okText: '测试按钮',
        ok() {
            alert("确认按钮回调")
        }
	})
```

* confirm
	* 描述：confirm对话框
	* 使用方法：
```javascript
	at.confirm({
        title: '测试标题',
        text: '测试内容',
        okText: '测试按钮',
        ok() {
            alert("确认按钮回调")
        },
        cancel(){
            alert("取消按钮回调")
        }
    })
```

* openWindow
	* 描述：打开新窗口
	* 使用方法：
```javascript
	at.openWindow({
        title: '新的标题',
        url: 'https://www.baidu.com',
        isShowStatusBar: 'false', // 安卓中无效
        isShowNaviBar: 'false'
    })
```

* closeWindow
	* 描述：关闭窗口
	* 使用方法：
```javascript
	at.closeWindow()

    at.closeWindow(1)

    <!-- 关闭100个窗口 -->
    at.closeWindow(100)
```

* setTitle
	* 描述：设置窗口标题
	* 使用方法：
```javascript
	at.setTitle('设置窗口标题')
```

* setStatusBar
	* 描述：设置窗口的状态栏和导航栏显示或隐藏
	* 注：<font color=#f00 face="黑体">此方法安卓不支持，ios支持</font>
	* 使用方法：
```javascript
	at.setStatusBar({
        isShowStatusBar: 'true',
        isShowNaviBar: 'true'
    })
```

* openLogin
	* 描述：打开app的登录窗口
	* 使用方法：
```javascript
	at.openLogin({
        success(res){
            // 返回用户基本信息
            // {"mobile": "13566666666", "name": "xxx"}
            alert('登录成功,可以进行其他后续操作')
        },
        cancel(){ // 点击左上角的关闭按钮，目前没有app未实现
            alert('登录取消')
        }
    })
```

* getLocation
	* 描述：获取用户的经纬度
	* 使用方法：
```javascript
	at.getLocation({
        callback(res){
            // res = {"cityCode": "310100", "longitude": "121.33332", "latitude": "31.253223"}
            //进行其他后续操作
        }
    })
```

* getRealTimeLocation
    * 描述：获取用户的经纬度(实时，原因部分安卓手机h5无法获取经纬度，需要通过原生定位才能获取。目前ios不支持该方法)
    * 使用方法：
    *
```javascript
    at.getRealTimeLocation({
        callback(res){
            res = {
                "status": 0,  // 0成功，-1失败，-2超时
                "longitude": "121.33332",  // 成功时才有该字段
                "latitude": "31.253223", // 成功时才有该字段
            }
            //进行其他后续操作
        }
    })
```



* addRightBtn
	* 描述：添加app导航栏右上角的按钮
	* 使用方法：
```javascript
	at.addRightBtn({
        btnText: '测试',
        callback(){
            alert('点击了右上角按钮')
        }
    })
```

* getDeviceNum
	* 描述：获取设备号
	* 使用方法：
```javascript
	at.getDeviceNum({
        callback(res){
            // res = {"deviceNum": "ASDFSDDDD"}
            //进行其他后续操作
        }
    })
```

* getToken
	* 描述：获取用户token
	* 使用方法：
```javascript
	at.getToken({
        callback(res){
            // res = {"token": "164655sdfa55asdaasd"}
            // token = 0 || token = '' 即为未登录
            //进行其他后续操作
        }
    })
```

* wxOAuth
	* 描述：微信授权，调起微信进行授权，成功或者取消之后回调
	* 使用方法：
```javascript
	at.wxOAuth({
        success(res){
            // {"wxReturnCode": "1"} 拒绝
            // {"wxReturnCode": "2"} 取消
            // 成功，成功之后返回的值就是微信返回值，具体参数请参考
            // http://mp.weixin.qq.com/wiki
            // {"wxReturnCode": "0", "openid":" OPENID",  
            //  " nickname": NICKNAME,   
            //  "sex":"1",   
            //  "province":"PROVINCE"   
            //  "city":"CITY",   
            //  "country":"COUNTRY",    
            //  "headimgurl":"http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vx
            // 4eMsv84eavHiaiceqxibJxCfHe/46",  
            // "privilege":[ "PRIVILEGE1" "PRIVILEGE2"     ],    
            //  "unionid": "o6_bmasdasdsad6_2sgVt7hMZOPfL" 
            // } 
            //进行其他后续操作
        },
        error(res){
            console.log(res)
        }
    })
```

* share
	* 描述：分享操作，可以调取原生微博，腾讯微博，微信好友，朋友圈，短信，邮箱
	* 使用方法：
```javascript
	at.share({
        shareTitle: '测试',
        text: 'ddd',   //内容不能为空
        url: 'https://www.baidu.com',
        // 确认sharePicUrl可以加载到，否则无法回调成功
        sharePicUrl: 'https://carphoto.atzuche.com/car/15/04/935622775/1451274846140.jpg',
        // ways 可以选择1个或者多个
        // ways: 'weixinFriend,friendsCircle',
        ways: 'sinaWeibo,tencentWeibo,weixinFriend,friendsCircle,shortMessage,email',
        success(){
            alert('share success')
        },
        cancel(){
            alert('share cancel') 
        },
        sourceType: '4' //4为邀请有礼，用于统计, 其他根据项目需求，传其他值
    })
```


* carDetail
	* 描述：进入车辆详情
	* 使用方法：
```javascript
	at.carDetail({
        carNo: '209028004', // 车辆号
        sceneId: 'Ex004' // 场景号
    })
```

* home
	* 描述：打开app首页
	* 使用方法：
```javascript
	at.home()
```


* phoneToAddressList
	* 描述：添加凹凸官方电话至通讯录
	* 使用方法：
```javascript
	at.phoneToAddressList()
```

* popup
	* 描述：popup对话框
	* 使用方法：
```javascript
	at.popup({
        title: '测试标题',
        url: '/h5pro/app4/html/recharge.html' // url为相对地址
    })
```

* resume
    * 描述：进入页面会自动执行的钩子函数
    * 使用方法：
```javascript
    // 在页面中重写此方法
    // 页面进入的时候 会自动执行此方法
    // 重写的是NativeJsBridge，此对象为全局
    NativeJsBridge.resume = function(){
        alert('进入页面')
    }
```

* pause
    * 描述：离开页面会自动执行的钩子函数
    * 使用方法：
```javascript
    // 在页面中重写此方法
    // 页面进入的时候 会自动执行此方法
    // 重写的是NativeJsBridge，此对象为全局
    NativeJsBridge.pause = function(){
        alert('离开页面')
    }
```

* pay
    * 描述：支付 
    * 参数为 orderNo
    * 使用方法：
```javascript
    at.pay({
        orderNo: '320123020',
        finish(){
            // 说明支付过了，具体成功与否，通过后台接口查询
        },
        error(){
            //支付失败
        }
    })
```

* identityAuth
    * 描述：身份认证
    * 使用方法：
```javascript
    at.identityAuth({
        finish(){
            // 说明认证过了，具体成功与否，通过后台接口查询
        },
        error(){
            //认证失败
        }
    })
```


* setWebviewBounces
    * 禁止或者显示页面回弹
    * 使用方法：
```javascript
    at.setWebviewBounces({
        isBounces: 0   // 0 禁止回弹， 1 允许回弹
    })
```