/*
サーバーとやり取りするための関数をまとめたファイル
*/
import axios from "axios";


const TGT_URL = "http://localhost:8080"; //開発用URL定数
//const TGT_URL = "http://localhost:3001/tasks"; //開発用URL定数

//GetAPI
export const getTasks = async () =>{
    return await axios.get(`${TGT_URL}`)
}

//PostAPI
export const postTask = async (taskTitle,taskDescription,createdAt) =>{
    return await axios.post(`${TGT_URL}`,{taskTitle,taskDescription,createdAt})
}

//DeleteAPI
export const deleteTask = async (taskId) =>{
    return await axios.delete(`${TGT_URL}`+`/${taskId}`)
}

/*PutAPI
export const  putTask = async (taskId,newTitle,newDescription) =>{
    try {
        const response = await axios.put(`${TGT_URL}`+`/${taskId}`,
            {
            taskTitle:newTitle,
            taskDescription:newDescription
            }
        )
        return response.data; 
    } catch (error) {
        console.log(error);
    }
} 
    */

//PatchAPI
export const patchTask = async (taskId, sendData) => {
    return await axios.patch(`${TGT_URL}/${taskId}`, sendData);
}
    