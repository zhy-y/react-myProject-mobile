import { Channel, ResponseResult } from '@/types/data'
import {
  AllChannelAction,
  RootThunkAction,
  UserChannelAction
} from '@/types/store'
import { getChannels, setChannels } from '@/utils/channel'
import http from '@/utils/request'
import { hasToken } from '@/utils/token'

export const getUserChannels = (): RootThunkAction => {
  return async (dispatch) => {
    // 1、如果用户已登录。则直接从后端获取频道数据
    if (hasToken()) {
      // 调用接口，获取用户的频道数据
      const res = await http.get<ResponseResult<{ channels: Channel[] }>>(
        '/user/channels'
      )
      console.log('>>>已登录', res.data.data.channels)
      // 将频道数据保存到store中
      dispatch({
        type: 'channel/set_user_channels',
        payload: res.data.data.channels
      } as UserChannelAction)
    }
    // 2、如果用户未登录
    // - 2.1 尝试从本地缓存中获取频道数据
    // - 2.1.1 如果拿到缓存的频道数据，就用这个缓存的数据
    // - 2.1.2 如果没有拿到缓存的频道数据，再调用接口获取
    else {
      const channels = getChannels()
      if (channels.length > 0) {
        // 将频道数据保存到store中
        dispatch({
          type: 'channel/set_user_channels',
          payload: channels
        } as UserChannelAction)
      } else {
        // 调用接口，获取用户的频道数据
        const res = await http.get<ResponseResult<{ channels: Channel[] }>>(
          '/user/channels'
        )
        // 将频道数据保存到store中
        dispatch({
          type: 'channel/set_user_channels',
          payload: res.data.data.channels
        } as UserChannelAction)
        console.log('>>>未登录', res.data.data.channels)
        // 将频道数据再存入本地缓存中
        setChannels(res.data.data.channels)
      }
    }
  }
}

export const getAllChannels = (): RootThunkAction => {
  return async (dispatch) => {
    // 调用接口，获取所有频道数据
    const res = await http.get<ResponseResult<{ channels: Channel[] }>>(
      '/channels'
    )
    const allChannels = res.data.data.channels
    // 将所有频道数据保存到 Redux中
    dispatch({
      type: 'channel/set_all_channels',
      payload: allChannels
    } as AllChannelAction)
  }
}

// 更新用户频道管理
export const updateUserChannels = (channel: Channel): RootThunkAction => {
  return async (dispatch, getState) => {
    // 通过 getState 获取store中原来的数据
    const newUserChannels = [...getState().channel.userChannels, channel]

    // 1、如果是未登录用户，直接将数据更新到 store 和 localStorage 中
    if (!hasToken()) {
      dispatch({
        type: 'channel/set_user_channels',
        payload: newUserChannels
      } as UserChannelAction)
      setChannels(newUserChannels)
    }
    // 2、已登录，更新到后端
    else {
      const res = await http.put<ResponseResult<{ channels: Channel[] }>>(
        '/user/channels',
        {
          channels: newUserChannels
        }
      )
      console.log(res)
      dispatch({
        type: 'channel/set_user_channels',
        payload: res.data.data.channels
      } as UserChannelAction)
    }
  }
}

export const removeUserChannel = (id: number): RootThunkAction => {
  return async (dispatch, getState) => {
    if (hasToken()) {
      // 调用接口，删除频道
      await http.delete(`/user/channels/${id}`)
      // 更新 store中用户频道信息 -- 获取原来数据并过滤更新
      const newUserChannels = getState().channel.userChannels.filter(
        (item) => item.id !== id
      )
      dispatch({
        type: 'channel/set_user_channels',
        payload: newUserChannels
      } as UserChannelAction)
    } else {
      const channels = getChannels()
      const newUserChannels = channels.filter((x) => x.id !== id)
      dispatch({
        type: 'channel/set_user_channels',
        payload: newUserChannels
      } as UserChannelAction)
      // 本地存储
      setChannels(newUserChannels)
    }
  }
}
