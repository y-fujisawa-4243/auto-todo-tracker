//Context
import { useModalControl } from "../../../context/ModalControlProvider";
import { useTaskTimer } from "../../../context/TaskTimerProvider";

//css
import cx from "classnames";
import style from "./CheckStartTask.module.css"
import baseStyle from "../../../style/Util.module.css"


const CheckStartTask = ({tasks,handleUpdateTask}) =>{

    const {closeModal,currentTask} = useModalControl();  
    const {elapsed,startTimer,switchTaskTimer} = useTaskTimer();    

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
                            const runTaskArray =  tasks.filter( (task) => task.taskStatus === "RUNNING")
                            console.log(`${currentTask}//${runTaskArray[0]}`)

                            switchTaskTimer(runTaskArray[0])
                            await handleUpdateTask(runTaskArray[0].taskId,{taskStatus:"PAUSE",elapsedTime:elapsed})

                            startTimer(currentTask)
                            await handleUpdateTask(currentTask.taskId,{taskStatus:"RUNNING"})
                        } }
                    className={cx(baseStyle.baseBtn,style.createBtn)}                       
                    >問題ない</button>
                </div>
            </div>
        </>

    )

}

export default CheckStartTask;