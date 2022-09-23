import { useRemoteData } from '@/hooks/useRemoteData'
import {
  getUserDetailInfo,
  updateUserDetailInfo,
  uploadUserPhoto
} from '@/store/actions/profile'

import {
  Button,
  List,
  DatePicker,
  NavBar,
  Popup,
  Toast,
  Dialog
} from 'antd-mobile'
import classNames from 'classnames'
import { ChangeEvent, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import EditInput from '../EditInput'
// import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import styles from './index.module.scss'
import EditList from '../EditList'
import dayjs from 'dayjs'
import { Action } from 'antd-mobile/es/components/dialog'
import { LoginAction } from '@/types/store'
import { Token } from '@/types/data'
import { removeToken } from '@/utils/token'

// 为 List.Item 取别名
const Item = List.Item
type Popup1ControlData = {
  visible: boolean
  type: '' | 'name' | 'intro'
}

type Popup2Status = {
  visible: boolean
  type: '' | 'photo' | 'gender'
}

const ProfileEdit = () => {
  const history = useHistory()
  const dispatch = useDispatch()

  // // 页面一进来就异步请求数据并dispatch存入仓库
  // useEffect(() => {
  //   dispatch(getUserDetailInfo())
  // }, [dispatch])

  // // 从仓库取值
  // const userDetailInfo = useSelector<RootState, UserDetailInfo>((state) => {
  //   return state.profile.userDetailInfo
  // })

  const { userDetailInfo } = useRemoteData(getUserDetailInfo).profile

  const [popup1Status, setPopup1Status] = useState<Popup1ControlData>({
    visible: false, // 控制弹出框的布尔值
    type: '' // 正在修改的字段名
  })

  const [Popup2Status, setPopup2Status] = useState<Popup2Status>({
    visible: false,
    type: ''
  })

  const [birthdayVisible, setBirthdayVisible] = useState<boolean>(false)

  // 引用文件上传标签
  const fileRef = useRef<HTMLInputElement>(null)
  const fileChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    // 1、获取上传的文件对象
    const file = e.target.files?.[0]
    console.log(file)
    // 2、拼装 FormData 准备上传
    const formData = new FormData()
    formData.append('photo', file!)
    console.log(formData)
    // 3、进行上传
    await dispatch(uploadUserPhoto(formData))
    setPopup2Status({ type: '', visible: false })
    // 清空 -- 防止重复不能触发change事件
    e.target.value = ''
  }

  // 退出登录
  const logoutHandler = () => {
    // 1、弹出框确认提示框，让用户确认是否真要登出
    Dialog.show({
      content: '您确认要退出吗？',
      closeOnAction: true,
      actions: [
        [
          {
            key: 'cancel',
            text: '取消'
          },
          {
            key: 'ok',
            text: '确认'
          }
        ]
      ],
      // 监听对话框上按钮的点击事件
      onAction: (action: Action, index: number) => {
        console.log(action, index)
        if (action.key === 'ok') {
          // 2、清空token(store, localStorage)
          dispatch({
            type: 'login/set_token',
            payload: {
              token: '',
              refresh_token: ''
            } as Token
          } as LoginAction)
          removeToken()
          // 3、跳转登录页
          history.push('/login')
        }
      }
    })
  }

  return (
    <div className={styles.root}>
      <div className="content">
        {/* 标题 -- 覆盖样式 */}
        <NavBar
          style={{
            '--border-bottom': '1px solid #F0F0F0'
          }}
          onBack={() => history.go(-1)}
        >
          个人信息
        </NavBar>

        <div className="wrapper">
          {/* 列表 */}
          <List className="profile-list">
            {/* 列表项 */}
            <Item
              extra={
                <span className="avatar-wrapper">
                  <img
                    width={24}
                    height={24}
                    src={userDetailInfo.photo}
                    alt=""
                  />
                </span>
              }
              arrow
              onClick={() => setPopup2Status({ visible: true, type: 'photo' })}
            >
              头像
            </Item>
            <input
              type="file"
              ref={fileRef}
              hidden
              onChange={fileChangeHandler}
            />
            <Item
              arrow
              extra={userDetailInfo.name}
              onClick={() => {
                setPopup1Status({ visible: true, type: 'name' })
              }}
            >
              昵称
            </Item>
            <Item
              arrow
              extra={
                <span className={classNames('intro', 'normal')}>
                  {userDetailInfo?.intro || '未填写'}
                </span>
              }
              onClick={() => {
                setPopup1Status({ visible: true, type: 'intro' })
              }}
            >
              简介
            </Item>
          </List>

          <List className="profile-list">
            <Item
              arrow
              extra={userDetailInfo.gender === 0 ? '男' : '女'}
              onClick={() => setPopup2Status({ visible: true, type: 'gender' })}
            >
              性别
            </Item>
            <Item
              arrow
              extra={userDetailInfo.birthday}
              onClick={() => {
                setBirthdayVisible(true)
              }}
            >
              生日
            </Item>
          </List>

          <DatePicker
            visible={birthdayVisible}
            value={new Date()}
            title="选择年月日"
            min={new Date(1900, 0, 1, 0, 0, 0)}
            max={new Date()}
            // 点击取消按钮
            onCancel={() => setBirthdayVisible(false)}
            // 点击确定按钮
            onConfirm={async (value: Date) => {
              console.log(value)
              await dispatch(
                updateUserDetailInfo({
                  birthday: dayjs(value).format('YYYY-MM-DD')
                })
              )
              setBirthdayVisible(false)
            }}
          />
        </div>

        <div className="logout">
          <Button className="btn" onClick={logoutHandler}>
            退出登录
          </Button>
        </div>
      </div>

      {/* 弹出框组件 */}
      <Popup visible={popup1Status.visible} position="right" destroyOnClose>
        <div style={{ width: '100vw' }}>
          <EditInput
            type={popup1Status.type}
            onClose={() => {
              setPopup1Status({ visible: false, type: '' })
            }}
            onSubmit={async (type: string, val: string) => {
              console.log(val)

              // 执行异步更新请求
              await dispatch(
                updateUserDetailInfo({
                  // 将接受的type作为对象的键 -- 传递 -- 更新具体type类型的val
                  [type]: val
                })
              )
              Toast.show({
                content: '修改成功',
                icon: 'success'
              })
              setPopup1Status({ visible: false, type: '' })
            }}
          ></EditInput>
        </div>
      </Popup>

      {/* 头像 +  */}
      <Popup visible={Popup2Status.visible} position="bottom" destroyOnClose>
        <div>
          <EditList
            onClose={() => setPopup2Status({ visible: false, type: '' })}
            type={Popup2Status.type}
            onSubmit={async (type: string, val: number) => {
              // 如果选择的是性别
              if (type === 'gender') {
                // 调用用户详情信息的方法
                await dispatch(
                  updateUserDetailInfo({
                    [type]: val
                  })
                )
                Toast.show({
                  content: '修改成功',
                  icon: 'success'
                })
                setPopup2Status({ visible: false, type: '' })
              }
              // 如果选择的是上传图片
              else {
                fileRef.current?.click()
              }
            }}
          />
        </div>
      </Popup>
    </div>
  )
}

export default ProfileEdit
