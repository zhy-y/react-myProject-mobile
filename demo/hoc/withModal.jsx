// 高阶组件的命名规范
// 必须以 with ，比如：withXxx

const { Component } = require('react')

// 高阶组件其实是一个函数
// -- 参数必须是个组件
// -- 【使用】：const MyFormModel = withModel(MyForm) 、<MyFormModel />
export function withModel(SrcComponent) {
  // HOC内部，需要创建一个新的组件

  class Model extends Component {
    render() {
      return (
        <div className="popup">
          <div>标题</div>

          <div>
            <SrcComponent />
          </div>

          <div>
            <button>取消</button>
            <button>确定</button>
          </div>
        </div>
      )
    }
  }
  return Model
}
