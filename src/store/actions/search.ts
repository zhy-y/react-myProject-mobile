import { ArticleDetailPage, ResponseResult } from '@/types/data'
import {
  RootThunkAction,
  SearchKeywordsAction,
  SearchResultPageAction,
  SearchSuggestionsAction
} from '@/types/store'
import { setKeywords } from '@/utils/keyword'
import http from '@/utils/request'

export const getSearchSuggestions = (keyword: string): RootThunkAction => {
  return async (dispatch, getState) => {
    if (!keyword) {
      dispatch({
        type: 'search/set_search_suggestions',
        payload: []
      } as SearchSuggestionsAction)
      return
    }
    // 调用接口吗，获取搜索建议
    const res = await http.get<ResponseResult<{ options: string[] }>>(
      'suggestion',
      {
        params: {
          q: keyword
        }
      }
    )
    if (!res.data.data.options) {
      dispatch({
        type: 'search/set_search_suggestions',
        payload: []
      } as SearchSuggestionsAction)
      return
    }
    // 将获取的数据存入 redux
    dispatch({
      type: 'search/set_search_suggestions',
      payload: res.data.data.options
    } as SearchSuggestionsAction)

    // // 将当前关键字，保存到 redux 和 localStorage 中
    // const keywords = [keyword, ...getState().search.keywords]
    // dispatch({
    //     type: 'search/set_keywords',
    //     payload: keywords
    // } as SearchKeywordsAction)

    // setKeywords(keywords)
  }
}

export const saveHistoryKeyword = (keyword: string): RootThunkAction => {
  return async (dispatch, getState) => {
    const keywords = [keyword, ...getState().search.keywords]

    // 去重操作
    const set = new Set(keywords)
    // console.log(set)    // Set(2) {'s', 'ss'}
    const newKeywords = Array.from(set) // 转为数组

    // 限制关键字数量
    if (newKeywords.length > 8) {
      newKeywords.pop()
    }

    dispatch({
      type: 'search/set_keywords',
      payload: newKeywords
    } as SearchKeywordsAction)

    setKeywords(newKeywords)
  }
}

export const getSearchResult = (
  page: number = 1,
  keyword: string
): RootThunkAction => {
  return async (dispatch, getState) => {
    // 请求搜索结果接口
    const res = await http.get<ResponseResult<ArticleDetailPage>>('search', {
      params: {
        page,
        per_page: 10,
        q: keyword
      }
    })

    // 拼接数据--- getState获取到旧数据
    const searchPage = getState().search.searchPage
    // 将结果过存入 redux store
    dispatch({
      type: 'search/set_search_page',
      payload: {
        page,
        per_page: searchPage.per_page,
        total_count: res.data.data.total_count,
        results: [...searchPage.results, ...res.data.data.results]
      }
    } as SearchResultPageAction)
  }
}
