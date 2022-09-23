import styles from './index.module.scss'
import { NavBar, TextArea } from 'antd-mobile'
import { useState } from 'react'
type Props = {
  // 评论的作者的名字
  name?: string
  onCommit: (content: string) => void
  onClose: () => void
}

export default function CommentInput({ name, onCommit, onClose }: Props) {
  const [content, setContent] = useState<string>('')

  return (
    <div className={styles.root}>
      {/* 顶部栏 */}
      <NavBar
        right={
          <span
            className="publish"
            onClick={() => {
              if (content) {
                onCommit(content)
              }
            }}
          >
            发表
          </span>
        }
        onBack={() => {
          onClose()
        }}
      >
        {name ? '回复评论' : '评论文章'}
      </NavBar>
      {/* 输入区域 */}
      <div className="input-area">
        {/* 回复别人的评论时显示：@某某 */}
        {name && <div className="at">@{name}:</div>}

        {/* 评论内容输入框 */}
        <TextArea
          placeholder="说点什么~"
          rows={10}
          value={content}
          onChange={(val: string) => {
            setContent(val.trim())
          }}
        />
      </div>
    </div>
  )
}
