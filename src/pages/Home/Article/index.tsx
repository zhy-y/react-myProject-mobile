import { NavBar, InfiniteScroll, Popup } from 'antd-mobile'
import { useHistory, useParams } from 'react-router-dom'
import classNames from 'classnames'
import styles from './index.module.scss'

import Icon from '@/components/Icon'
import CommentItem from './components/CommentItem'
import CommentFooter from './components/CommentFooter'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getArticleDetailInfo } from '@/store/actions/article'
import { RootState } from '@/types/store'
import { ArticleInfo, Comment, CommentPage } from '@/types/data'
import DOMPurify from 'dompurify'
import highlight from 'highlight.js'
import 'highlight.js/styles/vs2015.css'
import {
  collectArticle,
  followAuthor,
  getCommentPage,
  likeArticle,
  publishArticleComment
} from '@/store/actions/comment'
import NoComment from './components/NoComment'
import CommentInput from './components/CommentInput'
import CommentReply from './components/CommentReply'

const Article = () => {
  const history = useHistory()
  const params = useParams<{ id: string }>()
  const dispatch = useDispatch()
  // console.log(params.id)

  useEffect(() => {
    dispatch(getArticleDetailInfo(params.id))
  }, [dispatch, params]) // 因为 params 也是 hooks 的状态，所以也需要设置为依赖项

  const articleInfo = useSelector<RootState, ArticleInfo>((state) => {
    return state.article.articleInfo
  })

  useEffect(() => {
    // 配置 highlight 库
    highlight.configure({
      ignoreUnescapedHTML: true // 忽略没有转义过的html标签
    })

    // 获取 目标当前页面中的 pre标签
    const preList = document.querySelectorAll('.dg-html pre')
    // 传入的 pre 是 Element 类型
    preList.forEach((pre) => {
      // highlightElement 要传入的是 pre 的子类型 --- 转型
      highlight.highlightElement(pre as HTMLElement)
    })
    // 如果不加 articleInfo 依赖，第一次进来页面中时 articleInfo 值为空，所以不会被设置高亮
  }, [articleInfo])

  // --- 顶部栏的显示隐藏 ---
  const wrapperRef = useRef<HTMLDivElement>(null)
  const authorRef = useRef<HTMLDivElement>(null)
  const commentRef = useRef<HTMLDivElement>(null)

  const [isTopInfoShow, setIsTopInfoShow] = useState<boolean>(false)

  useEffect(() => {
    const scrollHandler = () => {
      // 通过 DOM元素的 getBoundingClientRect 获取当前元素的宽高、四边位置信息
      // -- 是HTML5的方法
      // -- offsetHeight, offsetTop, offsetWidth
      const rectInfo = authorRef.current?.getBoundingClientRect()
      // console.log(rectInfo)
      // DOMRect {x: 16, y, width, height, top, bottom, left, right}
      // 如果当前元素滚出容器，就显示顶部工具栏
      if (rectInfo!.top <= 0) {
        setIsTopInfoShow(true)
      } else {
        setIsTopInfoShow(false)
      }
    }
    wrapperRef.current?.addEventListener('scroll', scrollHandler)

    return () => {
      wrapperRef!.current?.removeEventListener('scroll', scrollHandler)
    }
  }, [])

  // --- 请求文章的评论 ---
  useEffect(() => {
    if (params.id) {
      dispatch(getCommentPage(params.id, ''))
    }
  }, [dispatch, params.id])

  const commentPage = useSelector<RootState, CommentPage>((state) => {
    return state.comment.commentPage
  })

  const onAuthorFollow = () => {
    dispatch(
      followAuthor(
        articleInfo.aut_id,
        articleInfo.art_id,
        articleInfo.is_followed
      )
    )
  }

  const [showCommentPopup, setShowCommentPopup] = useState<boolean>(false)
  const [showReplyPopup, setShowReplyPopup] = useState<boolean>(false)
  const [currentReplyComment, setCurrentReplyComment] = useState<Comment>(
    {} as Comment
  )

  // --- Article组件 内部定义的渲染文章正文的函数组件：直接使用外层组件的数据 ---
  const renderArticle = () => {
    // 文章详情
    return (
      <div className="wrapper" ref={wrapperRef}>
        <div className="article-wrapper">
          <div className="header">
            <h1 className="title">{articleInfo.title}</h1>

            <div className="info">
              <span>{articleInfo.pubdate}</span>
              <span>{articleInfo.read_count} 阅读</span>
              <span>{articleInfo.comm_count} 评论</span>
            </div>

            <div className="author" ref={authorRef}>
              <img src="http://geek.itheima.net/images/user_head.jpg" alt="" />
              <span className="name">{articleInfo.aut_name}</span>
              <span
                className={classNames('follow', {
                  followed: articleInfo.is_followed
                })}
                onClick={onAuthorFollow}
              >
                {articleInfo.is_followed ? '已关注' : '关注'}
              </span>
            </div>
          </div>

          <div className="content">
            {/* 文章正文 -- 使用 dangerouslySetInnerHTML 需要给内容做安全处理工作
                使用 DOMPurify 防止 XSS攻击 */}
            <div
              className="content-html dg-html"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(articleInfo.content)
              }}
            ></div>
            <div className="date">发布文章时间：{articleInfo.pubdate}</div>
          </div>
        </div>

        <div className="comment" ref={commentRef}>
          <div className="comment-header">
            <span>全部评论（{articleInfo.comm_count}）</span>
            <span>{articleInfo.like_count} 点赞</span>
          </div>

          {/* --- 评论列表 --- */}
          <div className="comment-list">
            {commentPage?.results?.length <= 0 && <NoComment />}
            {commentPage?.results?.map((comment) => {
              return (
                <CommentItem
                  comment={comment}
                  key={comment.com_id + '' + Math.random()}
                  onReplay={() => {
                    setShowReplyPopup(true)

                    // 将当前要评论的数据存到 state 传递给 CommentReplay组件
                    setCurrentReplyComment(comment)
                  }}
                />
              )
            })}

            <InfiniteScroll
              hasMore={commentPage.last_id !== commentPage.end_id}
              loadMore={async () => {
                // 加载更多评论 -- 传入上一页评论的last_id
                await dispatch(getCommentPage(params.id, commentPage.last_id))
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  // 【Article组件 的主体内容】
  return (
    <div className={styles.root}>
      <div className="root-wrapper">
        <NavBar
          onBack={() => history.go(-1)}
          right={
            <span>
              <Icon name="icongengduo" />
            </span>
          }
        >
          {isTopInfoShow && (
            <div className="nav-author">
              <img src="http://geek.itheima.net/images/user_head.jpg" alt="" />
              <span className="name">{articleInfo.aut_name}</span>
              <span
                className={classNames('follow', {
                  followed: articleInfo.is_followed
                })}
                onClick={onAuthorFollow}
              >
                {articleInfo.is_followed ? '已关注' : '关注'}
              </span>
            </div>
          )}
        </NavBar>

        {/* 文章详情和评论 */}
        {renderArticle()}

        {/* 底部评论栏 */}
        <CommentFooter
          article={articleInfo}
          // 子传入 -- 子组件提供参数 - 调用父组件传递的函数
          onLiking={(attitude: number) => {
            dispatch(likeArticle(articleInfo.art_id, attitude))
          }}
          onCollecting={(isCollected: boolean) => {
            dispatch(collectArticle(articleInfo.art_id, isCollected))
          }}
          onComment={() => {
            // 如果当前不在评论区域，就滚动到评论区域
            const res = commentRef.current?.getBoundingClientRect()
            console.log(res)
            wrapperRef.current!.scrollTop = res!.top - 45
            // 在评论区域，就跳回
          }}
          onCommentInput={() => {
            setShowCommentPopup(true)
          }}
        />
      </div>
      <Popup visible={showCommentPopup} position="bottom" destroyOnClose>
        <div
          style={{
            width: '100vw',
            height: '100vh'
          }}
        >
          {/* 评论：提交评论 */}
          <CommentInput
            onCommit={(content: string) => {
              // console.log(content);
              dispatch(publishArticleComment(articleInfo.art_id, content))
              setShowCommentPopup(false)
            }}
            onClose={() => {
              setShowCommentPopup(false)
            }}
          />
        </div>
      </Popup>

      <Popup visible={showReplyPopup} position="right" destroyOnClose>
        <div
          style={{
            width: '100vw',
            height: '100vh'
          }}
        >
          <CommentReply
            onClose={() => {
              setShowReplyPopup(false)
            }}
            comment={currentReplyComment}
          />
        </div>
      </Popup>
    </div>
  )
}

export default Article
