import { Token } from '@/types/data'
const TOKEN_KEY = '__token_98'

// 将 token 存入 localStorage
export const setToken = (token: Token) => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token))
}

// 从 localStorage 获取 token
export const getToken = (): Token => {
  return JSON.parse(localStorage.getItem(TOKEN_KEY) || '{}') as Token
}
// 删除token
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

// 判断是否有token -- 后期用于判断登录状态
export const hasToken = (): boolean => {
  return !!getToken().token
}
