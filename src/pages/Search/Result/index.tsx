import { useHistory, useLocation } from 'react-router-dom'
import { InfiniteScroll, NavBar } from 'antd-mobile'

import styles from './index.module.scss'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSearchResult } from '@/store/actions/search'
import { RootState } from '@/types/store'
import { ArticleDetailPage } from '@/types/data'
import ArticleItem from '@/pages/Home/ArticleItem'

const Result = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  // history.push({pathname: xxx, state: {xx}})
  //  -- 获取 state 中的参数时： useLocation() -- location.state.xx
  // 获取URL的 ？ 查询参数 -- useLocation -- location.search
  // 获取动态路由参数 :开头的 --- useParams
  const location = useLocation()
  // console.log(location.search) // ?keyword=postMessage
  // 通过原生方式获取 URL 中问号携带的参数
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  )
  // const params = new URLSearchParams(location.search)
  // console.log(params.get('keyword'));

  const searchPage = useSelector<RootState, ArticleDetailPage>((state) => {
    return state.search.searchPage
  })

  // console.log(params.get('keyword'))
  useEffect(() => {
    const keyword = params.get('keyword') || ''
    dispatch(getSearchResult(1, keyword))
  }, [dispatch, params])

  return (
    <div className={styles.root}>
      <NavBar onBack={() => history.go(-1)}>搜索结果</NavBar>
      <div className="article-list">
        <div className="article-item">
          {searchPage?.results.map((item) => {
            return (
              <ArticleItem
                type={item.cover.type}
                article={item}
                onClick={() => {
                  history.push(`/article/${item.art_id}`)
                }}
              />
            )
          })}
          <InfiniteScroll
            hasMore={searchPage.results.length !== searchPage.total_count}
            loadMore={async () => {
              dispatch(
                getSearchResult(
                  searchPage.page + 1,
                  params.get('keyword') || ''
                )
              )
            }}
          ></InfiniteScroll>
        </div>
      </div>
    </div>
  )
}

export default Result
