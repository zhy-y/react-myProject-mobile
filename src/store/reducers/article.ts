import { ArticleInfo, ArticleItemDataPage } from '@/types/data'
import { RootAction } from '@/types/store'

type ArticleState = {
  // 每个频道所对应的文章列表
  channelAricles: {
    [key: number]: ArticleItemDataPage
    // 例如：键值对形式， key是id: {获取的频道id未1的数据}
    // 1: {
    //     pre_timestamp: '',
    //     results: [...]
    // },
    // 2: {
    //     pre_timestamp: '',
    //     results: [...]
    // },  ...
  },
  // 文章详情
  articleInfo: ArticleInfo
}

const initState: ArticleState = {
  channelAricles: {},
  articleInfo: {} as ArticleInfo  // 缺少类型强制转换
}

export function articleReducer(
  state: ArticleState = initState,
  action: RootAction
): ArticleState {
  if (action.type === 'article/set_channel_articles') {
    const id = action.payload.channelId
    return {
      ...state,
      channelAricles: {
        // 原先state中存储的其他频道列表的数据
        ...state.channelAricles,
        [id]: action.payload.data   // 请求回来的对应id的列表数据
      }
    }
  }
  if(action.type === 'article/set_article_info'){
    return {
      ...state,
      articleInfo: action.payload
    }
  }

  return state
}
