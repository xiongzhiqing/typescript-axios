import axios from '../../src/index'

axios({
  url: '/error/get1',
}).then(res => {
  console.log(res, '1===>res')
}).catch(e => {
  console.log(e, '1===>e')
})


axios({
  url: '/error/get'
}).then(res => {
  console.log(res, '2===>res')
}).catch(e => {
  console.log(e, '2===>e')
})



setTimeout(() => {
  axios({
    url: '/error/get'
  }).then(res => {
    console.log(res, 'setTimeout===>res')
  }).catch(e => {
    console.log(e, 'setTimeout===>e')
  })
}, 5000)


axios({
  url: '/error/timeout',
  timeout: 2000
}).then(res => {
  console.log(res, 'timeout===>res')
}).catch(e => {
  console.log(e.message, 'timeout===>e')
})