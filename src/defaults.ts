import { AxiosRequestConfig } from './types'
import { processHeaders } from './helpers/headers'
import { transformRequest, transformResponse } from './helpers/data'

const defaults: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,

  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },
  // 请求数据默认配置
  transformRequest: [
    function(data: any, headers?: any): any {
      processHeaders(headers, data)
      return transformRequest(data)
    }
  ],
  // 响应数据默认配置
  transformResponse: [
    function(data: any): any {
      return transformResponse(data)
    }
  ]
}

// 没有data参数的请求类型key
const methodsNoData = ['delete', 'get', 'head', 'options']

methodsNoData.forEach(method => {
  defaults.headers[method] = {}
})
// 有data参数的请求类型key
const methodsWithData = ['post', 'put', 'patch']
methodsWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default defaults
