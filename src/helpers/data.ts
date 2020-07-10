import { isPlainObject } from './util'

export function transformRequest(data: any): any {
  console.log(isPlainObject(data))
  if (isPlainObject(data)) {
    console.log(111)
    return JSON.stringify(data)
  }
  return data
}
