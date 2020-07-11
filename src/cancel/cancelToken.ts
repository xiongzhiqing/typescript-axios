import { CancelExecutor, CancelTokenSource, Canceler } from '../types'
import Cancel from './cancel'

interface ResolvePromise {
  (reason?: Cancel): void
}

export default class CancelToken {
  // 成员属性
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    // 创建一个pedding状态的promise
    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve
    })
    // message => {xxx}： 此处相当于new CancelToken中的c参数
    executor(message => {
      if (this.reason) {
        return
      }
      this.reason = new Cancel(message)
      // 决断promise 状态变更为fulfilled，xhr中就可以使用then执行abort方法
      resolvePromise(this.reason)
    })
  }
  // token已被使用过
  throwIfRequested() {
    if (this.reason) {
      throw this.reason
    }
  }

  // 类似于工厂方法
  static source(): CancelTokenSource {
    let cancel!: Canceler
    // c 相当于executor执行器中执行的方法 message => {xxx}
    const token = new CancelToken(c => {
      cancel = c
    })
    return {
      cancel,
      token
    }
  }
}
