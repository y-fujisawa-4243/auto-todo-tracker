
import Routing from "./router/Routing";
import {useState,createContext} from "react";
import  "./App.css";
import { ModalControlProvider } from "./context/ModalControlProvider";
import { TaskTimerProvider }  from "./context/TaskTimerProvider";


function App() {
  
  return(
    <div className="container">
      <TaskTimerProvider>
        <ModalControlProvider>
          <Routing />
        </ ModalControlProvider>
      </TaskTimerProvider>
    </div>

    
  )
}

export default App;
