import dayjs from 'dayjs'
import classnames from 'classnames'

import Icon from '@/components/Icon'

import styles from './index.module.scss'
import { Comment } from '@/types/data'

type Props = {
  // normal 普通 - 文章的评论
  // origin 回复评论的原始评论，也就是对哪个评论进行回复
  // reply 回复评论
  type?: 'normal' | 'reply' | 'origin'
  comment: Comment
  onReplay?: () => void
}

const CommentItem = ({
  // normal 普通
  // origin 回复评论的原始评论
  // reply 回复评论
  type = 'normal',
  comment,
  onReplay
}: Props) => {
  // 回复按钮
  const replyJSX =
    type === 'normal' ? (
      <span className="replay" onClick={onReplay} >
        {comment.reply_count} 回复
        <Icon name="iconbtn_right" />
      </span>
    ) : null

  return (
    <div className={styles.root}>
      <div className="avatar">
        <img src={comment.aut_photo} alt="" />
      </div>
      <div className="comment-info">
        <div className="comment-info-header">
          <span className="name">{comment.aut_name}</span>
          {/* 文章评论、评论的回复 */}
          {(type === 'normal' || type === 'reply') && (
            <span className="thumbs-up">
              {comment.like_count}
              <Icon
                name={comment.is_liking ? 'iconbtn_like_sel' : 'iconbtn_like2'}
              />
            </span>
          )}
          {/* 关注 */}
          {type === 'origin' && (
            <span
              className={classnames(
                'follow',
                comment.is_followed ? 'followed' : ''
              )}
            >
              {comment.is_followed ? '已关注' : '关注'}
            </span>
          )}
        </div>
        <div className="comment-content">{comment.content}</div>
        <div className="comment-footer">
          {replyJSX}
          {/* 非评论的回复 */}
          {type !== 'reply' && (
            <span className="comment-time">
              {dayjs(comment.pubdate).format('YYYY-MM-DD')}
            </span>
          )}
          {/* 文章的评论 */}
          {type === 'origin' && (
            <span className="thumbs-up">
              10000
              <Icon name={true ? 'iconbtn_like_sel' : 'iconbtn_like2'} />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommentItem