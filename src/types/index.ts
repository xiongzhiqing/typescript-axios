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

  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]

  cancelToken?: CancelToken

  withCredentials?: boolean

  xsrfCookieName?: string
  xsrfHeaderName?: string

  auth?: AxiosBasicCredentials

  // 自定义合法状态码
  validateStatus?: (status: number) => boolean

  onDownloadProgress?: (e: ProgressEvent) => void
  onUploadProgress?: (e: ProgressEvent) => void

  // 字符串索引签名
  [prop: string]: any
}

export interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any // 响应头信息
  config: AxiosRequestConfig // 请求配置
  request: any //  XMLHttpRequest
}

// 继承 Promise泛型接口 传递类型 AxiosResponse
export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

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
  defaults: AxiosRequestConfig
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

// 混合类型接口， 本身只是个函数，继承Axios接口（相当于 即有函数类型，又有属性方法）
export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  // 接口类型，函数重载定义
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosStatic extends AxiosInstance {
  // 静态方法
  create(config?: AxiosRequestConfig): AxiosInstance

  // 静态属性
  CancelToken: CancelTokenStatic
  Cancel: CancelStatic
  // 函数
  isCancel: (val: any) => boolean
}
// 拦截器
export interface AxiosInterceptorManager<T> {
  // 函数类型接口 返回一个拦截器id 给eject使用
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number

  eject(id: number): void
}

// 泛型接口， 请求拦截器是AxiosRequestConfig 响应拦截器是AxiosResponse
export interface ResolvedFn<T> {
  (val: T): T | Promise<T>
}

export interface RejectedFn {
  (error: any): any
}

export interface AxiosTransformer {
  (data: any, headers?: any): any
}

// CancelToken -> CancelToken的实例类型
export interface CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  throwIfRequested(): void
}

export interface Canceler {
  (message?: string): void
}

export interface CancelExecutor {
  (cancel: Canceler): void
}

export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

// CancelTokenStatic => CancelToken类类型
export interface CancelTokenStatic {
  // 构造函数定义
  new (executor: CancelExecutor): CancelToken
  // 静态方法定义
  source(): CancelTokenSource
}

export interface Cancel {
  message?: string
}

export interface CancelStatic {
  new (message?: string): Cancel
}

export interface AxiosBasicCredentials {
  username: string
  password: string
}
