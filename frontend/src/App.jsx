
import Routing from "./router/Routing";
import {useState,createContext} from "react";
import  "./App.css";
import { ModalControlProvider } from "./context/ModalControlProvider";
import { TaskTimerProvider }  from "./context/TaskTimerProvider";
import { UserApiErrorProvider } from "./context/UserApiErrorProvider";




function App() {
  
  return(
    <div className="container">

      <UserApiErrorProvider>
        <TaskTimerProvider>
          <ModalControlProvider>
            <Routing/>
          </ ModalControlProvider>
        </TaskTimerProvider>
      </UserApiErrorProvider>
    </div>

    
  )
}

export default App;
