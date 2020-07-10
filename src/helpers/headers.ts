import { isPlainObject } from './util'
const ContentType = 'Content-Type'

function normalizeHeaderName(headers: any, normalizeName: string): void {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach(name => {
    if (name !== normalizeName && name.toUpperCase() === normalizeName.toUpperCase()) {
      headers[normalizeName] = headers[name]
      delete headers[name]
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  if (isPlainObject(data)) {
    normalizeHeaderName(headers, ContentType)
    if (headers && !headers[ContentType]) {
      headers[ContentType] = 'application/json;charset=utf-8'
    }
  }
  console.log(headers, '===')
  return headers
}
