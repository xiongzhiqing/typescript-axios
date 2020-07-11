import { AxiosRequestConfig } from '../types'
import { isPlainObject, deepMerge } from '../helpers/util'

// 合并策略map
const strats = Object.create(null)

// 默认合并策略
function defaultStrat(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}
// 只取val2的值（忽略val1）
function fromVal2Strat(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}
// 复杂对象合并策略(headers)
function deepMergeStrat(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    // 有值， 并且不为对象
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else if (typeof val1 !== 'undefined') {
    return val1
  }
}

// 合并策略函数映射key
const stratKeysFormVal2 = ['url', 'params', 'data']

// 对应key添加策略函数fromVal2Strat
stratKeysFormVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

// 合并策略深度拷贝keys
const stratKeysDeepMerge = ['headers', 'auth']

stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})
export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }

  const config = Object.create(null)

  for (let key in config2) {
    mergeField(key)
  }
  // merge config2中不存在的key
  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    // 通过key获取对应的合并策略函数
    const strat = strats[key] || defaultStrat
    // 字符串索引签名
    config[key] = strat(config1[key], config2![key])
  }

  return config
}
