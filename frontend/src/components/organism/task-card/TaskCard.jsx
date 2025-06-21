import KebabMenu from "./KebabMenu";
import style from "./TaskCard.module.css";

/*MUI*/
import PlayArrowIcon from '@mui/icons-material/PlayArrow'; 
import PauseIcon from '@mui/icons-material/Pause';

import { useModalControl } from "../../../context/ModalControlProvider";
import {useTaskTimer} from "../../../context/TaskTimerProvider"
import DoneIcon from '@mui/icons-material/Done';
import { MODAL_TYPE, TAKS_STATUS } from "../../../constants/appConstants";

const TaskCard = ({task,tasks,getOptions,handleUpdateTask,isInCompletedTaskList}) =>{

    const {openModal} = useModalControl(); 
    const {elapsed,getTime,startTimer,stopTimer} =useTaskTimer();
    
    return(
        <>
            <div  className={`${style.cardBox} ${task.taskStatus === TAKS_STATUS.RUNNING ? style.runningShadow : null}`}>
            <ul>
                <li>
                {isInCompletedTaskList ? (
                    <button 
                    title="完了"
                    className={style.nomalDoneIcon}
                    onClick={ async()=>{
                        const runTask = tasks.find( (task)=>task.taskStatus === TAKS_STATUS.RUNNING )   //作業中タスクが存在するかの確認 
                        
                        //作業中のタスクが停止したとき
                        if (runTask && runTask.taskId === task.taskId){
                            stopTimer(task);
                            await handleUpdateTask(task.taskId, {elapsedTime:elapsed, taskStatus: TAKS_STATUS.STOP });
                            return;
                        }

                        //作業中タスクがなければ、このタスクを停止
                        await handleUpdateTask(task.taskId, { taskStatus: TAKS_STATUS.STOP });
                        }
                    }>
                    </button>
                ):(   
                    <button 
                    title="再開"
                    className={style.checkDoneIcon}
                    onClick={async ()=>{
                        const runTask = tasks.find( (task)=>task.taskStatus === TAKS_STATUS.RUNNING )   //作業中タスクが存在するかの確認 

                        //タスクを未実施へ復帰
                        await handleUpdateTask(task.taskId, { taskStatus: TAKS_STATUS.TODO });
                        }
                    }>
                    <DoneIcon/>
                    </button>                    
                )
                }
                </li>
                <li>
                {isInCompletedTaskList && (
                    task.taskStatus === TAKS_STATUS.RUNNING ? (
                    <button
                        title="中断"
                        className={style.pauseIcon}
                        onClick={ async () => {
                        const runTask = tasks.find((task) => task.taskStatus === TAKS_STATUS.RUNNING);
                        if (runTask && runTask.taskId === task.taskId) {
                            stopTimer(task);
                            await handleUpdateTask(task.taskId, { elapsedTime: elapsed, taskStatus: TAKS_STATUS.PAUSE });
                            return;
                        }
                        await handleUpdateTask(task.taskId, { taskStatus: TAKS_STATUS.PAUSE });
                        }}
                    >
                        <PauseIcon />
                    </button>
                    ) : (
                    <button
                        title="開始"
                        className={style.startIcon}
                        onClick={async () => {
                        const runTask = tasks.find((task) => task.taskStatus === TAKS_STATUS.RUNNING);
                        if (runTask && runTask.taskId === task.taskId) return;
                        if (runTask) {
                            openModal(MODAL_TYPE.WARN_RUN, task);
                            return;
                        }
                        startTimer(task);
                        await handleUpdateTask(task.taskId, { taskStatus: TAKS_STATUS.RUNNING });
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