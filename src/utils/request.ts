// 封装网络请求模块
import { Toast } from 'antd-mobile'
import axios, { AxiosError } from 'axios'
import { getToken, setToken } from './token'
import store from '@/store'
import { LoginAction } from '@/types/store'
import { Token } from '@/types/data'

// 导入独立创建的 history对象
import history from '@/router'

const baseURL = 'http://geek.itheima.net/v1_0/'

// 创建新的实例
const http = axios.create({
  baseURL,
  timeout: 3000
})

// 设置请求响应拦截器 -- use(成功的回调函数，失败的回调函数)
http.interceptors.request.use(
  (config) => {
    // 获取当前的 token -- 设置到请求头中
    const token = getToken()
    if (token && token.token) {
      config.headers!.Authorization = `Bearer ${token.token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError<{ message: string }>) => {
    console.log(error.response)

    // 统一错误处理
    // 1、没有 response信息，说明服务器没有处理请求
    if (!error.response) {
      Toast.show({
        content: '服务器发送错误！'
      })
      return Promise.reject(error)
    }

    // ----- token 无感刷新逻辑 ------
    if (error.response.status === 401) {
      const token = getToken()
      if (token.token && token.refresh_token) {
        try {
          // 尝试获取新token -- 请求头需要携带refresh_token：重新创建http实例 或 使用默认的axios实例
          // 【注意】原始的axios 没有设置基地址
          const result = await axios.put(`${baseURL}/authorizations`, null, {
            headers: {
              Authorization: `Bearer ${token.refresh_token}`
            }
          })
          console.log(result)

          // 拼接新的 token对象 -- 用于存储
          const newToken = result.data.data.token
          const newTokenObj: Token = {
            token: newToken,
            refresh_token: token.refresh_token
          }

          // 将新换取的token更新到本地store
          // 【注意】Hooks方法只能在组件内部或自定义的Hooks中调用，不能在常规的函数或JS文件中使用
          //  -- redux 最原始的写法：导入store实例，store.dispatch({...}) 就能调用 reducer
          store.dispatch({
            type: 'login/set_token',
            payload: newTokenObj
          } as LoginAction)

          // 将新token 更新到本地存储
          setToken(newTokenObj)

          // 重新请求之前发起的请求
          // 【注意】请求错误时返回的 response中的 config 中包含本次请求相关的所有信息
          return http(error.response.config)
          // 【注意】http({method: '', url: '', ...}) 中的对象就是 response.config
        } catch (error) {
          // 换取新token失败, 跳转登录页
          // react-router 在组件中使用 useHistory
          // -- 而在独立的工具函数JS文件中，需要使用：独立创建的 history对象
          console.log('>>>> refresh_token 刷新token失败直接跳转到登陆页面');
          history.replace('/login')
          // 清理无效的 Token
          setToken({
            token: '',
            refresh_token: ''
          })
        }
      } else {
        // 直接跳转到登陆页面...
        console.log('>>>>直接跳转到登陆页面');
        history.replace('/login')
      }
    }

    // 2、有 response 信息的情况下，使用响应数据中的错误信息进行提示
    Toast.show({
      content: error.response.data.message // 给 error再添加泛型message字段
      //   icon: 'fail'
    })
    return Promise.reject(error)
  }
)
export default http
