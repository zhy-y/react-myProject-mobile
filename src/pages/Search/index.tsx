import classnames from 'classnames'
import { useHistory } from 'react-router'
import { NavBar, SearchBar } from 'antd-mobile'

import Icon from '@/components/Icon'
import styles from './index.module.scss'
import { useEffect, useState } from 'react'

import { useDebounceFn } from 'ahooks'
import { useDispatch, useSelector } from 'react-redux'
import {
  getSearchSuggestions,
  saveHistoryKeyword
} from '@/store/actions/search'
import {
  RootState,
  SearchKeywordsAction,
  SearchSuggestionsAction
} from '@/types/store'
import { setKeywords } from '@/utils/keyword'

const SearchPage = () => {
  const history = useHistory()
  const [keyword, setKeyword] = useState<string>('')
  const dispatch = useDispatch()

  // let isInputing = false // 节流阀
  // const timerRef = useRef<number>(-1)

  const keywords = useSelector<RootState, string[]>((state) => {
    return state.search.keywords
  })

  // --- ahooks 的 useDebounceFn: 防抖逻辑 ---
  // -- 导出 run 函数调用即可
  const { run } = useDebounceFn(
    () => {
      console.log('>>>防抖Input的值', keyword)
      dispatch(getSearchSuggestions(keyword))
    },
    { wait: 300 }
  )
  const suggestions = useSelector<RootState, string[]>((state) => {
    return state.search.suggestions
  })

  // 组件销毁 -- 清空推荐列表
  useEffect(() => {
    return () => {
      dispatch(getSearchSuggestions(''))
    }
  }, [dispatch])

  return (
    <div className={styles.root}>
      {/* 顶部导航栏 */}
      <NavBar
        className="navbar"
        onBack={() => history.go(-1)}
        right={
          <span
            className="search-text"
            onClick={() => {
              // 发请求...
              // 记录搜索关键字
              dispatch(saveHistoryKeyword(keyword))
              if (keyword) {
                // 跳转到搜索结果页
                history.push(`/search-result?keyword=${keyword}`)
              }
            }}
          >
            搜索
          </span>
        }
      >
        <SearchBar
          placeholder="请输入关键字搜索"
          value={keyword}
          onChange={(val: string) => {
            setKeyword(val.trim())
            // --- 节流 ---
            // if(isInputing) return
            // isInputing = true
            // // --- 防抖 ---
            // // 1、清理现有定时器。2、创建新的定时器
            // clearTimeout(timerRef.current)
            // timerRef.current = window.setTimeout(() => {
            //   console.log('>>>防抖Input的值', val.trim());
            //   isInputing = true
            //   // 发请求
            // }, 500)
            //  ---- 使用 ahooks 的 useDebounceFn 实现防抖逻辑
            if (val.trim()) {
              run()
            } else {
              // 清空搜索建议列表
              dispatch({
                type: 'search/set_search_suggestions',
                payload: []
              } as SearchSuggestionsAction)
            }
          }}
        />
      </NavBar>

      {/* 搜索历史区域 */}
      {suggestions.length <= 0 && (
        <div
          className="history"
          style={{
            display: false ? 'none' : 'block'
          }}
        >
          <div className="history-header">
            <span>搜索历史</span>
            <span
              onClick={() => {
                dispatch({
                  type: 'search/set_keywords',
                  payload: []
                } as SearchKeywordsAction)
                setKeywords([])
              }}
            >
              <Icon name="iconbtn_del" />
              清除全部
            </span>
          </div>

          <div className="history-list">
            {keywords.map((k, index) => {
              return (
                <span
                  className="history-item"
                  key={index}
                  onClick={() => {
                    dispatch(saveHistoryKeyword(k))

                    // 跳转到搜索结果
                    history.push(`/search-result?keyword=${k}`)
                  }}
                >
                  <span className="text-overflow">{k}</span>
                  <Icon name="iconbtn_essay_close" />
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* 搜索建议列表区域 */}
      <div
        className={classnames('search-result', {
          show: suggestions.length >= 0
        })}
      >
        {suggestions.map((item, index) => {
          return (
            <div
              className="result-item"
              key={index}
              onClick={() => {
                dispatch(saveHistoryKeyword(item))

                // 跳转到搜索结果
                history.push(`/search-result?keyword=${item}`)
              }}
            >
              <Icon className="icon-search" name="iconbtn_search" />
              {/* React中不能直接将花括号 {} 中的带标签的内容直接渲染，
                要使用 原生的dangerouslySetInnerHTML 语法设置带标签的内容 */}
              <div
                className="result-value text-overflow"
                dangerouslySetInnerHTML={{
                  __html: item?.replace(
                    new RegExp(`(${keyword})`, 'ig'),
                    `<span>${keyword}</span>`
                  )
                }}
              >
                {/* <span>黑马</span>
                程序员 */}
                {/* 生成内部是动态的正则: new RegExp() */}
                {/* {item.replace(
                  new RegExp(`(${keyword})`, 'ig'),
                  `<span>${keyword}</span>`
                )} */}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SearchPage
