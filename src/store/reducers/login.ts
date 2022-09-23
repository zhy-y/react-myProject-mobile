import { LoginAction, LoginState } from "@/types/store"
// 初始状态
const initState: LoginState = {
  token: {
    token: '',
    refresh_token: ''
  }
}

// 返回值就是 state 的类型
export function loginReducer(
  state = initState,
  action: LoginAction
): LoginState {
    // 更新token信息
  if (action.type === 'login/set_token') {
    return {
      ...state,
      token: action.payload
    }
  }
  return state
}
