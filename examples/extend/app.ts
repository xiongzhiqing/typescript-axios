import axios from "../../src";

axios({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hi'
  }
})

axios.request({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hello'
  }
})


axios.get('/extend/get')
axios.options('/extend/options')
axios.delete('/extend/delete')
axios.head('/extend/head')
axios.post('/extend/post', { msg: 'post' })
axios.put('/extend/put', { msg: 'put' })
axios.patch('/extend/patch', { msg: 'patch' })


// 函数重载demo
axios({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'overload hi'
  }
})

axios('/extend/post', {
  method: 'post',
  data: {
    msg: 'overload hello'
  }
})