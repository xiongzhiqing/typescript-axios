import axios from "../../src";
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'
import { AxiosError } from "../../src/helpers/error";
import qs from 'qs'

// document.cookie = 'a=b'
// withCredentials
// axios.get('/more/get').then(res => {
//   console.log(res)
// })

// axios.post('http://127.0.0.1:8088/more/server2', {}, {
//   withCredentials: true
// }).then(res => {
//   console.log(res)
// })

// xsrf
// const instance = axios.create({
//   xsrfHeaderName: 'X-XSRF-TOKEN-D1',
//   xsrfCookieName: 'XSRF-TOKEN-D1'
// })

// instance.get('/more/get').then(res => {
//   console.log(res, 'xsrf')
// })

// 上传下载

const instance = axios.create()

function calculatePercentage(loaded: number, total: number) {
  return Math.floor(loaded * 1.0) / total
}

function loadProgressBar() {
  const progressEl = document.getElementById('progress')
  const setupStartProgress = () => {
    instance.interceptors.request.use(config => {
      NProgress.start()
      return config
    })
  }

  const setupUpdateProgress = () => {
    const update = (e: ProgressEvent) => {
      console.log(e)
      const progress = calculatePercentage(e.loaded, e.total)
      progressEl.innerHTML = `${(progress * 100).toFixed(4)}%`
      NProgress.set(progress)
    }

    instance.defaults.onDownloadProgress = update
    instance.defaults.onUploadProgress = update
  }

  const setupStopProgress = () => {
    instance.interceptors.response.use(response => {
      NProgress.done()
      return response
    }, error => {
      NProgress.done()
      return Promise.reject(error)
    })
  }

  setupStartProgress()
  setupUpdateProgress()
  setupStopProgress()
}
loadProgressBar()

const downloadEl = document.getElementById('download')
downloadEl.addEventListener('click', e => {
  instance.get('http://img.mukewang.com/szimg/5cbf00cb092626c820000400.jpg')
})

const uploadEl = document.getElementById('upload')
uploadEl.addEventListener('click', e => {
  const data = new FormData()
  const fileEl = document.getElementById('file') as HTMLInputElement
  if (fileEl.files) {
    data.append('file', fileEl.files[0])
    instance.post('/more/upload', data)
  }
})

// auth
axios.post('/more/post', {
  a: 1
}, {
  auth: {
    username: 'Qing',
    password: 'q123456'
  }
}).then(res => {
  console.log(res, '------ auth ------')
})

// validateStatus

axios.get('/more/304').then(res => {
  console.log(res)
}).catch((e: AxiosError) => {
  console.log(e.message)
})


axios.get('/more/304', {
  validateStatus(status) {
    return status >= 300 && status < 400
  }
}).then(res => {
  console.log(res)
}).catch((e: AxiosError) => {
  console.log(e.message)
})

// paramsSerializer
axios.get('/more/get', {
  params: new URLSearchParams('a=b&c=d')
}).then(res => {
  console.log(res, 'URLSearchParams')
})

axios.get('/more/get', {
  params: {
    a: 1,
    b: 2,
    c: ['a', 'b', 'c']
  }
}).then(res => {
  console.log(res, '----')
})

const instance1 = axios.create({
  // params
  paramsSerializer(params) {
    return qs.stringify(params, {
      arrayFormat: 'brackets'
    })
  }
})

instance1.get('/more/get', {
  params: {
    a: 1,
    b: 2,
    c: ['a', 'b', 'c']
  }
}).then(res => {
  console.log(res, 'paramsSerializer')
})

const instance2 = axios.create({
  baseURL: 'https://img.mukewang.com/'
})

instance2.get('5cbf00cb092626c820000400.jpg')
instance2.get('http://img.mukewang.com/szimg/5cbf00cb092626c820000400.jpg')