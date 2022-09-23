import Icon from '@/components/Icon'
import { ArticleInfo } from '@/types/data'
import styles from './index.module.scss'

type Props = {
  // normal 普通评论
  // reply 回复评论
  type?: 'normal' | 'reply'
  article: ArticleInfo

  onLiking?: (attitude: number) => void
  onCollecting?: (isCollected: boolean) => void
  onComment?: () => void
  onCommentInput?: () => void
}

const CommentFooter = ({
  type = 'normal',
  article,
  
  onLiking,
  onCollecting,
  onComment,
  onCommentInput
}: Props) => {
  return (
    <div className={styles.root}>
      <div className="input-btn" onClick={onCommentInput}>
        <Icon name="iconbianji" />
        <span>抢沙发</span>
      </div>

      {type === 'normal' && (
        <>
          <div className="action-item" onClick={onComment}>
            <Icon name="iconbtn_comment" />
            <p>评论</p>
            {article.comm_count > 0 && (
              <span className="bage">{article.comm_count}</span>
            )}
          </div>
          <div
            className="action-item"
            onClick={() => {
              onLiking?.(article.attitude)
            }}
          >
            <Icon
              name={
                article.attitude === 1 ? 'iconbtn_like_sel' : 'iconbtn_like2'
              }
            />
            <p>点赞</p>
          </div>
          <div
            className="action-item"
            onClick={() => {
              onCollecting?.(article.is_collected)
            }}
          >
            <Icon
              name={
                article.is_collected ? 'iconbtn_collect_sel' : 'iconbtn_collect'
              }
            />
            <p>收藏</p>
          </div>
        </>
      )}

      {type === 'reply' && (
        <div className="action-item">
          <Icon
            name={article.attitude === 1 ? 'iconbtn_like_sel' : 'iconbtn_like2'}
          />
          <p>点赞</p>
        </div>
      )}

      <div className="action-item">
        <Icon name="iconbtn_share" />
        <p>分享</p>
      </div>
    </div>
  )
}

export default CommentFooter
