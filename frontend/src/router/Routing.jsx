import { BrowserRouter, Routes, Route, useLocation, useNavigate} from "react-router-dom"
import { useState,useMemo,useEffect, useRef} from "react";

//各コンポーネント
import Home from "../components/pages/home/Home.jsx"
import InCompletedTaskList from "../components/pages/incompleted-task-list/InCompletedTaskList.jsx";
import CompletedTaskList from "../components/pages/completed-task-list/CompletedTaskList.jsx";
import NotFoundPage from "../components/pages/not-found-page/NotFoundPage.jsx";

import { useAuth } from "../context/AuthenticationProvider.jsx";

//path定義ファイル
import ROUTE_PATHS  from "./routePath.js";

import { Navigate } from "react-router-dom";



const Routing = () =>{

    const [tasks,setTasks] = useState([]);      //フロント側のTaskリスト
    const {isAuth} = useAuth();     //認証状態

    
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
                <Route path={ROUTE_PATHS.LIST} element=
                    {isAuth ? <InCompletedTaskList tasks={tasks} setTasks={setTasks} />:<Navigate to={ROUTE_PATHS.HOME}/>}></Route>
                <Route path={ROUTE_PATHS.COMPLETE} element=
                    {isAuth ? <CompletedTaskList tasks={tasks} setTasks={setTasks}/>:<Navigate to={ROUTE_PATHS.HOME}/>}></Route>
                <Route path={ROUTE_PATHS.NOT_FOUND} element=
                    {<NotFoundPage/>}></Route>
            </Routes>
        </BrowserRouter>
    )


}

export default Routing;
