import { ArticleDetailPage } from '@/types/data'
import { RootAction } from '@/types/store'
import { getKeywords } from '@/utils/keyword'

type SearchState = {
  // 建议列表
  suggestions: string[]
  // 历史关键字
  keywords: string[]
  // 搜索结果
  searchPage: ArticleDetailPage
}
const initState: SearchState = {
  suggestions: [],
  keywords: getKeywords(),
  searchPage: {
    page: 1,
    per_page: 10,
    total_count: 0,
    results: [],
  },
};

export function searchReducer(
  state: SearchState = initState,
  action: RootAction
): any {
  if (action.type === 'search/set_search_suggestions') {
    return {
      ...state,
      suggestions: action.payload
    }
  }
  if (action.type === 'search/set_keywords') {
    return {
      ...state,
      keywords: action.payload
    }
  }
  if (action.type === 'search/set_search_page') {
    return {
      ...state,
      searchPage: action.payload
    }
  }

  return state
}
