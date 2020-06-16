import axios from 'axios'
// import Qs from 'qs'
import {MessageBox, Message, Loading} from 'element-ui'
import store from '@/store'
import {getToken} from '@/utils/auth'
import {RETURN_CODE} from '@/config/base'
import i18n from '@/lang'
// import Vue from "vue"
import {getLanguage} from '@/lang/index'

let loading = null

function startLoading() { // 使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    text: 'Loading...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

function endLoading() { // 使用Element loading-close 方法
  loading.close()
}

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 200000, // request timeout
  transformRequest: [
    // function (data) {
    //   if (data instanceof FormData) {
    //     return data
    //   } else {
    //     return Qs.stringify(data)
    //   }
    //   // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
    // }
  ]
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (config.isLoading) {
      startLoading()
    }

    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = getToken()
      config.headers['lang_type'] = getLanguage() == 'zh' ? 'zh' : 'en-us' // zh or en-us
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    if (loading) endLoading()
    const res = response.data
    if (response.config && response.config.responseType) return res
    // if the custom code is not 200, it is judged as an error.
    if (res.code !== RETURN_CODE.SUCCESS) {
      // token 失效
      if (res.code === RETURN_CODE.TOKEN_FAIL) {
        Message({
          message: i18n.t('code.tokenFail'),
          type: 'warning',
          duration: 5 * 1000
        })

        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      }

      Message({
        message: res.msg || res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    if (loading) endLoading()
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
