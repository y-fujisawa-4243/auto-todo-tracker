
import Routing from "./router/Routing";
import {useState,createContext} from "react";
import  "./App.css";
import axios from "axios";
import { patchTask } from "./api/taskApi";

import { ModalControlProvider } from "./context/ModalControlProvider";
import { TaskTimerProvider }  from "./context/TaskTimerProvider";



const generateTestData = async () => {
  await axios.post("http://localhost:8080/list/test", { count: 50 });
  alert("テストデータを生成しました");
};

const generateTime = async () => {
  await patchTask(340,{elapsedTime:359990})
};

const allDelete = async () => {
  await axios.delete("http://localhost:8080/list/all")
};


function App() {
  
  return(
    <div className="container">

          <TaskTimerProvider>
              <ModalControlProvider>
                <Routing/>
              </ ModalControlProvider>
          </TaskTimerProvider>


    </div>
  )
}

export default App;

/*テスト用コマンド
        <button onClick={() => generateTestData()}>test</button>
        <button onClick={() => generateTime()}>359990</button>
        <button onClick={() => allDelete()}>全てを破壊する</button>
*/ 