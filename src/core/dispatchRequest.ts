import { AxiosRequestConfig, AxiosPromise, AxiosResponse, Axios } from '../types'
import { buildURL } from '../helpers/url'
import { flattenHeaders } from '../helpers/headers'

import xhr from './xhr'
import transform from './transform'

// 模块化思想

// 导出函数
export default function axios(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequested(config)
  processConfig(config)
  return xhr(config).then(res => {
    return transformResponseData(res)
  })
}
// 处理配置config
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  // 运行时 method是肯定会有的
  config.headers = flattenHeaders(config.headers, config.method!)
}

// 处理url
function transformURL(config: AxiosRequestConfig): string {
  const { url, params, paramsSerializer } = config
  // 类型断言 url! 不为空
  return buildURL(url!, params, paramsSerializer)
}

// 处理返回（response）data
function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    // 检测cancelToken是否被使用过（this.reason是否为真)
    config.cancelToken.throwIfRequested()
  }
}
