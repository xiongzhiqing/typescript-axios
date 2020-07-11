import { AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/cancelToken'
import Cancel, { isCancel } from './cancel/cancel'

// 工厂函数 createInstance
function createInstance(config: AxiosRequestConfig): AxiosStatic {
  // 实例化一个Axios对象
  const context = new Axios(config)
  // 混合对象：首先对象是一个函数，其次这个对象要包括Axios类的所有原型属性和实例属性
  // request内部使用了this 需要绑定上下文 (instance)
  const instance = Axios.prototype.request.bind(context)
  // 将axios上的原型属性和实例属性全部拷贝进来
  extend(instance, context)

  return instance as AxiosStatic
}
// axios === instance  === Axios.prototype.request
const axios = createInstance(defaults)

// 创建一个新的axios实例， 并且合并传入的config和默认的defaults
axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config))
}

// 扩展属性和方法
axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

axios.all = function all(promises) {
  return Promise.all(promises)
}
// 高级函数  返回一个函数
axios.spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr)
  }
}

axios.Axios = Axios

export default axios
