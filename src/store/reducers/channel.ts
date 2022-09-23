import { Channel } from '@/types/data'
import { RootAction } from '@/types/store'

// 初始值的状态类型
type ChannelState = {
  // 用户频道数据
  userChannels: Channel[]
  // 所有频道数据
  allChannels: Channel[]
  // 当前选中的频道
  currentChannelId: number
}
  
// 初始状态
const initState: ChannelState = {
  userChannels: [],
  allChannels: [],
  currentChannelId: -1
}

export function channelReducer(
  state: ChannelState = initState,
  action: RootAction
): ChannelState {
  // console.log(state);
  
  // 保存用户频道数据
  if (action.type === 'channel/set_user_channels') {
    return {
      ...state,
      userChannels: action.payload
    }
  }
  // 保存所有频道数据
  if(action.type === 'channel/set_all_channels'){
    return {
      ...state,
      allChannels: action.payload
    }
  }
  // 保存当前选中的频道
  if(action.type === 'channel/set_current_channel'){
    return {
      ...state,
      currentChannelId: action.payload
    }
  }
  return state
}
