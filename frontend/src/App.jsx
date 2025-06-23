
import Routing from "./router/Routing";
import {useState,createContext} from "react";
import  "./App.css";
import axios from "axios";
import { patchTask ,checkAuth } from "./api/taskApi";

import { ModalControlProvider } from "./context/ModalControlProvider";
import { TaskTimerProvider }  from "./context/TaskTimerProvider";
import { AuthenticationProvider } from "./context/AuthenticationProvider";



const generateTestData = async () => {
  await axios.post("http://localhost:8080/list/test", { count: 50 });
  alert("テストデータを生成しました");
};

const generateTime = async () => {
  await patchTask(340,{elapsedTime:359990})
};

const allDelete = async () => {
  await axios.delete("http://localhost:8080/tasksAll")
};

const userAllDelete = async() =>{
  await axios.delete("http://localhost:8080/userAll")
}

const getUser = async() =>{
  try {
      await checkAuth();
      console.log("認証中")
  } catch (error) {
        console.log("未認証")
  }

}

const clearStrage = () =>{
  localStorage.clear();
}


function App() {
  
  return(
    <div className="container">
        <AuthenticationProvider>
          <TaskTimerProvider>
              <ModalControlProvider>
                <Routing/>
              </ ModalControlProvider>
          </TaskTimerProvider>
        </AuthenticationProvider>

    </div>
  )
}

export default App;

/*テスト用コマンド
        <button onClick={() => generateTestData()}>test</button>
        <button onClick={() => generateTime()}>359990</button>
        <button onClick={() => allDelete()}>全てを破壊する</button>
        <button onClick={()=>userAllDelete()}>ユーザー全削除</button>
        <button onClick={() => allDelete()}>全てを破壊する</button>
        <button onClick={() => getUser()}>情報取得</button>
        <button onClick={()=>clearStrage()}>ストレージ削除</button>
*/ 