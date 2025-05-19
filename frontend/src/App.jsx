
import Routing from "./router/Routing";
import {useState,createContext} from "react";
import  "./App.css";
import { ModalControlProvider } from "./context/ModalControlProvider";
import { TaskTimerProvider }  from "./context/TaskTimerProvider";
import DoneIcon from '@mui/icons-material/Done';
import axios from "axios";



const generateTestData = async () => {
  await axios.post("http://localhost:8080/list/test", { count: 50 });
  alert("テストデータを生成しました");
};


function App() {
  
  return(
    <div className="container">

        <TaskTimerProvider>
          <ModalControlProvider>
            <Routing/>
          </ ModalControlProvider>
        </TaskTimerProvider>
        <button onClick={() => generateTestData()}>test</button>
    </div>

    
  )
}

export default App;
