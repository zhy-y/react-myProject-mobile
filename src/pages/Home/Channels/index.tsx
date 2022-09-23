import classnames from 'classnames'
import Icon from '@/components/Icon'
import styles from './index.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/types/store'
import { Channel } from '@/types/data'
import { useEffect, useState } from 'react'
import { differenceBy } from 'lodash'
import { removeUserChannel } from '@/store/actions/channel'

type ChannelsProps = {
  onClose: () => void
  onSelect: (id: number) => void
  onRecommendSelect: (channel: Channel) => void
}

const Channels = ({ onClose, onSelect, onRecommendSelect }: ChannelsProps) => {

  const dispatch = useDispatch()

  const userChannels = useSelector<RootState, Channel[]>((state) => {
    return state.channel.userChannels
  })

  const allChannels = useSelector<RootState, Channel[]>((state) => {
    // console.log(state);
    return state.channel.allChannels
  })
  const [recommendChannels, setRecommendChannels] = useState<Channel[]>([])

  useEffect(() => {
    // 过滤所有频道中不在用户频道中的数据
    // const result = allChannels.filter((item) => {
    //   const findItem = userChannels.find((x) => {
    //     return x.name === item.name
    //   })
    //   return !findItem
    // })

    // --- 使用 loadsh 进入数组对比 ---
    // 传入对比的依据: id
    const result = differenceBy(allChannels, userChannels, 'id')

    setRecommendChannels(result)
  }, [userChannels, allChannels])

  const currentChannelId = useSelector<RootState, number>(state => state.channel.currentChannelId)
  
  // 编辑状态
  const [isEdit, setIsEdit] = useState<boolean>(false)

  return (
    <div className={styles.root}>
      {/* 关闭按钮 */}
      <div className="channel-header">
        <Icon name="iconbtn_channel_close" onClick={onClose} />
      </div>
      <div className="channel-content">
        {/* 我的频道 - 编辑时，添加类名 edit */}
        <div className={classnames('channel-item', {'edit': isEdit})}>
          <div className="channel-item-header">
            <span className="channel-item-title">我的频道</span>
            <span className="channel-item-title-extra">
              {isEdit ? '点击进行频道删除':'点击进行频道编辑'}
            </span>
            <span className="channel-item-edit" onClick={() => {
              setIsEdit(!isEdit)
            }} >{isEdit? '完成':'编辑'}</span>
          </div>
          <div className="channel-list">
            {userChannels.map((ch) => {
              return (
                // {/* 选中时，添加类名 selected */}
                <span className={classnames('channel-list-item', {
                  selected: currentChannelId === ch.id
                })} key={ch.id} onClick={() => {
                  if(isEdit) return
                  onSelect(ch.id)
                }} >
                  {ch.name}
                  <Icon name="iconbtn_tag_close" onClick={() => {
                    if(!isEdit) return
                    dispatch(removeUserChannel(ch.id))
                  }} />
                </span>
              )
            })}
          </div>
        </div>

        {/* 推荐频道 */}
        <div className="channel-item">
          <div className="channel-item-header">
            <span className="channel-item-title">频道推荐</span>
            <span className="channel-item-title-extra">点击添加频道</span>
          </div>
          <div className="channel-list">
            {recommendChannels.map((ch) => {
              return (
                <span className="channel-list-item" key={ch.id} onClick={() => {
                  onRecommendSelect(ch)
                }} >
                  {ch.name}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Channels
