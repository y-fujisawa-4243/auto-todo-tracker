/*
サーバーとやり取りするための関数をまとめたファイル
*/
import axios from "axios";


//const TGT_URL = "http://localhost:8080"; //開発用URL定数
const TGT_URL = "http://localhost:3001/tasks"; //開発用URL定数

//GetAPI
export const getTasks = async () =>{
    try {
        const response = await axios.get(`${TGT_URL}`)
        return response.data; 
    } catch (error) {
        console.log(error);
    }
}

//PostAPI
export const postTask = async (title,description,createdAt,status,time) =>{
    try {
        const response = await axios.post(`${TGT_URL}`,{title,description,createdAt,status,time})
        return response.data; 
    } catch (error) {
        console.log(error);
    }
}

//DeleteAPI
export const deleteTask = async (taskId) =>{
    try {
        await axios.delete(`${TGT_URL}`+`/${taskId}`)
        console.log(taskId)
    } catch (error) {
        console.log(error);
    }
}

//PutAPI
export const  putTask = async (taskId,newTitle,newDescription) =>{
    try {
        const response = await axios.put(`${TGT_URL}`+`/${taskId}`,
            {
            title:newTitle,
            description:newDescription
            }
        )
        return response.data; 
    } catch (error) {
        console.log(error);
    }
} 

//PatchAPI
export const patchTask = async (taskId, sendData) => {
    try {
        const response = await axios.patch(`${TGT_URL}/${taskId}`, sendData);
        return response.data;
    } catch (error) {
        console.error(error);
    }
    }