import axios, { AxiosResponse, AxiosTransformer } from '../src/index'
import { getAjaxRequest } from './helper'

describe('transform', () => {
  // beforeEach 每个测试用例运行前的钩子函数
  beforeEach(() => {
    jasmine.Ajax.install()
  })
  // afterEach 每个测试用例运行后的钩子函数
  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should transform JSON to string', () => {
    const data = { foo: 'bar' }

    axios.post('/foo', data)

    return getAjaxRequest().then(req => {
      expect(req.params).toBe('{"foo":"bar"}')
    })
  })

  test('should transform string to JSON', done => {
    let responese: AxiosResponse

    axios('/foo').then(res => {
      responese = res
    })

    getAjaxRequest().then(req => {
      req.respondWith({
        status: 200,
        responseText: '{"foo": "bar"}'
      })

      setTimeout(() => {
        expect(typeof responese.data).toBe('object')
        expect(responese.data.foo).toBe('bar')
        done()
      }, 100)
    })
  })

  test('should override default transform', () => {
    const data = { foo: 'bar' }

    axios.post('/foo', data, {
      transformRequest(data) {
        return data
      }
    })

    return getAjaxRequest().then(req => {
      expect(req.params).toEqual({ foo: 'bar' })
    })
  })

  test('should allow an Array of transformers', () => {
    const data = { foo: 'bar' }

    axios.post('/foo', data, {
      transformRequest: (axios.defaults.transformRequest as AxiosTransformer[]).concat(function(
        data
      ) {
        return data.replace('bar', 'baz')
      })
    })

    return getAjaxRequest().then(req => {
      expect(req.params).toBe('{"foo":"baz"}')
    })
  })

  test('should allowing mutating headers', () => {
    const token = Math.floor(Math.random() * Math.pow(2, 64)).toString(36)

    axios('/foo', {
      transformRequest: (data, headers) => {
        headers['X-Authorization'] = token
        return data
      }
    })

    return getAjaxRequest().then(req => {
      expect(req.requestHeaders['X-Authorization']).toBe(token)
    })
  })
})
