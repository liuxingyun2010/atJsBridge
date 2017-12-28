/**
 * 调用原生APP的功能，原生目前通过注入的方式执行
 * API，功能包括：
 * 1、打开通讯录
 *
 */  

/**
 * 关于生命周期，原生打开webview之后需要向document注入自定义事件AtJSBridgeReady
 * 说明已经注入完成，可以使用
 *
 */

 /**  
 * 关于回调，如果没有特殊说明，返回只有两种回调，参数全部以json对象的形式返回
 * 1.success
 * 2.fail
 *   2.1 errorCode  错误码请统一
 *   2.2 errorMsg
 */  

const atJsBridgeApi = {
	version: '2.0.1',

	// 当页面加载完毕后执行，使用方法： 
	ready(callback){
		if (callback && typeof callback === 'function') {  
			const Api = this

			const atJsReadyFunc = () => callback(Api) 

			if (typeof window.AtJSBridge === "undefined"){
				// 不用考虑老的机型
				document.addEventListener('AtJSBridgeReady', atJsReadyFunc, false)
			}else{  
				atJsReadyFunc()
			}  
		}  
	},
	
	// 打开通讯录
	contacts(obj){
		AtJSBridge.contacts({
			success(e){
				// 返回字段格式
				// {
				// 		name: '123',
				// 		mobile: '13564981000'
				// }
				obj && typeof obj.success === 'function' && obj.success(e)
			},
			fail(e){
				// 返回字段格式如：
				// {
				// 		errorCode: '-1',
				// 		errorMsg: '没有权限'
				// }
				obj && typeof obj.fail === 'function' && obj.fail(e)
			}
		})
	}
}

export default atJsBridgeApi