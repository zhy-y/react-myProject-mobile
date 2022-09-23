import { RootState, RootThunkAction } from '@/types/store'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// 【注意】类型可以通过泛型传参 -- 类型参数

// 传递参数：
// 方法一：通过 arugs 数组传参(如下)
// 方法二：通过 箭头函数直接使用 -- 不用 argus
// useRemoteData((xxx) => {
//     return getUserBasicInfo(xxx) // 使用箭头函数传参
// })
export function useRemoteData(func: (argus?:any) => RootThunkAction, argus?: any[]) {
  const dispatch = useDispatch()

  // 页面一进来就异步请求数据并dispatch存入仓库
  useEffect(() => {
    // 以参数的形式传进来 dispatch 的异步函数 func
    dispatch(func(argus))
  }, [dispatch, func, argus])

  // 从仓库取值
  const state = useSelector<RootState, RootState>((state) => {
    return state
  })
  return state
}
