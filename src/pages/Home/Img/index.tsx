import classnames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import Icon from '@/components//Icon'
import styles from './index.module.scss'

type ImageProps = {
  src: string
  className?: string
}
/**
 * 拥有懒加载特性的图片组件
 * @param {String} props.src 图片地址
 * @param {String} props.className 样式类
 */

const Image = ({ src, className }: ImageProps) => {
  // 记录图片加载是否出错的状态
  const [isError, setIsError] = useState<boolean>(false)

  // 记录图片是否正在加载的状态
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // 对图片元素的引用
  const imgRef = useRef<HTMLImageElement>(null)

  // 设置 ------ 图片懒加载 -----
  useEffect(() => {
    // 创建 IntersectionObserver ，监听当前组件的 img标签
    const observer = new IntersectionObserver((entries) => {
      // console.log(entries)    // [IntersectionObserverEntry]
      // 监听到进入可视区后的代码逻辑
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          // 【问题】滚动会去又再次加载了图片
          // 方法一：没有值才加载
          if (!img.src) {
            img.src = img.dataset.src || ''
          }
          // 方法二：赋值后关闭监听
          observer.disconnect()
        }
      })
    })
    // 开始监听 img 标签
    observer.observe(imgRef?.current!)

    // 组件销毁时关闭监听
    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div className={classnames(styles.root, className)}>
      {/* 正在加载时显示的内容 */}
      {isLoading && (
        <div className="image-icon">
          <Icon name="iconphoto" />
        </div>
      )}

      {/* 加载出错时显示的内容 */}
      {isError && (
        <div className="image-icon">
          <Icon name="iconphoto-fail" />
        </div>
      )}

      {/* 加载成功时显示的内容 */}
      {!isError && (
        <img
          alt=""
          data-src={src} // 先将src的值存在自定义属性中，等需要加载时再给src赋值
          ref={imgRef}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsError(true)}
        />
      )}
    </div>
  )
}

export default Image
