import { getArticleList, getArticleRefreshList } from '@/store/actions/article'
import { ArticleItemDataPage } from '@/types/data'
import { RootState } from '@/types/store'
import { InfiniteScroll, PullToRefresh } from 'antd-mobile'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import ArticleItem from '../ArticleItem'
import styles from './index.module.scss'

type ArticleListProps = {
  channelId: number
}

const ArticleList = ({ channelId }: ArticleListProps) => {
  const dispatch = useDispatch()
  const history = useHistory()
  // 从store中获取指定频道id 的文章数据
  const channelAricles = useSelector<RootState, ArticleItemDataPage>(
    (state) => {
      return state.article.channelAricles[channelId]
    }
  )

  return (
    <div className={styles.root}>
      {/* 下拉刷新 -- PullRoRefresh 组件将列表包裹起来，监听 onRefresh事件，
        在事件函数中重新请求最新一夜页的数据进行覆盖 */}
      <PullToRefresh onRefresh={ async () => {
         console.log('>>>下拉了');
         await dispatch(getArticleRefreshList(channelId))
      }} >
        {/* 文章列表中的每一项 */}
        <div className="article-item">
          {channelAricles?.results?.map((article) => {
            return (
              <ArticleItem
                key={article.art_id + '' + Math.random()}
                article={article}
                type={article.cover.type}
                onClick={() => {
                  // 跳转到文章详情页
                  history.push(`/article/${article.art_id}`)
                }}
              />
            )
          })}
        </div>

        {/* 触底加载 */}
        <InfiniteScroll
          // 是否要触发 loadMore，如果上一次请求回来的数据的 pre_timestamp 为 null 就代表没有数据了
          hasMore={!!channelAricles?.pre_timestamp}
          // 触底后触发的加载函数
          loadMore={async () => {
            // console.log('>>>', Date.now());
            await dispatch(
              getArticleList(channelId, channelAricles?.pre_timestamp)
            )
          }}
        ></InfiniteScroll>
      </PullToRefresh>
    </div>
  )
}

export default ArticleList
