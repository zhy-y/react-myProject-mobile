import { CommentPage, ResponseResult } from '@/types/data'
import { CommentPageAction, RootThunkAction } from '@/types/store'
import http from '@/utils/request'
import { getArticleDetailInfo } from './article'

export const getCommentPage = (
  articleId: string,
  offset: string
): RootThunkAction => {
  return async (dispatch, getState) => {
    // 调用接口，获取评论数据
    const res = await http.get<ResponseResult<CommentPage>>('/comments', {
      params: {
        type: 'a', // 获取普通评论
        source: articleId, // 要获取评论的文章id
        offset, // 下一页起始数据的id，即上一页最后一条评论的id
        limit: 5
      }
    })
    // console.log(res)
    // 将评论数据存入store
    const oldCommentPage = getState().comment.commentPage
    const newCommentPage = res.data.data

    dispatch({
      type: 'comment/set_comment_page',
      payload: {
        total_count: newCommentPage.total_count,
        last_id: newCommentPage.last_id,
        end_id: newCommentPage.end_id,
        results: [...oldCommentPage.results, ...newCommentPage.results]
      }
    } as CommentPageAction)
  }
}

export const getInitCommentPage = (
  articleId: string,
  offset: string
): RootThunkAction => {
  return async (dispatch, getState) => {
    // 调用接口，获取评论数据
    const res = await http.get<ResponseResult<CommentPage>>('/comments', {
      params: {
        type: 'a', // 获取普通评论
        source: articleId, // 要获取评论的文章id
        offset, // 下一页起始数据的id，即上一页最后一条评论的id
        limit: 5
      }
    })
    // console.log(res)
    // 将评论数据存入store
    const newCommentPage = res.data.data

    dispatch({
      type: 'comment/set_comment_page',
      payload: newCommentPage
    } as CommentPageAction)
  }
}

export const likeArticle = (id: string, attitude: number): RootThunkAction => {
  return async (dispatch) => {
    // 当前是点赞状态
    if (attitude === 1) {
      // 取消点赞
      await http.delete(`article/likings/${id}`)
    } else {
      // 进行点赞
      await http.post(`article/likings`, {
        target: id
      })
    }

    // 重新请求当前文章的详情
    dispatch(getArticleDetailInfo(id))
  }
}

export const collectArticle = (
  id: string,
  isCollected: boolean
): RootThunkAction => {
  return async (dispatch) => {
    if (isCollected) {
      // 取消收藏
      await http.delete(`article/collections/${id}`)
    } else {
      await http.post(`article/collections`, {
        target: id
      })
    }

    // 重新请求当前文章的详情
    dispatch(getArticleDetailInfo(id))
  }
}

export const followAuthor = (
  authorId: string,
  articleId: string,
  isFollowed: boolean
): RootThunkAction => {
  return async (dispatch) => {
    if (isFollowed) {
      // 取消关注
      await http.delete(`/user/followings/${authorId}`)
    } else {
      await http.post(`/user/followings/`, {
        target: authorId
      })
    }

    // 重新请求当前文章的详情
    dispatch(getArticleDetailInfo(articleId))
  }
}

export const publishArticleComment = (
  target: string,
  content: string
): RootThunkAction => {
  return async (dispatch) => {
    // 发布一条新评论
    await http.post('/comments', {
      target,
      content
    })

    // 重新获取评论列表 -- offest='' 永远获取第一页的评论
    dispatch(getInitCommentPage(target, '')) // 会拼接旧的评论
  }
}
