import { ResponseResult, UserBasicInfo, UserDetailInfo } from '@/types/data'
import { RootThunkAction, UserAction, UserDetailAction } from '@/types/store'
import http from '@/utils/request'

export const getUserBasicInfo = (): RootThunkAction => {
  return async (dispatch) => {
    // 调用接口，获取用户基本信息
    const res = await http.get<ResponseResult<UserBasicInfo>>('/user')
    const info = res.data.data

    // console.log(info)

    // 将获取到的用户信息存入 store
    dispatch({
      type: 'profile/set_user_basic',
      payload: info
    } as UserAction)
  }
}
export const getUserDetailInfo = (): RootThunkAction => {
  return async (dispatch) => {
    const res = await http.get<ResponseResult<UserDetailInfo>>('/user/profile')
    const info = res.data.data
    dispatch({
      type: 'profile/set_user_detail',
      payload: info
    } as UserDetailAction)
  }
}

// Partial<T> -- 将传入的T类型中的所有字段设为可选字段
export const updateUserDetailInfo = (
  detailInfo: Partial<UserDetailInfo>
): RootThunkAction => {
  return async (dispatch) => {
    // 调用接口，更新用户详细信息
    await http.patch('/user/profile', detailInfo)

    // 重新获取最新用户的详情
    dispatch(getUserDetailInfo())
  }
}

export const uploadUserPhoto = (formData: FormData): RootThunkAction => {
    return async (dispatch) => {
        // 1、调用接口，进行头像上传
        await http.patch('/user/photo', formData)
        // 2、重新获取最新的用户详情信息
        dispatch(getUserDetailInfo())        
    }
}