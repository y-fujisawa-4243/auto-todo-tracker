//Reactライブラリ
import { useState } from 'react';

//MUI
import PlayArrowIcon from '@mui/icons-material/PlayArrow'; 
import PauseIcon from '@mui/icons-material/Pause';
import DoneIcon from '@mui/icons-material/Done';

//コンポーネント
import KebabMenu from "./KebabMenu";

//Context
import { useModalControl } from "../../../context/ModalControlProvider";
import {useTaskTimer} from "../../../context/TaskTimerProvider"

//util関数
import { removeRunTaskBu } from "../../../util/taskUtil";

//グローバル定数
import { MODAL_TYPE,  TAKS_STATUS } from "../../../constants/appConstants";

//スタイル
import style from "./TaskCard.module.css";


const TaskCard = ({task,tasks,getOptions,handleUpdateTask,isInCompletedTaskList}) =>{

    const {openModal} = useModalControl(); 
    const {elapsed,getTime,startTimer,stopTimer} =useTaskTimer();

    const [isSubmit,setIsSubmit] = useState(false);  //ボタン連打に対応するため、ボタン状態を管理

    const runTask = tasks.find( (task)=>task.taskStatus === TAKS_STATUS.RUNNING )   //進捗中タスク


    //完了or中断ボタンハンドラー
    const handleStopOrPause = async(status) => {

        //多重送信防止
        if(isSubmit) return;
        setIsSubmit(true)

        //ボタン押したタスクが進捗中タスクの場合は、停止処理
        if (runTask && runTask.taskId === task.taskId){
            removeRunTaskBu();

            //更新処理が失敗した場合、タイマー処理せずにreturn
            const succes = await handleUpdateTask(task.taskId, {elapsedTime:elapsed, taskStatus: status });
            setIsSubmit(false)
            if(!succes) return;
            await stopTimer(task);
            return;
        }

        //ボタンを押したタスクが進捗中タスクではないときは、遷移処理のみ

        //更新処理が失敗した場合、タイマー処理せずにreturn
        const succes = await handleUpdateTask(task.taskId, { taskStatus: status });
        setIsSubmit(false)
        if(!succes) return;
    }


    //開始ボタンハンドラー
    const handleStart = async() => {

        //多重送信防止
        if(isSubmit) return;
        setIsSubmit(true)

        //クリックしたタスクの他に進捗中タスクがある場合
        if (runTask) {
            openModal(MODAL_TYPE.WARN_RUN, task);
            setIsSubmit(false)
            return;
        }

        //ほかの進捗中タスクが存在しない場合

        //更新処理が失敗した場合、タイマー処理せずにreturn
        const succes = await handleUpdateTask(task.taskId, { taskStatus: TAKS_STATUS.RUNNING });
        setIsSubmit(false)
        if(!succes) return;

        startTimer(task);

        return;
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