
import { useNavigate} from "react-router-dom";
import { useEffect, useContext, useMemo } from "react";

import cx from "classnames";
import style from "./Home.module.css";
import baseStyle from "../../../style/Util.module.css";

import ROUTE_PATHS from "../../../router/routePath";
import { useTaskTimer } from "../../../context/TaskTimerProvider";

const Home = ({tasks}) =>{

    const {stopTimer} = useTaskTimer(); 
    const navigate = useNavigate();

    //tasksの値が更新されたとき、グルーピング処理
    const groupedTasks = useMemo( ()=>{
        return{
        "RUNNING":tasks.filter( task=>task.taskStatus==="RUNNING" ),
        "PAUSE":tasks.filter( task=>task.taskStatus==="PAUSE" ),
        "TODO":tasks.filter( task=>task.taskStatus==="TODO" ),
        "STOP":tasks.filter( task=>task.taskStatus==="STOP" )
        }   
    },[tasks] )

    //画面遷移検知
    useEffect( ()=>{

        if(groupedTasks["RUNNING"].length === 0) return;
        const runTask = groupedTasks["RUNNING"][0];   
        stopTimer(runTask);

        //タブ削除、ブラウザ削除時
        const handleBeforeUnload = () => {
            localStorage.setItem("needRecoveryByHome", "true");
        };

        return () => {
            handleBeforeUnload();
        };

    },[tasks])

    return(
        <div className={style.container}>
            <h1>TrackDo</h1>
            <p>タスクと一緒に作業時間も管理しましょう</p>
            <button 
                onClick={()=>navigate(ROUTE_PATHS.LIST)}
                className={cx(baseStyle.baseBtn,style.button)}
            >タスク一覧へ</button>
        </div>
    )
}

export default Home;
