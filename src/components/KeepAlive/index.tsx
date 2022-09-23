// 该组件的作用是，路径匹配 -- 类似 <Route /> 组件
// -- 路由跳转时，如果path 匹配到了就显示目标组件
// -- 如果没有匹配到，就 display: none 隐藏（不销毁）原来组件

// --------- keep-alive 的原理 ----------
// import { RouteProps, useLocation } from 'react-router-dom'

// const KeepAlive = ({ path, children }: RouteProps) => {
//   const location = useLocation()
//   console.log(location)

//   return (
//     // keep-alive 的原理：通过路径匹配决定组件内容的显示隐藏
//     // 根据浏览器中 location 路径 是否匹配path，显示隐藏 该组件内容
//     <div style={{ display: path === location.pathname ? 'block' : 'none' }}>
//       <h1>hello</h1>
//     </div>
//   )
// }

// export default KeepAlive
// --------- keep-alive 的原理 ----------


import { Route, RouteProps, useLocation } from 'react-router-dom'

const KeepAlive = ({ children, ...rest }: RouteProps) => {
  const location = useLocation()
  console.log(location) // {pathname: '/abc', search: '', hash: '', state: undefined}

  return (
    // 实际使用时 -- 借用 <Route />组件
    // -- Route 会动态创建销毁子元素
    // render() 和 children() 都是在路径匹配后渲染组件内容的方法
    // 【区别】
    // -- render() 会在路径匹配与否后，进行子元素的动态创建和销毁
    // -- children() 在 Route 组件一创建时，子元素就直接渲染出来了,即任何路径上时都存在于DOM树
    // -- 即无论路径匹配与否，直接渲染出子元素 ==> 需要通过style样式控制显示隐藏
    // render() 中能进行条件判断、渲染对应组件
    // render() -- 根据路径的匹配进行组件创建、销毁
    // 【注意】KeepAlive 不能用 Switch 包裹 -- switch只匹配一个路由
    <Route
      {...rest}
      children={(props) => {
        console.log(props) // 当前路径的信息
        // {history: {…}, location: {…}, match: {…}, staticContext: undefined}
        // 可以根据 props 中的路径信息 location 或 match 判断当前路径是否匹配

        return (
            <div style={{display: props.match ? 'block':'none'}} >
                {/* children 是函数形式返回的组件 - 或 JSX结构内容 */}
                {typeof children === 'function' ? children(props) : children}
            </div>
        )
      }}
    ></Route>
  )
}

export default KeepAlive
