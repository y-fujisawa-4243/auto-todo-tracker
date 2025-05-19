import KebabMenu from "./KebabMenu";
import style from "./TaskCard.module.css";

/*MUI*/
import PlayArrowIcon from '@mui/icons-material/PlayArrow'; 
import PauseIcon from '@mui/icons-material/Pause';

import { useModalControl } from "../../../context/ModalControlProvider";
import {useTaskTimer} from "../../../context/TaskTimerProvider"
import DoneIcon from '@mui/icons-material/Done';

const TaskCard = ({task,tasks,getOptions,handleUpdateTask,isInCompletedTaskList}) =>{

    const {openModal} = useModalControl(); 
    const {elapsed,getTime,startTimer,stopTimer} =useTaskTimer();

    console.log(tasks) 
    
    return(
        <>
            <div className={style.cardBox}>

            <ul>
                <li>
                {isInCompletedTaskList ? (
                    <button 
                    title="完了"
                    className={style.nomalDoneIcon}
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
                    </button>
                ):(   
                    <button 
                    title="リトライ"
                    className={style.checkDoneIcon}
                    onClick={()=>{
                        const runTask = tasks.find( (task)=>task.taskStatus === "RUNNING" )   //作業中タスクが存在するかの確認 

                        //タスクを未実施へ復帰
                        handleUpdateTask(task.taskId, { taskStatus: "TODO" });
                        }
                    }>
                    <DoneIcon/>
                    </button>                    
                )
                }
                </li>
                <li>
                {isInCompletedTaskList && (
                    task.taskStatus === "RUNNING" ? (
                    <button
                        title="中断"
                        className={style.pauseIcon}
                        onClick={() => {
                        const runTask = tasks.find((task) => task.taskStatus === "RUNNING");
                        if (runTask && runTask.taskId === task.taskId) {
                            stopTimer(task);
                            handleUpdateTask(task.taskId, { elapsedTime: elapsed, taskStatus: "PAUSE" });
                            return;
                        }
                        handleUpdateTask(task.taskId, { taskStatus: "PAUSE" });
                        }}
                    >
                        <PauseIcon />
                    </button>
                    ) : (
                    <button
                        title="開始"
                        className={style.startIcon}
                        onClick={() => {
                        const runTask = tasks.find((task) => task.taskStatus === "RUNNING");
                        if (runTask && runTask.taskId === task.taskId) return;
                        if (runTask) {
                            openModal("START", task);
                            return;
                        }
                        startTimer(task);
                        handleUpdateTask(task.taskId, { taskStatus: "RUNNING" });
                        }}
                    >
                        <PlayArrowIcon />
                    </button>
                    )
                )}
                </li>


            </ul>
            <p className={style.taskTitle}>{`${task.taskTitle}`}</p>
            <p className={style.time}>{getTime(task)}</p>
            <KebabMenu task={task} tasks={tasks} getOptions={getOptions}></KebabMenu>
        </div>
        </>
    )


}

export default TaskCard;