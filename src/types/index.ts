export type Method =
  | 'get'
  | 'Get'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
export interface AxiosRequestConfig {
  url: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType // 响应数据类型 XMLHttpRequestResponseType ts内部定义
  timeout?: number // 超时时间
}

export interface AxiosResponse {
  data: any
  status: number
  statusText: string
  headers: any // 响应头信息
  config: AxiosRequestConfig // 请求配置
  request: any //  XMLHttpRequest
}

// 继承 Promise泛型接口 传递类型 AxiosResponse
export interface AxiosPromise extends Promise<AxiosResponse> {}
