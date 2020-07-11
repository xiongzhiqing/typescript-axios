const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const multipart = require('connect-multiparty')
const webpack = require('webpack');
const atob = require('atob')
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const WebpackConfig = require('./webpack.config');
const path = require('path')

require('./server2')
const app = express()
const compiler = webpack(WebpackConfig)

app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunks: false
  }
}))

app.use(webpackHotMiddleware(compiler))

app.use(express.static(__dirname, {
  setHeaders (res) {
    res.cookie('XSRF-TOKEN-D1', 'HELLO WORLD')
  }
}))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())

app.use(multipart({
  // 指定上传目录
  uploadDir: path.resolve(__dirname, 'upload-file')
}))

const router = express.Router()

simpleRouter()
baseRouter()
errorRouter()
extendRouter()
interceptorRouter()
configRouter()
cancelRouter()
moreRouter()


app.use(router)
const port = process.env.PORT || 8888
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})

function simpleRouter () {
  router.get('/simple/get', function (req, res) {
    console.log(req, res, '====>')
    res.json({
      msg: `hello world`
    })
  })
}

function baseRouter () {
  router.get('/base/get', function (req, res) {
    res.json(req.query)
  })

  router.post('/base/post', function (req, res) {
    res.json(req.body)
  })

  router.post('/base/buffer', function (req, res) {
    let msg = []
    req.on('data', chunk => {
      if (chunk) {
        msg.push(chunk)
      }
    })
    req.on('end', _ => {
      let buf = Buffer.concat(msg)
      res.json(buf.toJSON())
    })
  })
}

function errorRouter () {

  router.get('/error/get', function (req, res) {
    if (Math.random() > 0.5) {
      res.json({
        msg: 'hello world'
      })
    } else {
      res.status(500)
      res.end()
    }
  })


  router.get('/error/timeout', function (req, res) {
    setTimeout(() => {
      res.json({
        msg: 'hello world'
      })
    }, 3000)
  })
}

function extendRouter () {
  router.get('/extend/get', function (req, res) {
    res.json({
      msg: 'hello world'
    })
  })
  router.options('/extend/options', function (req, res) {
    res.end()
  })
  router.delete('/extend/delete', function (req, res) {
    res.end()
  })
  router.head('/extend/head', function (req, res) {
    res.end()
  })
  router.post('/extend/post', function (req, res) {
    res.json(req.body)
  })
  router.put('/extend/put', function (req, res) {
    res.json(req.body)
  })
  router.patch('/extend/patch', function (req, res) {
    res.json(req.body)
  })

  router.get('/extend/user', function (req, res) {
    res.json({
      code: 0,
      message: 'ok',
      result: {
        name: 'jack',
        age: '18'
      }
    })
  })
}


function interceptorRouter () {
  router.get('/interceptor/get', (req, res) => {
    res.end('hello')
  })
}

function configRouter () {
  router.post('/config/post', function (req, res) {
    res.json(req.body)
  })
}


function cancelRouter () {
  router.get('/cancel/get', function (req, res) {

    setTimeout(() => {
      res.json('hello')
    }, 1000)
  })

  router.post('/cancel/post', function (req, res) {
    setTimeout(() => {
      res.json(res.body)
    }, 1000)
  })
}

function moreRouter () {
  router.get('/more/get', (req, res) => {
    res.json(req.cookies)
  })
  router.post('/more/post', (req, res) => {
    const auth = req.headers.authorization
    const [type, credentials] = auth.split(' ')

    console.log(atob(credentials))
    const [username, password] = atob(credentials).split(':')
    if (type === 'Basic' && username === 'Qing' && password === 'q123456') {
      res.json(req.body)
    } else {
      res.status(401)
      res.end('UnAuthorization')
    }
  })

  router.post('/more/upload', (req, res) => {
    console.log(req.body, req.files)
    res.end('upload success!')
  })
}