import { AxiosRequestConfig } from './types'
import { buildURL } from './helpers/url'
import { transformRequest } from './helpers/data'
import { processHeaders } from './helpers/headers'

import xhr from './xhr'

function axios(config: AxiosRequestConfig) {
  processConfig(config)
  xhr(config)
}
// 处理配置config
function processConfig(config: AxiosRequestConfig): void {
  config.headers = transformHeaders(config)
  config.url = transformURL(config)
  // transformRequest 方法对data进行了JSON.stringify处理
  config.data = transformRequestData(config)
  console.log(config.data)
}

// 处理url
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}

// 处理data
function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}

function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

export default axios
