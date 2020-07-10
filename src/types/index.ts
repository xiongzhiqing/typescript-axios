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
  url?: string
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

// 继承 Error
export interface AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse
}

// 描述了axios类中的公共方法
export interface Axios {
  request(config: AxiosRequestConfig): AxiosPromise

  get(url: string, config?: AxiosRequestConfig): AxiosPromise
  delete(url: string, config?: AxiosRequestConfig): AxiosPromise
  head(url: string, config?: AxiosRequestConfig): AxiosPromise
  options(url: string, config?: AxiosRequestConfig): AxiosPromise

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise
  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise
  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise
}

// 混合类型接口， 本身只是个函数，继承Axios接口（相当于 即有函数类型，又有属性方法）
export interface AxiosInstance extends Axios {
  (config: AxiosRequestConfig): AxiosPromise
  // 接口类型，函数重载定义
  (url: string, config?: AxiosRequestConfig): AxiosPromise
}
