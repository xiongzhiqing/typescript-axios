import { AxiosInstance, AxiosRequestConfig } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaults'

// 工厂函数 createInstance
function createInstance(config: AxiosRequestConfig): AxiosInstance {
  // 实例化一个Axios对象
  const context = new Axios(config)
  // 混合对象：首先对象是一个函数，其次这个对象要包括Axios类的所有原型属性和实例属性
  // request内部使用了this 需要绑定上下文 (instance)
  const instance = Axios.prototype.request.bind(context)
  // 将axios上的原型属性和实例属性全部拷贝进来
  extend(instance, context)

  return instance as AxiosInstance
}
// axios === instance  === Axios.prototype.request
const axios = createInstance(defaults)

export default axios
