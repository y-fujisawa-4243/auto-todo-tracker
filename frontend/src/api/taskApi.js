/*
サーバーとやり取りするための関数をまとめたファイル
*/
import axios from "axios";


//const TGT_URL = "http://localhost:8080"; //開発用URL定数
const TGT_URL = "https://auto-todo-tracker-production.up.railway.app"; //公開用URL定数

//GetAPI
export const getTasks = async () =>{
    return await axios.get(`${TGT_URL}/tasks`, { withCredentials: true })
}

//PostAPI
export const postTask = async (taskTitle,taskDescription,createdAt) =>{
    return await axios.post(`${TGT_URL}/tasks`,{taskTitle,taskDescription,createdAt}, { withCredentials: true })
}

//DeleteAPI
export const deleteTask = async (taskId) =>{
    return await axios.delete(`${TGT_URL}`+`/${taskId}`, { withCredentials: true })
}

//PatchAPI
export const patchTask = async (taskId, sendData) => {
    return await axios.patch(`${TGT_URL}/${taskId}`, sendData, { withCredentials: true });
}

//SignUpAPI
export const postSignUp= async (userId,password) =>{
    return await axios.post(`${TGT_URL}/signup`,{userId,password}, { withCredentials: true })
}

//SigninAPI
export const postSignIn= async (userId,password) =>{
    return await axios.post(`${TGT_URL}/signin`,{userId,password}, { withCredentials: true })
}

//SignoutAPI
export const postSignout= async () =>{
    return await axios.post(`${TGT_URL}/signout`, {},{ withCredentials: true })
}

//認証状態の確認API
export const checkAuth = async() =>{
    return await axios.get(`${TGT_URL}/auth/check`, { withCredentials: true })
} 