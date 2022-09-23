import Icon from '@/components/Icon'
import KeepAlive from '@/components/KeepAlive'
import { TabBar } from 'antd-mobile'
import { Route, Switch, useHistory, useLocation } from 'react-router-dom'
import Home from '../Home'
import Profile from '../Profile'
import Question from '../Question'
import Video from '../Video'
import styles from './index.module.scss'

const Layout = () => {
  // 标签页数据
  const tabs = [
    { path: '/home', icon: 'iconbtn_home', text: '首页' },
    { path: '/home/question', icon: 'iconbtn_qa', text: '问答' },
    { path: '/home/video', icon: 'iconbtn_video', text: '视频' },
    { path: '/home/profile', icon: 'iconbtn_mine', text: '我的' }
  ]

  const history = useHistory()
  const location = useLocation()

  const onTabChange = (key: string) => {
    console.log(key) // 绑定的key -- path
    history.push(key)
  }

  return (
    <div className={styles.root}>
      <KeepAlive path={'/home'} exact>
        <Home />
      </KeepAlive>
      {/* 路由视口 -- Layout页面的子路由 */}
      <Switch>
        {/* <Route path={'/home'} exact component={Home} /> */}
        <Route path={'/home/question'} component={Question} />
        <Route path={'/home/video'} component={Video} />
        <Route path={'/home/profile'} component={Profile} />
      </Switch>
      {/* 使用 antd 的 TabBar组件，并指定类名：tab-bar */}
      <TabBar
        className="tab-bar"
        // ativeKey={tabs[0].path}
        activeKey={location.pathname}
        onChange={onTabChange}
      >
        {tabs.map((tab) => {
          return (
            <TabBar.Item
              key={tab.path}
              title={tab.text}
              icon={(active) => {
                return (
                  <Icon
                    name={active ? `${tab.icon}_sel` : tab.icon}
                    className="tab-bar-item-icon"
                  />
                )
              }}
            ></TabBar.Item>
          )
        })}
      </TabBar>
    </div>
  )
}

export default Layout
