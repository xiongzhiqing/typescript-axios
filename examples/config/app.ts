import axios, { AxiosTransformer } from "../../src";
import qs from 'qs'

axios.defaults.headers.common['test2'] = 123
axios.defaults.headers.common['xxx-id'] = 'xxxx-id'

console.log(axios.defaults)

axios({
  url: '/config/post',
  method: 'post',
  data: qs.stringify({
    a: 1
  }),
  headers: {
    test: '321'
  }
}).then(res => {
  console.log(res.data)
})

axios({
  transformRequest: [
    (function (data) {
      return qs.stringify(data)
      // return data
    }), ...(axios.defaults.transformRequest as AxiosTransformer[])
  ],
  transformResponse: [...(axios.defaults.transformResponse as AxiosTransformer[]), function (data) {
    if (typeof data === 'object') {
      data.b = 2
    }
    return data
  }],
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  }
}).then(res => {
  console.log(res.data)
})

const instance = axios.create({
  transformRequest: [
    (function (data) {
      return qs.stringify(data)
      // return data
    }), ...(axios.defaults.transformRequest as AxiosTransformer[])
  ],
  transformResponse: [...(axios.defaults.transformResponse as AxiosTransformer[]), function (data) {
    if (typeof data === 'object') {
      data.b = 20
    }
    return data
  }],
})
instance.defaults.headers.common['create'] = 'new Axios'
instance({
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  }
}).then(res => {
  console.log(res.data)
})