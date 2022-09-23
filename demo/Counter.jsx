import {Component} from 'react'

class Counter extends Component {

    state = {
        count: 0
    }

    // -- shouldComponentUpdate 是类组件的一个钩子函数（不是生命周期钩子）
    // -- 而是一个来自继承的 Component父类中的辅助函数
    // 当前组件的 props 或 state 发生重新设置，都会执行该方法：
    // -- 返回值只能是 Boolean。true则render会被执行，否则不会执行
    shouldComponentUpdate(nextProps, nextState){

        return this.state.count !== nextState.count
    }
    
    render(){
        // 虽然count值没有发生根本性改变，但是render()中的逻辑依然会在state更新时重读渲染
        // --- shouldComponentUpdate(nextProps, nextState)
        console.log('>>>', Date.now())
        return (
            <div>
                <h1>当前数组：{}</h1>
                <button onClick={() => {
                    this.setState({
                        count: 0   
                    })
                }}>变化</button>
            </div>
        )
    }
}

export default Counter