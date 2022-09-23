// 存放数据相关的类型定义，如：调用接口时的参数、响应数据

export type Token = {
  // 常规的 token
  token: string
  // token 过期后续期用的token
  refresh_token: string
}
// 登录表单数据类型
export type LoginForm = {
  mobile: string
  code: string
}

// 定义所有响应的数据类型
export type ResponseResult<T = any> = {
  // 响应的提示信息
  message: string
  // 响应的数据
  data: T
}

// 用户中心的基本信息 --- 从后端返回的
export type UserBasicInfo = {
  id: string
  name: string
  photo: string
  art_count: number
  follow_count: number
  fans_count: number
  like_count: number
}

// 用户详情信息
export type UserDetailInfo = {
  id: string
  name: string
  photo: string
  mobile: string
  gender: number
  birthday: string
  intro: string
}

// 频道数据类型
export type Channel = {
  id: number
  name: string
}

// 文章列表项数据中的图片信息
export type ArticleItemCover = {
  type: 0 | 1 | 3
  images: string[]
}
// 文章列表项数据的主体
export type ArticleItemData = {
  art_id: string
  aut_name: string
  aut_id: string
  comm_count: number
  cover: ArticleItemCover
  is_top: number
  title: string
  pubdate: string
}
// 文章列表项分页数据结构
export type ArticleItemDataPage = {
  pre_timestamp: string
  results: ArticleItemData[]
}

// 【注意】 interface 要使用 extend 继承
export type ArticleDetail = ArticleItemData & {
  like_count: number
  collect_count: number
}

export type ArticleDetailPage = {
  page: number
  per_page: number
  total_count: number
  results: ArticleDetail[]
}

export type ArticleInfo = {
  art_id: string  // 文章id
  content: string
  title: string
  pubdate: string
  comm_count: number
  read_count: number
  like_count: number

  // 作者ID
  aut_id: string
  aut_name: string
  aut_photo: string

  
  is_collected: boolean // 收藏
  is_followed: boolean  // 关注
  attitude: number  // 点赞
}

export type Comment = {
  aut_id: string
  aut_name: string
  aut_photo: string
  com_id: string
  content: string
  is_followed: boolean
  is_liking: boolean
  like_count: number
  pubdate: string
  reply_count: number
}

export type CommentPage = {
  end_id: string
  last_id: string
  results: Comment[]
  total_count: number
}