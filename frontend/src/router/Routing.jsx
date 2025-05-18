import { BrowserRouter, Routes, Route} from "react-router-dom"
import { useState } from "react";

//各コンポーネント
import Home from "../components/pages/home/Home.jsx"
import InCompletedTaskList from "../components/pages/incompleted-task-list/InCompletedTaskList.jsx";
import CompletedTaskList from "../components/pages/completed-task-list/CompletedTaskList.jsx";
import NotFoundPage from "../components/pages/not-found-page/NotFoundPage.jsx";

//path定義ファイル
import ROUTE_PATHS  from "./routePath.js";



const Routing = () =>{

    const [tasks,setTasks] = useState([]);      //フロント側のTaskリスト
    console.log(`Routineg///${tasks}`)

    return(
        <BrowserRouter>
            <Routes>
                <Route path={ROUTE_PATHS.HOME} element={<Home />}></Route>
                <Route path={ROUTE_PATHS.LIST} element={<InCompletedTaskList tasks={tasks} setTasks={setTasks} />}></Route>
                <Route path={ROUTE_PATHS.COMPLETE} element={<CompletedTaskList tasks={tasks} setTasks={setTasks}/>}></Route>
                <Route path={ROUTE_PATHS.NOT_FOUND} element={<NotFoundPage/>}></Route>
            </Routes>
        </BrowserRouter>
    )


}

export default Routing;
