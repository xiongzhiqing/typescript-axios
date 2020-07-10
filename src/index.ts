import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { buildURL } from './helpers/url'
import { transformRequest, transformResponse } from './helpers/data'
import { processHeaders } from './helpers/headers'

import xhr from './xhr'

function axios(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  return xhr(config).then(res => {
    return transformResponseData(res)
  })
}
// 处理配置config
function processConfig(config: AxiosRequestConfig): void {
  config.headers = transformHeaders(config)
  config.url = transformURL(config)
  // transformRequest 方法对data进行了JSON.stringify处理
  config.data = transformRequestData(config)
}

// 处理url
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}

// 处理请求（request）data
function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}
// 处理请求headers
function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}
// 处理返回（response）data
function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transformResponse(res.data)
  return res
}

export default axios
