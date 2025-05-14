import KebabMenu from "./KebabMenu";
import style from "./TaskCard.module.css";

/*MUI*/
import PlayArrowIcon from '@mui/icons-material/PlayArrow'; 
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';

import { HandleTimerFuncs } from "../../../time/HandleTimerFuncs";
import { useState,useEffect,useRef ,useContext} from "react";
import { useModalControl } from "../../../context/ModalControlProvider";
import {useTaskTimer} from "../../../context/TaskTimerProvider"
import { ReceiptRussianRuble } from "lucide-react";

const TaskCard = ({task,tasks,getOptions,handleUpdateTask,isInCompletedTaskList}) =>{

    const {openModal} = useModalControl(); 
    const {elapsed,getTime,startTimer,stopTimer} =useTaskTimer();

    console.log(tasks) 
    
    return(
        <>
            <div className={style.cardBox}>
            <p>{`${task.taskTitle}`}</p>
            <ul>
                <li>
                    <button 
                    title="開始"
                    className={style.icon}
                    onClick={  ()=>{
                        const runTask = tasks.find( (task)=>task.taskStatus === "RUNNING" )   //作業中タスクが存在するかの確認 
                        
                        //すでに開始状態であれば何もしない
                        if (runTask && runTask.taskId === task.taskId) return;

                        //ほかタスクが開始状態ならば確認モーダル表示
                        if (runTask) {
                            openModal("START", task);
                            return;
                        }

                        //作業中タスクがなければ、このタスクを開始
                        startTimer(task);
                        handleUpdateTask(task.taskId, { taskStatus: "RUNNING" });
                    }
                    }>
                    <PlayArrowIcon/>
                    </button>
                </li>
                <li>
                    <button 
                    title="中断"
                    className={style.icon}
                    onClick={()=>{
                        const runTask = tasks.find( (task)=>task.taskStatus === "RUNNING" )   //作業中タスクが存在するかの確認 
                        
                        //作業中のタスクが中断されたとき
                        if (runTask && runTask.taskId === task.taskId){
                            stopTimer(task);
                            handleUpdateTask(task.taskId, {elapsedTime:elapsed, taskStatus: "PAUSE" });
                            return;
                        }

                        //作業中タスクに該当しない場合、指定タスクを中断
                        handleUpdateTask(task.taskId, { taskStatus: "PAUSE" });
                    }
                    }>
                    <PauseIcon/>
                    </button>
                </li>
                {isInCompletedTaskList ? (
                <li>
                    <button 
                    title="完了"
                    className={style.icon}
                    onClick={()=>{
                        const runTask = tasks.find( (task)=>task.taskStatus === "RUNNING" )   //作業中タスクが存在するかの確認 
                        
                        //作業中のタスクが停止したとき
                        if (runTask && runTask.taskId === task.taskId){
                            stopTimer(task);
                            handleUpdateTask(task.taskId, {elapsedTime:elapsed, taskStatus: "STOP" });
                            return;
                        }

                        //作業中タスクがなければ、このタスクを停止
                        handleUpdateTask(task.taskId, { taskStatus: "STOP" });
                        }
                    }>
                    <StopIcon/>
                    </button>
                </li>
                ):null
                }
            </ul>
                
            <p>{getTime(task)}</p>
            <KebabMenu task={task} tasks={tasks} getOptions={getOptions}></KebabMenu>
        </div>
        </>
    )


}

export default TaskCard;