import { Redirect, Route, RouteProps } from 'react-router-dom'
import { hasToken } from '@/utils/token'
import { ComponentType } from 'react'

// ---- 封装自定义路由鉴权组件----
// Route 组件自己有 RouteProps属性，可以继承
// 解构明确的 props={ component, children, ...rest }，不明确的写后面
// 对象解构 + 重命名： 冒号语法
const AuthRoute = ({ component, children, ...rest }: RouteProps) => {
  // ComponentType类型的组件才能被标签调用
  const Component = component as ComponentType
  return (
    // props 包含跟当前页面的路径相关的信息
    <Route
      // rest 中不要包含 component 属性，因为它需要经过条件判断，才能决定是否渲染
      {...rest}
      render={(props) => {
        console.log(props)
        // {history: {…}, location: {…}, match: {…}, staticContext: undefined}
        if (hasToken()) {
          if (Component) {
            return <Component />
          }
          // children 的类型 可能是 JSX对象 或 函数形式返回的组件
          else if (typeof children === 'function') {
            return children(props)
          } else {
            return children // children 是JSX形式
          }
        }
        console.log({ ...rest })
        // {path: '/profile/edit', exact: true, location: {…}, computedMatch: {…}}

        // props.history.replace('/login')
        return (
          <Redirect
            to={{
              pathname: '/login',
              state: {
                url: props.location.pathname // 之前的路径
              }
            }}
          />
        )
      }}
    ></Route>
  )
}
export default AuthRoute
