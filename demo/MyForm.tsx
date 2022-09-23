import { Component } from "react";

class MyForm extends Component {
    render(){
        return (
            <form>
                <label>用户名</label>
                <input type="text" placeholder="用户名" />
               
                <label>密码</label>
                <input type="password" placeholder="密码" />

                <button>登录</button>

            </form>
        )
    }
}
export default MyForm