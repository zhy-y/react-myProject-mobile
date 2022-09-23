import http from "@/utils/request"

// 该文件存放和 redux store 没有关系的异步请求逻辑
export const sendCode = async (mobile: string) => {
    const res = await http.get(`/sms/codes/${mobile}`)
    console.log(res);
}