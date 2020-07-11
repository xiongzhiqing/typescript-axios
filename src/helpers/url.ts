import { isDate, isPlainObject, isURLSearchParams } from './util'

interface URLOrigin {
  protocol: string
  host: string
}

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(
  url: string,
  params?: any,
  paramsSerialize?: (params: any) => string
): string {
  if (!params) {
    return url
  }

  let serializedParams

  if (paramsSerialize) {
    // 传入了自定义序列化方法
    serializedParams = paramsSerialize(params)
  } else if (isURLSearchParams(params)) {
    // params是URLSearchParams类型，直接toString
    serializedParams = params.toString()
  } else {
    const parts: string[] = []
    Object.keys(params).forEach(key => {
      const val = params[key]
      if (val === null || typeof val === 'undefined') {
        // return 不能终止循环，只会进入下一次循环
        return
      }
      let values = []
      if (Array.isArray(val)) {
        values = val
        key += '[]'
      } else {
        values = [val]
      }

      values.forEach(val => {
        if (isDate(val)) {
          val = val.toISOString()
        }
        if (isPlainObject(val)) {
          val = JSON.stringify(val)
        }

        parts.push(`${encode(key)}=${encode(val)}`)
      })
    })

    serializedParams = parts.join('&')
  }

  if (serializedParams) {
    const markIndex = url.indexOf('#')
    // 丢弃hash
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    // 如果有 ？直接拼接 &
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}

// url是否是一个绝对路径
export function isAbsoluteURL(url: string): boolean {
  // ? -> 0次或者一次; * -> 0次或者多次
  // 字母开头^[a-z],
  // 拼接字母或数字或+或-或.（[a-z\d\+\-\.]*）0个或多个
  // 拼接':'
  // 拼接两个斜线'\/\/'
  // 两个斜线之前可有可无'(...)?'  (^[a-z][a-z\d\+\-\.]*:)?
  return /(^[a-z][a-z\d\+\-\.]*:)?\/\//.test(url)
}

// 拼接url
export function combineURL(baseURL: string, relativeURL?: string): string {
  // 正则：/\/+$/  匹配末尾的斜线一个或多个
  // 正则：/^\/+/ 匹配前面的斜线一个或多个
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}

// url是否是同源
export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)
  return (
    parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
  )
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)

  const { protocol, host } = urlParsingNode

  return {
    protocol,
    host
  }
}
