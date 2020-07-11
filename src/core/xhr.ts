import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      url,
      method = 'get',
      data = null,
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName
    } = config

    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    if (timeout) {
      // 设置超时时间
      request.timeout = timeout
    }

    if (withCredentials) {
      request.withCredentials = withCredentials
    }

    // 类型断言 url! 不为空
    request.open(method.toUpperCase(), url!, true)

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
      reject(createError('Network Error', config, null, request))
    }

    // 请求超时
    request.ontimeout = function handleTimeout() {
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
    }

    // xsrf防御
    // 允许跨域 或者 同域情况下，并且设置了xsrfCookieName
    // 断言url 不为空
    if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
      const xsrfValue = cookie.read(xsrfCookieName)
      if (xsrfValue && xsrfHeaderName) {
        headers[xsrfHeaderName] = xsrfValue
      }
    }

    // 设置headers
    Object.keys(headers).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    if (cancelToken) {
      cancelToken.promise.then(reason => {
        request.abort()
        reject(reason)
      })
    }

    request.send(data)

    // 非200 状态码处理
    function handleResponse(response: AxiosResponse): void {
      const { status } = response
      if (status >= 200 && status < 300) {
        resolve(response)
      } else {
        reject(
          createError(`Request failed with status code ${status}`, config, null, request, response)
        )
      }
    }
  })
}
