import Base64 from './base64'

let base64 = new Base64()
      
let u = navigator.userAgent

let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 //android终端

let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端

export default function callNative(data) {
    let param = base64.encode(JSON.stringify(data))

    // let prevIframe = NativeJsBridge.iframe

    let iframe = document.createElement("iframe")

    iframe.style.display = 'none'

    document.body.appendChild(iframe)
  
    if (isAndroid) {

        iframe.src = "atzuche.dynamic:param=" + param

    } else if (isiOS) {

        iframe.src = "https://atzuche.dynamic/?param=" + param

    }

    // NativeJsBridge.iframe = iframe

    setTimeout(function() {

        iframe.parentNode.removeChild(iframe)

    }, 30)

    return false;
}

export { base64, isAndroid, isiOS }
