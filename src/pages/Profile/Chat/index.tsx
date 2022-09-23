import Icon from '@/components/Icon'
import { NavBar, Input } from 'antd-mobile'
import { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styles from './index.module.scss'
import classnames from 'classnames'
import { useSelector } from 'react-redux'
import { RootState } from '@/types/store'
import { UserBasicInfo } from '@/types/data'
// 导入 socket.ip-client 库，用于和 socket.io 服务器进行连接
import io, { Socket } from 'socket.io-client'
import { getToken } from '@/utils/token'

// 每条聊天信息的格式
type ChatMessage = {
  type: 'robot' | 'user'
  text: string
}

// 前后端间发送的数据类型
type ExchangeMessage = {
  msg: string
  timestamp: number
}

const Chat = () => {
  const history = useHistory()

  // 消息列表
  const [messages, setMessages] = useState<ChatMessage[]>([
    { type: 'user', text: 'yyy' },
    { type: 'robot', text: 'xxx' },
    { type: 'user', text: 'zzz' }
  ])

  // 输入框中的内容
  const [newMessage, setNewMessage] = useState<string>('')

  const userBasicInfo = useSelector<RootState, UserBasicInfo>((state) => {
    return state.profile.userBasicInfo
  })

  // 使用 useRef() 存储 socket 缓存变量
  const socketRef = useRef<Socket | null>(null)

  // 1、一进页面就建立websocket连接
  useEffect(() => {
    const socket = io('http://toutiao.itheima.net', {
      transports: ['websocket'],
      query: {
        token: getToken().token
      }
    })

    // 2、socket 类似事件监听器 -- 监听 connect 事件
    socket.on('connect', () => {
      console.log('>>> 和服务器建立 websocket 连接')

      // 2.1 向服务端发送数据 -- 事件名message、组装参数
      socket.emit('message', {
        msg: '今天天气怎样？',
        timestamp: Date.now()
      })
    })

    // 3、监听服务端返回的数据
    socket.on('message', (data: ExchangeMessage) => {
      console.log('>>>后端返回了数据', data)
      // 这里不能直接使用 message 状态，会导致 socekt.io 的连接重新创建
      // 【注意】状态更新问题 --- 但是不能设置依赖项！！！每次更新message，useEffect中的逻辑都会循环执行
      // 解决方案：使用状态更新函数的参数为箭头函数形式
      setMessages((messages) => [
        ...messages,
        { type: 'robot', text: data.msg }
      ])
    })

    // 重新绑定socket供外部使用 --  current 是个只读类型 -- 同时设置 null类型
    socketRef.current = socket
  }, [])

  const listRef = useRef<HTMLDivElement>(null)

  // 【注意】不能直接在 发送数据后就更新滚动距离，因为那时候DOM没有渲染完
  // 要使用 useEffect() 在数据变化后且DOM渲染完后才更新页面变化
  useEffect(() => {
    // 每次message发生变化并渲染DOM后才执行
    if (listRef.current) {
      // 方式一：计算出精确高度差值：scrollTop 向上滚动的距离 = 容器的内容高度
      listRef.current.scrollTop = listRef.current.scrollHeight - listRef.current.offsetHeight;
      
      // 方式二：给出一个比实际滚动值更大的高度
      // listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className={styles.root}>
      {/* 顶部导航栏 */}
      <NavBar className="fixed-header" onBack={() => history.go(-1)}>
        小智同学
      </NavBar>

      {/* 聊天记录列表 */}
      <div className="chat-list" ref={listRef}>
        {/* 机器人的消息 */}
        {/* <div className="chat-item">
          <Icon name="iconbtn_xiaozhitongxue" />
          <div className="message">你好！</div>
        </div> */}

        {/* 用户的消息 */}
        {/* <div className="chat-item user">
          <img src={'http://toutiao.itheima.net/images/user_head.jpg'} alt="" />
          <div className="message">你好？</div>
        </div> */}

        {messages.map((msg, index) => {
          return (
            <div
              key={index}
              className={classnames('chat-item', { user: msg.type === 'user' })}
            >
              {msg.type === 'robot' && <Icon name="iconbtn_xiaozhitongxue" />}
              {msg.type === 'user' && <img src={userBasicInfo.photo} alt="" />}
              <div className="message">{msg.text}</div>
            </div>
          )
        })}
      </div>

      {/* 底部消息输入框 */}
      <div className="input-footer">
        <Input
          className="no-border"
          placeholder="请描述您的问题"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.trim()) // 受控组件存输入的数据
          }}
          onKeyUp={(e) => {
            // console.log(e)
            // console.log(newMessage)
            if (e.key === 'Enter') {
              socketRef.current?.emit('message', {
                msg: newMessage,
                timestamp: Date.now()
              } as ExchangeMessage)
              // 将发送的消息添加到聊天消息中
              setMessages([...messages, { type: 'user', text: newMessage }])
              // 清空输入框
              setNewMessage('')
            }
          }}
        />
        <Icon name="iconbianji" className="charticon" />
      </div>
    </div>
  )
}

export default Chat
