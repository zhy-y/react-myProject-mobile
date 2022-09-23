import { UserBasicInfo, UserDetailInfo } from '@/types/data'
import { RootAction } from '@/types/store'

// 用户相关的所有状态
type ProfileState = {
  userBasicInfo: UserBasicInfo
  userDetailInfo: UserDetailInfo
}
// 默认状态
const initState: ProfileState = {
  userBasicInfo: {} as UserBasicInfo,
  userDetailInfo: {} as UserDetailInfo
}

export function profileReducer(
  state: ProfileState = initState,
  action: RootAction  // 依赖所有的 reducer类型设置为 RootAction
): ProfileState {

  // 存储用户基本信息
    if(action.type === 'profile/set_user_basic'){
        return {
            ...state,
            userBasicInfo: action.payload
        }
    }
    // 存储用户详情信息
    if(action.type === 'profile/set_user_detail'){
      return {
        ...state,
        userDetailInfo: action.payload
      }
    }

  return state
}
