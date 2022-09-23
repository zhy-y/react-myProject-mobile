import Icon from '@/components/Icon'
import { getArticleList } from '@/store/actions/article'
import {
  getAllChannels,
  getUserChannels,
  updateUserChannels
} from '@/store/actions/channel'
import { Channel } from '@/types/data'
import { CurrentChannelAction, RootState } from '@/types/store'
import { Popup, Tabs } from 'antd-mobile'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import ArticleList from './ArticleList'
import Channels from './Channels'
import styles from './index.module.scss'

const Tab = Tabs.Tab

const Home = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    // 发请求获取频道列表并存入store
    dispatch(getUserChannels())
    // 发请求获取所有频道数据
    dispatch(getAllChannels())
  }, [dispatch])

  // 获取 store 中的频道数据
  const userChannels = useSelector<RootState, Channel[]>((state) => {
    return state.channel.userChannels
  })

  const [channelMangerShow, setChannelMangerShow] = useState<boolean>(false)

  const currentChannelId = useSelector<RootState, number>((state) => {
    return state.channel.currentChannelId
  })

  // 设置默认激活频道
  useEffect(() => {
    const defaultSelectChannelId = userChannels[0]?.id
    dispatch({
      type: 'channel/set_current_channel',
      payload: defaultSelectChannelId
    } as CurrentChannelAction)
  }, [userChannels, dispatch])

  // 获取当前频道的信息
  useEffect(() => {
    // console.log('+++currentChannelId:', currentChannelId);
    dispatch(getArticleList(currentChannelId, Date.now().toString()))
  }, [currentChannelId, dispatch])

  return (
    <div className={styles.root}>
      {/* 频道 Tabs 列表 */}
      <Tabs
        className="tabs"
        activeLineMode={'auto'}
        activeKey={'' + currentChannelId}
        onChange={(key: string) => {
          // console.log(key);  // 频道id
          dispatch({
            type: 'channel/set_current_channel',
            payload: +key
          } as CurrentChannelAction)
        }}
      >
        {userChannels.map((ch) => {
          return (
            // 【注意】activeName 只支持字符类型，且必须和key 一样才能控制
            <Tab title={ch.name} key={'' + ch.id}>
              <ArticleList channelId={ch.id} />
            </Tab>
          )
        })}
      </Tabs>

      <div className="tabs-opration">
        <Icon name="iconbtn_search" onClick={() => {
          history.push('/search')
        }} />
        <Icon
          name="iconbtn_channel"
          onClick={() => {
            setChannelMangerShow(true)
          }}
        />
      </div>
      <Popup visible={channelMangerShow} position={'right'}>
        <div style={{ width: '100vw' }}>
          <Channels
            onClose={() => {
              setChannelMangerShow(false)
            }}
            onSelect={(id) => {
              // console.log(id);
              // 将激活的 频道 存入store
              dispatch({
                type: 'channel/set_current_channel',
                payload: id
              } as CurrentChannelAction)

              // 关闭频道管理弹出框
              setChannelMangerShow(false)
            }}
            onRecommendSelect={(channel: Channel) => {
              dispatch(updateUserChannels(channel))
            }}
          ></Channels>
        </div>
      </Popup>
    </div>
  )
}

export default Home
