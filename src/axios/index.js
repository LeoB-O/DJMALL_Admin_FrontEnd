import axios from 'axios'
import router from '../router'

axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.withCredentials = true

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          router.replace({
            path: '/signin',
            query: {redirect: router.currentRoute.fullPath}
          })
      }
    }
    return Promise.reject(error.response.data)   // 返回接口返回的错误信息
  })

export default {
  get: function (url,params) {
    return new Promise((resolve, reject) => {
      axios.get(url,params).then(response => {
        resolve(response.data)
      }).catch((error) => reject(error))
    })
  },

  post: function (url, data) {
    return new Promise((resolve, reject) => {
      axios.post(url, data).then((response) => resolve(response.data)).catch((error) => reject(error))
    })
  },

  put: function (url, data) {
    return new Promise((resolve, reject) => {
      axios.put(url, data).then((response) => resolve(response.data)).catch((error) => reject(error))
    })
  }
}
