import { BrowserRouter, Routes, Route, useLocation} from "react-router-dom"
import { useState,useMemo,useEffect, useRef} from "react";

//各コンポーネント
import Home from "../components/pages/home/Home.jsx"
import InCompletedTaskList from "../components/pages/incompleted-task-list/InCompletedTaskList.jsx";
import CompletedTaskList from "../components/pages/completed-task-list/CompletedTaskList.jsx";
import NotFoundPage from "../components/pages/not-found-page/NotFoundPage.jsx";

//path定義ファイル
import ROUTE_PATHS  from "./routePath.js";



const Routing = () =>{

    const [tasks,setTasks] = useState([]);      //フロント側のTaskリスト

    //tasksの値が更新されたとき、グルーピング処理
    const groupedTasks = useMemo( ()=>{
        return{
        "RUNNING":tasks.filter( task=>task.taskStatus==="RUNNING" ),
        "PAUSE":tasks.filter( task=>task.taskStatus==="PAUSE" ),
        "TODO":tasks.filter( task=>task.taskStatus==="TODO" ),
        "STOP":tasks.filter( task=>task.taskStatus==="STOP" )
        }   
    },[tasks] )

    //システムダウンの検知
    useEffect( ()=>{

        console.log("監視中...")

        //タブ削除、ブラウザ削除時
        const handleBeforeUnload = () => {
            if(groupedTasks["RUNNING"].length === 0) return;
            localStorage.setItem("needRecoveryBySystem", "true");
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };

    },[tasks])


    return(
        <BrowserRouter>
            <Routes>
                <Route path={ROUTE_PATHS.HOME} element={<Home tasks={tasks} />}></Route>
                <Route path={ROUTE_PATHS.LIST} element={<InCompletedTaskList tasks={tasks} setTasks={setTasks} />}></Route>
                <Route path={ROUTE_PATHS.COMPLETE} element={<CompletedTaskList tasks={tasks} setTasks={setTasks}/>}></Route>
                <Route path={ROUTE_PATHS.NOT_FOUND} element={<NotFoundPage/>}></Route>
            </Routes>
        </BrowserRouter>
    )


}

export default Routing;
