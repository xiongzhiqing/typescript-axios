import { ResolvedFn, RejectedFn } from '../types'

interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}

// 拦截器类
export default class InterceptorManager<T> {
  // 用来存储拦截器
  private interceptors: Array<Interceptor<T> | null>

  constructor() {
    this.interceptors = []
  }

  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    this.interceptors.push({
      resolved,
      rejected
    })
    // 返回拦截器的长度
    return this.interceptors.length - 1
  }

  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }
  // 遍历拦截器，把每个拦截器作为参数给传入的fn作为参数执行一遍
  // 内部逻辑使用
  forEach(fn: (interceptor: Interceptor<T>) => void) {
    this.interceptors.forEach(interceptor => {
      if (interceptor !== null) {
        fn(interceptor)
      }
    })
  }
}
