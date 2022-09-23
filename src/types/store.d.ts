// 存放 Redux 相关的 state、action 类型定义
import store from '@/store'
import { ArticleDetailPage, ArticleInfo, ArticleItemDataPage, Channel, CommentPage, Token, UserBasicInfo, UserDetailInfo } from './data'
import { ThunkAction } from 'redux-thunk'

// 登录相关的状态类型
export type LoginState = {
  token: Token
}

// 登录相关的 Action 对象的类型
export type LoginAction = {
  type: 'login/set_token'
  payload: Token
}

// 登录 - 用户信息相关的Action对象类型
export type UserAction = {
  type: 'profile/set_user_basic'
  payload: UserBasicInfo
}

export type UserDetailAction = {
  type: 'profile/set_user_detail'
  payload: UserDetailInfo
}

export type UserChannelAction = {
  type: 'channel/set_user_channels'
  payload: Channel[]
}

export type AllChannelAction = {
  type: 'channel/set_all_channels'
  payload: Channel[]
}

export type CurrentChannelAction = {
  type: 'channel/set_current_channel'
  payload: number
}

export type ChannelArticleAction = {
  type: 'article/set_channel_articles'
  payload: {
    channelId: number
    data: ArticleItemDataPage
  }
}

export type SearchSuggestionsAction = {
  type: 'search/set_search_suggestions',
  payload: string[]
}

export type SearchKeywordsAction = {
  type: 'search/set_keywords'
  payload: string[]
}

export type SearchResultPageAction = {
  type: 'search/set_search_page',
  payload: ArticleDetailPage
}

export type ArticleInfoAction = {
  type: 'article/set_article_info',
  payload: ArticleInfo
}

export type CommentPageAction = {
  type: 'comment/set_comment_page'
  payload: CommentPage
}

// store 中存储的所有状态的类型
export type RootState = ReturnType<typeof store.getState>

// 登录相关的异步操作函数的类型
// - 异步dispatch 函数返回值类型 - 要操作的state类型 - 额外参数类型 -
export type RootAction =
  | LoginAction
  | UserAction
  | UserDetailAction
  | UserChannelAction
  | AllChannelAction
  | CurrentChannelAction
  | ChannelArticleAction
  | SearchSuggestionsAction
  | SearchKeywordsAction
  | SearchResultPageAction
  | ArticleInfoAction
  | CommentPageAction

// export type LoginThunkAction = ThunkAction<
//   void,    // 异步函数返回值类型
//   RootState,    // Store 中所有状态类型
//   unknown,    // 额外参数类型，一般不用
//   LoginAction    // 异步函数中再调用 dispatch 时 Action类型
// >

// // 用户信息相关的异步操作函数
// export type UserThunkAction = ThunkAction<
// void,
// RootState,
// unknown,
// LoginAction
// >

// ==>  通用的RootAction

export type RootThunkAction = ThunkAction<void, RootState, unknown, RootAction>
