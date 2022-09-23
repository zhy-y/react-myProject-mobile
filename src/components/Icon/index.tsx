import classnames from 'classnames'
// classnames("name1", {"hello": true})

interface IconProps {
  // 要显示字体图标的名字
  name: string
// 自定义class 样式类
className?: string
  // 点击事件监听函数
  onClick?: () => void
}

const Icon = ({className, onClick, name}: IconProps) => {
  return (
    <svg aria-hidden="true" className={classnames("icon", className)} onClick={onClick}>
      <use xlinkHref={`#${name}`}></use>
    </svg>
  )
}
export default Icon
