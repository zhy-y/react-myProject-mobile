import React, { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import './App.scss'
import AuthRoute from './components/AuthRoute'
import KeepAlive from './components/KeepAlive'
import Article from './pages/Home/Article'
import Chat from './pages/Profile/Chat'
import ProfileEdit from './pages/Profile/Edit'
import SearchPage from './pages/Search'
import Result from './pages/Search/Result'
// 1、实现React的路由懒加载需要动态导入：使用 React.lazy(() => import('./xx'))
const Layout = React.lazy(() => import('@/pages/Layout'))
const Login = React.lazy(() => import('@/pages/Login'))

function App() {
  return (
    <div className="app">
      {/* KeepAlive 不能用 Switch 包裹 -- switch只匹配一个路由 */}
      <KeepAlive path={'/home'}>
        <Layout />
      </KeepAlive>

      {/* 2、路由懒加载组件 Suspense，fallback={loading信息} */}
      <Suspense fallback={<span>正在加载中...</span>}>
        <Switch>
          {/* 定义路由规则 -- Redirect 的三种用法 */}
          <Redirect path="/" exact to={'/home'}></Redirect>
          {/* <Route path='/' exact>
          <Redirect to={'/home'}></Redirect>
        </Route> */}
          {/* <Route
            path="/"
            exact
            render={() => {
              // 路径匹配后，可以执行一些复杂逻辑判断，并决定最后要渲染什么内容
              return <Redirect to={'/home'}></Redirect>
            }}
          ></Route> */}
          {/* Layout 组件中包含子路由，需要去掉exact，实行模糊匹配 */}
          {/* <Route path={'/home'} component={Layout}></Route> */}

          <Route path={'/login'} exact component={Login}></Route>
          {/* 路由鉴权： 先执行 render  ==>  component  */}
          {/* <Route path={'/profile/edit'} exact render={(props: any) => {
            console.log(props)  // {history: {…}, location: {…}, match: {…}, staticContext: undefined}
            // 判断有没有token，有token才渲染 ProfileEdit 组件
            if(hasToken()){
              return <ProfileEdit/>
            }
            // 没有token，跳转首页
            else{
              // props.history.replace('/login')
              return <Redirect to={'/login'} />
            }
          }} ></Route> */}

          {/* 封装自定义路由鉴权组件 -- 使用component属性 */}
          {/* <AuthRoute path={'/profile/edit'} exact component={ProfileEdit}></AuthRoute> */}
          {/* 封装自定义路由鉴权组件 -- 使用 children属性 */}
          <AuthRoute path={'/profile/edit'} exact>
            <ProfileEdit />
          </AuthRoute>

          <AuthRoute path={'/chat'} exact>
            <Chat />
          </AuthRoute>

          <Route path={'/article/:id'} component={Article} />

          <Route path={'/search'} component={SearchPage} />

          <Route path={'/search-result'} component={Result} />
        </Switch>
      </Suspense>
    </div>
  )
}

export default App
