import axios from '../src/index'
import { getAjaxRequest } from './helper'

describe('progress', () => {
  // beforeEach 每个测试用例运行前的钩子函数
  beforeEach(() => {
    jasmine.Ajax.install()
  })
  // afterEach 每个测试用例运行后的钩子函数
  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should add a download progress handler', () => {
    const progressSpy = jest.fn()

    axios('/foo', { onDownloadProgress: progressSpy })

    return getAjaxRequest().then(req => {
      req.respondWith({
        status: 200,
        responseText: '{"foo":"bar"}'
      })

      expect(progressSpy).toHaveBeenCalled()
    })
  })

  test('should add a upload progress handler', () => {
    const progressSpy = jest.fn()

    axios('/foo', { onUploadProgress: progressSpy })

    return getAjaxRequest().then(req => {
      // req.respondWith({
      //   status: 200,
      //   responseText: '{"foo":"bar"}'
      // })
      // expect(progressSpy).toHaveBeenCalled();
    })
  })
})
