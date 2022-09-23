import classnames from 'classnames'
import Icon from '@/components/Icon'
import styles from './index.module.scss'
import { ArticleItemData } from '@/types/data'
import dayjs from 'dayjs'
import Image from '../Img'

type ArticleItemProps = {
  /**
   * 0 表示无图
   * 1 表示单图
   * 3 表示三图
   */
  type?: 0 | 1 | 3
  article: ArticleItemData
  onClick?: () => void
}

const ArticleItem = ({ type = 0, article, onClick }: ArticleItemProps) => {
  return (
    <div className={styles.root} onClick={onClick}>
      <div
        className={classnames(
          'article-content',
          type === 3 && 't3',
          type === 0 && 'none-mt'
        )}
      >
        <h3>{article.title}</h3>
        {type !== 0 && (
          <div className="article-imgs">
            {article?.cover?.images?.map((img, index) => {
              return (
                <div className="article-img-wrapper" key={index}>
                  {/* <img src={img} alt="" /> */}
                  {/* 使用 图片懒加载的 组件 */}
                  <Image src={img}></Image>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <div className={classnames('article-info', type === 0 && 'none-mt')}>
        <span>{article.aut_name}</span>
        <span>{article.comm_count} 评论</span>
        <span>{dayjs(article.pubdate).fromNow()}</span>
        <span className="close">
          <Icon name="iconbtn_essay_close" />
        </span>
      </div>
    </div>
  )
}

export default ArticleItem
