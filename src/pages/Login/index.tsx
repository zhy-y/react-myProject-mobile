// 样式文件 添加 .module --- 即只对当前的组件生效 -- (CSS Module 工具的规范)
import styles from './index.module.scss'
import { Button, Form, Input, List, NavBar, Toast } from 'antd-mobile'
// import Icon from '@/components/Icon'
import { useHistory, useLocation } from 'react-router-dom'
import { LoginForm } from '@/types/data'

import { loginActionCreator } from '@/store/actions/login'
import { useDispatch } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { InputRef } from 'antd-mobile/es/components/input'
import { sendCode } from '@/services/login'
// import { AxiosError } from 'axios'
// console.log(styles) // {选择器：随机样式名}格式 {div1: 'Login_div1__2BQr7', div2: 'Login_div2__7pSQ-'}

const Layout = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const location = useLocation<{ url: string }>()

  // 点击登录
  const login = async (values: LoginForm) => {
    console.log(values)

    try {
      await dispatch(loginActionCreator(values))
      // 显示登录提示弹框
      Toast.show({
        content: '登录成功！',
        duration: 1000,
        afterClose: () => {
          // 从跳转信息中获取 state中携带的 url
          // const url = location.state?.url
          // console.log(location);
          if (location.state) {
            // 跳回之前的页面 --获取动态路由参数 state
            history.replace(location.state.url)
          } else {
            history.push('/home')
          }
        }
      })
    } catch (e) {
      console.log('ERROR:', e) // AxiosError{...}
      // const error = e as AxiosError
      Toast.show({
        content: '登录失败，请检查手机号或验证码是否正确',
        icon: 'fail'
      })
    }
  }

  // 1、通过 非受控方式获取组件的值 -- 创建 ref 引用
  const mobileInputRef = useRef<InputRef>(null)
  // 2.1 创建对 Form 表单的引用 -- 并绑定到对应的form实例上
  const [form] = Form.useForm()
  // 倒计时秒数状态
  const [seconds, setSeconds] = useState<number>(0)
  // 使用 useRef() 缓存数据：定时器 timerId，不能使用 useState() ，因为state变换组件会重新渲染
  //  -- 且不会因为 useRef 的值变化引起组件重新渲染
  const timerId = useRef<number>(-1)
  // 发送验证码
  const getCode = async () => {
    if (seconds > 0) return
    // ---- 获取手机号 ---
    // mobileInputRef.current?.nativeElement 拿到原生的 input
    // const mobile = mobileInputRef.current?.nativeElement?.value
    // 2.2 再给Form表单设置该属性
    const mobile = form.getFieldValue('mobile')
    console.log(mobile)
    // --- 1、获取手机号输入框是否验证成功 ---
    const error = form.getFieldError('mobile')
    // console.log(error) // ['手机号格式错误！']
    // --- 2、手机号没有填写或错误，则自动聚焦 ---
    if (!mobile || error.length > 0) {
      mobileInputRef.current?.focus()
      return
    }
    // --- 3、调用发送验证码接口 ---
    await sendCode(mobile)
    // --- 4、启动倒计时 ---
    setSeconds(60)
    timerId.current = window.setInterval(() => {
      // console.log('>>> seconds', seconds) // seconds 一直是 0
      // setSeconds(seconds - 1) // 由于闭包的作用，这里的seconds总是0
      // 使用 箭头函数可以使, 不直接使用闭包里面的 seconds 的方式去更新
      //  --- 拿到最新的值
      setSeconds((s) => {
        // if(s <= 0) {     // 或 使用 useEffect()
        //   clearInterval()
        // }
        // console.log('+++ seconds', s)
        return s - 1
      })
    }, 1000)
  }

  useEffect(() => {
    if (seconds <= 0) {
      clearInterval(timerId.current)
      // 【注意】定时器 id 不能在外部和组件上面 let 定义，因为每次更新组件会重置
    }
  }, [seconds])
  useEffect(() => {
    // 在组件销毁时，执行对定时器的清理
    return () => {
      clearInterval(timerId.current)
    }
  }, [])

  return (
    <div className={styles.root}>
      {/* 顶部导航栏 */}
      <NavBar
        onBack={() => {
          history.go(-1)
        }}
      ></NavBar>
      {/* 表单 */}
      <div className="login-form">
        <h2 className="title">短信登录</h2>

        <Form onFinish={login} form={form}>
          <Form.Item
            className="login-item"
            name="mobile"
            rules={[
              { required: true, message: '手机号不能为空！' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误！' }
            ]}
            validateTrigger={['onChange', 'onBlur']}
          >
            <Input ref={mobileInputRef} placeholder="请输入手机号"></Input>
          </Form.Item>

          <List.Item
            className="login-code-extra"
            extra={
              <span className="code-extra" onClick={getCode}>
                {seconds > 0 ? `${seconds}s后重新获取` : '获取验证码'}
              </span>
            }
          >
            <Form.Item
              className="login-item"
              name="code"
              rules={[
                { required: true, message: '请输入验证码！' },
                { pattern: /^\d{6}$/, message: '验证码错误！' }
              ]}
              validateTrigger={['onChange', 'onBlur']}
            >
              <Input placeholder="请输入验证码"></Input>
            </Form.Item>
          </List.Item>

          <Form.Item>
            <Button
              color="primary"
              block
              type="submit"
              className="login-submit"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
export default Layout
