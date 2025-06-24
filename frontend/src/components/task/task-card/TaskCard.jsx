import KebabMenu from "./KebabMenu";
import style from "./TaskCard.module.css";

/*MUI*/
import PlayArrowIcon from '@mui/icons-material/PlayArrow'; 
import PauseIcon from '@mui/icons-material/Pause';

import { useModalControl } from "../../../context/ModalControlProvider";
import {useTaskTimer} from "../../../context/TaskTimerProvider"
import DoneIcon from '@mui/icons-material/Done';
import { MODAL_TYPE, STORAGE_NAMES, TAKS_STATUS } from "../../../constants/appConstants";
import { removeRunTaskBu } from "../../../util/taskUtil";

const TaskCard = ({task,tasks,getOptions,handleUpdateTask,isInCompletedTaskList}) =>{

    const {openModal} = useModalControl(); 
    const {elapsed,getTime,startTimer,stopTimer} =useTaskTimer();

    const runTask = tasks.find( (task)=>task.taskStatus === TAKS_STATUS.RUNNING )   //進捗中タスク


    //完了or中断ボタンハンドラー
    const handleStopOrPause = async(status) => {

        //進捗中タスクが停止したとき
        if (runTask && runTask.taskId === task.taskId){
            removeRunTaskBu();
            await stopTimer(task);
            await handleUpdateTask(task.taskId, {elapsedTime:elapsed, taskStatus: status });
            return;
        }

        //クリックしたタスクが進捗中タスクではないとき
        await handleUpdateTask(task.taskId, { taskStatus: status });
    }


    //開始ボタンハンドラー
    const handleStart = async() => {

        //クリックしたタスクの他に進捗中タスクがある場合
        if (runTask) {
            openModal(MODAL_TYPE.WARN_RUN, task);
            return;
        }

        //ほかの進捗中タスクが存在しない場合
        startTimer(task);
        await handleUpdateTask(task.taskId, { taskStatus: TAKS_STATUS.RUNNING });
        
    }

    
    return(
        <>
            <div  className={`${style.cardBox} ${task.taskStatus === TAKS_STATUS.RUNNING ? style.runningShadow : null}`}>
            <ul>
                <li>
                {isInCompletedTaskList ? (
                    <button 
                        title="完了"
                        className={style.nomalDoneIcon}
                        onClick={()=>handleStopOrPause(TAKS_STATUS.STOP)}>
                    </button>
                ):(   
                    <button 
                        title="再開"
                        className={style.checkDoneIcon}
                        onClick={async ()=>{
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
                        onClick={()=>handleStopOrPause(TAKS_STATUS.PAUSE)}
                    >
                        <PauseIcon />
                    </button>
                    ) : (
                    <button
                        title="開始"
                        className={style.startIcon}
                        onClick={handleStart}
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