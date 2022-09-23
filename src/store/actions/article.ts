import { ArticleInfo, ArticleItemDataPage, ResponseResult } from '@/types/data'
import { ArticleInfoAction, ChannelArticleAction, RootThunkAction } from '@/types/store'
import http from '@/utils/request'

export const getArticleList = (
  channelId: number = 0,
  timestamp: string
): RootThunkAction => {
  return async (dispatch, getState) => {
    // 忽略频道id= -1、null、undefined
    if (channelId < 0) return
    const res = await http.get<ResponseResult<ArticleItemDataPage>>(
      '/articles',
      {
        params: {
          channel_id: channelId,
          timestamp: timestamp
        }
      }
    )
    // console.log('>>>获取到的文章列表data:', res.data.data)

    // 根据频道id 和 获取到的文章列表存入store
    const newResults = [
      ...(getState().article.channelAricles[channelId]?.results || []),
      ...res.data.data.results
    ]

    dispatch({
      type: 'article/set_channel_articles',
      payload: {
        channelId,
        data: {
          pre_timestamp: res.data.data.pre_timestamp, // 更新上一次请求的时间戳
          results: newResults
        }
      }
    } as ChannelArticleAction)
  }
}

export const getArticleRefreshList = (
  channelId: number = 0,
): RootThunkAction => {
  return async (dispatch) => {
    // 忽略频道id= -1、null、undefined
    if (channelId < 0) return
    const res = await http.get<ResponseResult<ArticleItemDataPage>>(
      '/articles',
      {
        params: {
          channel_id: channelId,
          timestamp: Date.now() + ''
        }
      }
    )
    // console.log('>>>获取到的文章列表data:', res.data.data)

    // 根据频道id 和 获取到的文章列表存入store
    dispatch({
      type: 'article/set_channel_articles',
      payload: {
        channelId,
        data: res.data.data
      }
    } as ChannelArticleAction)
  }
}

export const getArticleDetailInfo = (id: string):RootThunkAction => {
  return async (dispatch) => {
    // 调用接口，获取新闻详情
    const res = await http.get<ResponseResult<ArticleInfo>>(`/articles/${id}`)

    // 将新闻详情存入 store
    dispatch({
      type: 'article/set_article_info',
      payload: res.data.data
    } as ArticleInfoAction)


  }
}