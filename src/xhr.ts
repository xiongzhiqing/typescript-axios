import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { parseHeaders } from './helpers/headers'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { url, method = 'get', data = null, headers, responseType, timeout } = config

    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    if (timeout) {
      // 设置超时时间
      request.timeout = timeout
    }

    request.open(method.toUpperCase(), url, true)

    request.onreadystatechange = function handleLoad() {
      const { readyState, status: requestStatus } = request
      if (readyState !== 4) {
        return
      }
      // 网络错误 和 超时错误  status 都为 0
      if (requestStatus === 0) {
        return
      }
      // parseHeaders 把headers按规则转换成json对象
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData = responseType !== 'text' ? request.response : request.responseText

      const { status, statusText } = request

      const response: AxiosResponse = {
        data: responseData,
        status: status,
        statusText: statusText,
        headers: responseHeaders,
        config,
        request
      }

      handleResponse(response)
    }

    // 网络错误
    request.onerror = function handleError() {
      reject(new Error('Network Error'))
    }

    // 请求超时
    request.ontimeout = function handleTimeout() {
      reject(new Error(`Timeout of ${timeout} ms exceeded`))
    }

    // 设置headers
    Object.keys(headers).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    request.send(data)

    // 非200 状态码处理
    function handleResponse(response: AxiosResponse): void {
      const { status } = response
      if (status >= 200 && status < 300) {
        resolve(response)
      } else {
        reject(new Error(`Request failed with status code ${status}`))
      }
    }
  })
}
