import { UserDetailInfo } from '@/types/data'
import { RootState } from '@/types/store'
import { Input, NavBar, TextArea } from 'antd-mobile'
import { InputRef } from 'antd-mobile/es/components/input'
import { TextAreaRef } from 'antd-mobile/es/components/text-area'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import styles from './index.module.scss'
type EditInputProps = {
  onClose: () => void
  type: '' | 'name' | 'intro'
  onSubmit: (type: string, val: string) => void
}

const EditInput = ({ onClose, type, onSubmit }: EditInputProps) => {
  const userDetailInfo = useSelector<RootState, UserDetailInfo>((state) => {
    return state.profile.userDetailInfo
  })

  const [content, setContext] = useState<string>(() => {
    return type === 'name' ? userDetailInfo.name : userDetailInfo.intro
  })

  const onChange = (e: string) => {
    // console.log(e)
    setContext(e)
  }

  const inputRef = useRef<InputRef>(null)
  const textareaRef = useRef<TextAreaRef>(null)

  useEffect(() => {
    if (type === 'name') {
      inputRef.current?.focus()
    } else {
      textareaRef.current?.focus()
    }
  }, [type, inputRef, textareaRef])

  const commitUserInfo = () => {
    // 【注意】通用性的请求和异步存储store，都会集中到负组件中去一起做 --- 集中性好
    onSubmit(type, content)
  }

  return (
    <div className={styles.root}>
      <NavBar
        className="navbar"
        right={
          <span className="commit-btn" onClick={commitUserInfo}>
            提交
          </span>
        }
        onBack={onClose} // 子传父：调用父传子传递的方法
      >
        编辑{type === 'name' ? '昵称' : '简介'}
      </NavBar>

      <div className="edit-input-content">
        <h3>{type === 'name' ? '昵称' : '简介'}</h3>

        {type === 'name' ? (
          <div className="input-wrap">
            <Input
              placeholder="请输入昵称信息"
              value={content}
              onChange={onChange}
              ref={inputRef}
            />
          </div>
        ) : (
          <TextArea
            placeholder="请输入介绍信息"
            showCount
            maxLength={60}
            value={content}
            onChange={onChange}
            ref={textareaRef}
          />
        )}
      </div>
    </div>
  )
}

export default EditInput
