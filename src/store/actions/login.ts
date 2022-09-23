import { LoginForm, ResponseResult, Token } from '@/types/data'
import { LoginAction, RootThunkAction } from '@/types/store'
import http from '@/utils/request'
import { setToken } from '@/utils/token'

export const loginActionCreator = (loginForm: LoginForm): RootThunkAction => {
  return async (dispatch) => {
    // 网络请求
    const res = await http.post<ResponseResult<Token>>(
      '/authorizations',
      loginForm
    )
    // console.log(res.data.data.token)

    const token = res.data.data
    // 将获取的 token信息，存储到 redux
    dispatch({
      type: 'login/set_token',
      payload: token
    } as LoginAction)

    // 将 token 存储到本地
    setToken(token)
  }
}
