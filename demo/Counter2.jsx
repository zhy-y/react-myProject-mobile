import { useCallback, useMemo, useState } from "react"

const Counter2 = () => {
    console.log('>>>', Date.now())

    const [count, setCount] = useState(0)

    const [num1, setNum1] = useState(10)
    const [num2, setNum2] = useState(20)

    // 每次重新渲染组件 -- 普通函数都会重新执行
    // const result = num1 + num2

    // --- 缓存计算属性 - 避免后续重复进行计算 ----
    // 依赖项改变才重新计算执行 -- 将上一次结果缓存在函数组件的组件实例上
    // --- 创建函数组件实例时，相当于创建了一个 Fiber实例
    // --- Fiber={num1, num2, ...}  // Fiber 实例中缓存了组件的数据 或 方法
    const result = useMemo(() => {
        console.log('>>>useMemo');
        return num1 + num2
    }, [num1, num2])

    // ---- 缓存函数 - 避免后续重复创建函数 ----
    // 每次重新渲染组件时，普通函数会相当于被重新创建
    // useCallback -- 缓存第一次创建的函数，后续渲染组件不会再重复创建该函数 -- 相当于 useMemo 的变种，
    // -- 如果不设置依赖项，缓存的还是最初组件渲染时的 state 的结果
    // -- 设置依赖项 -- 让函数执行结果随着组件state数据而变化
    const test = useCallback(() => {
        console.log('>>>', num1, num2);
    }, [num1, num2])
    
    // 【等价】使用 useMemo 替代 useCallback
    const test2 = useMemo(() => {
        return () => {
            console.log('>>>', num1, num2);
        }
    }, [num1, num2])

    return (
        <div>
            {result}
            <button onClick={() => {
                setNum1(11)
                setNum2(22)
            }}>设置num</button>
            <button onClick={() => {
                test()
            }}>test设置num</button>

            <h1>数字： {count}</h1>
            <button onClick={() => {
                setCount(1)
            }}>设置</button>

        </div>
    )

}
export default Counter2