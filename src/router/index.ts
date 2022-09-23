import {createHashHistory} from 'history'
// 创建独立的 history对象 --- 不依赖于组件
// 其他独立JS文件要使用history对象做路由跳转 -- 需要导入
const history = createHashHistory()

export default history