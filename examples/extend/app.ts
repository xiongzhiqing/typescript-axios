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

// 数据响应支持泛型

interface ResponseData<T = any> {
  code: number
  result: T
  message: string
}

interface User {
  name: string,
  age: number,
  sex: number
}

function getUser<T>() {
  return axios<ResponseData<T>>('/extend/user').then(res => res.data).catch(err => console.log(err))
}

async function test() {
  const user = await getUser<User>()
  if (user) {
    console.log(user.result.name)
    console.log(user.result.sex)
  }
}
test()