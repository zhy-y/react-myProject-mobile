import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import App from '@/App'
import store from './store'

// 导入路由管理包
// import { HashRouter as Router } from 'react-router-dom'
import { Router } from 'react-router-dom'
import { Provider } from 'react-redux'

// 导入独立创建的 history对象
import history from '@/router'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
// 显示dayjs中文
dayjs.locale('zh-cn')
// 启用 fromNow 插件 -- 可以让日期显示成（相对于xx天之前）
dayjs.extend(relativeTime)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <Provider store={store}>
    {/* history 是由 history包提供的-- react-router V5.x 中不需要自己下载 */}
    <Router history={history}>
      <App />
    </Router>
  </Provider>
)
