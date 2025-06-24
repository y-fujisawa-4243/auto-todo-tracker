//Context
import { useModalControl } from "../../../context/ModalControlProvider";
import { useTaskTimer } from "../../../context/TaskTimerProvider";

//スタイル
import cx from "classnames";
import style from "./CheckStartTask.module.css"
import baseStyle from "../../../style/Util.module.css"

//グローバル定数
import { TAKS_STATUS } from "../../../constants/appConstants";


const CheckStartTask = ({tasks,handleUpdateTask}) =>{

    const {closeModal,currentTask} = useModalControl();  
    const {elapsed,startTimer,stopTimer} = useTaskTimer();    

    return(
        <>
            <div className={style.formBox}>
                <h3>現在進捗中のタスクが中断しますが、<br/>よろしいでしょうか？</h3>
                <div className={style.btnWrap}>
                    <button 
                    onClick={()=>closeModal()}
                    className={cx(baseStyle.baseBtn,style.cancelBtn)}    
                    >キャンセル</button>
                    <button 
                        onClick={ async () =>{
                            const runTaskArray =  tasks.filter( (task) => task.taskStatus === TAKS_STATUS.RUNNING)
                            console.log(`${currentTask}//${runTaskArray[0]}`)

                            stopTimer(runTaskArray[0])
                            await handleUpdateTask(runTaskArray[0].taskId,{taskStatus:TAKS_STATUS.PAUSE,elapsedTime:elapsed})

                            startTimer(currentTask)
                            await handleUpdateTask(currentTask.taskId,{taskStatus:TAKS_STATUS.RUNNING})
                        } }
                    className={cx(baseStyle.baseBtn,style.createBtn)}                       
                    >問題ない</button>
                </div>
            </div>
        </>

    )

}

export default CheckStartTask;