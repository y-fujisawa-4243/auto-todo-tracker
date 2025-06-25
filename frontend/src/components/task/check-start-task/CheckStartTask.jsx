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
    
    //現在進捗中タスクと開始させたいタスクの切り替え処理
    const changeFunction = async() =>{

        const runTaskArray =  tasks.filter( (task) => task.taskStatus === TAKS_STATUS.RUNNING)

        //更新処理が失敗した場合、タイマーなどは止めずに関数を抜ける
        const stopSucces = await handleUpdateTask(runTaskArray[0].taskId,{taskStatus:TAKS_STATUS.PAUSE,elapsedTime:elapsed})
        if(!stopSucces) return;
        await stopTimer(runTaskArray[0])

        const startSucces = await handleUpdateTask(currentTask.taskId,{taskStatus:TAKS_STATUS.RUNNING})
        if(!startSucces ) return;
        await startTimer(currentTask)   

        return;
    }

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
                        onClick={changeFunction}
                    className={cx(baseStyle.baseBtn,style.createBtn)}                       
                    >問題ない</button>
                </div>
            </div>
        </>

    )

}

export default CheckStartTask;