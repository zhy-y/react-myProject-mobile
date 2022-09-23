import Icon from '@/components/Icon'
import styles from './index.module.scss'
import { Link, useHistory } from 'react-router-dom'
import { getUserBasicInfo } from '@/store/actions/profile'
import { useRemoteData } from '@/hooks/useRemoteData'

const Profile = () => {
  const history = useHistory()
  // const dispatch = useDispatch()

  // useEffect(() => {
  //   dispatch(getUserBasicInfo())
  // }, [dispatch])

  // // 获取请求后存在store中的用户信息
  // // useSelector<参数类型，返回值类型>(state => {state})
  // const userBasicInfo = useSelector<RootState, UserBasicInfo>((state) => {
  //   return state.profile.userBasicInfo
  // })

  // 使用 自定义Hook简化 useEffect + useSelector

  const {
    profile: { userBasicInfo }
  } = useRemoteData(getUserBasicInfo)

  // const { userBasicInfo } = useRemoteData(getUserBasicInfo).profile;

  return (
    <div className={styles.root}>
      {/* 用户基本信息 */}
      <div className="profile">
        {/* 个人信息 */}
        <div className="user-info">
          <div className="avatar">
            <img src={userBasicInfo.photo} alt="" />
          </div>
          <div className="user-name">{userBasicInfo.name}</div>
          <Link to="/profile/edit">
            个人信息 <Icon name="iconbtn_right" />
          </Link>
        </div>

        {/* 今日阅读 */}
        <div className="read-info">
          <Icon name="iconbtn_readingtime" />
          今日阅读
          <span>10</span>
          分钟
        </div>

        {/* 动态 - 对应的这一行 */}
        <div className="count-list">
          <div className="count-item">
            <p>{userBasicInfo.art_count}</p>
            <p>动态</p>
          </div>
          <div className="count-item">
            <p>{userBasicInfo.follow_count}</p>
            <p>关注</p>
          </div>
          <div className="count-item">
            <p>{userBasicInfo.fans_count}</p>
            <p>粉丝</p>
          </div>
          <div className="count-item">
            <p>{userBasicInfo.like_count}</p>
            <p>被赞</p>
          </div>
        </div>

        {/* 消息通知 - 对应的这一行 */}
        <div className="user-links">
          <div className="link-item">
            <Icon name="iconbtn_mymessages" />
            <div>消息通知</div>
          </div>
          <div className="link-item">
            <Icon name="iconbtn_mycollect" />
            <div>收藏</div>
          </div>
          <div className="link-item">
            <Icon name="iconbtn_history1" />
            <div>浏览历史</div>
          </div>
          <div className="link-item">
            <Icon name="iconbtn_myworks" />
            <div>我的作品</div>
          </div>
        </div>
      </div>

      {/* 更多服务 */}
      <div className="more-service">
        <h3>更多服务</h3>
        <div className="service-list">
          <div className="service-item">
            <Icon name="iconbtn_feedback" />
            <div>用户反馈</div>
          </div>
          <div className="service-item" onClick={() => history.push('/chat')}>
            <Icon name="iconbtn_xiaozhitongxue" />
            <div>小智同学</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
