import axios, { AxiosResponse, Canceler } from "../../src";
import Cancel from "../../src/cancel/cancel";
const CancelToken = axios.CancelToken
const source = CancelToken.source()

axios.get('/cancel/get', {
  cancelToken: source.token
}).catch((e: Cancel) => {
  if (axios.isCancel(e)) {
    console.log('Request canceled', e.message)
  }
})


setTimeout(_ => {
  source.cancel('Operation canceled by the user.')

  axios.post('/cancel/post', { a: 1 }, {
    cancelToken: source.token
  }).catch((e: Cancel) => {
    if (axios.isCancel(e)) {
      console.log(e.message, 'post')
    }
  })
}, 100)

let cancel: Canceler

axios.get('/cancel/get', {
  cancelToken: new CancelToken(c => {
    cancel = c
  })
}).catch((e: Cancel) => {
  if (axios.isCancel(e)) {
    console.log('Request canceled', e.message)
  }
})

setTimeout(_ => {
  cancel()
}, 1000)