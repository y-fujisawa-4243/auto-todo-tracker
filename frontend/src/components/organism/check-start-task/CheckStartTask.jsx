import { useContext } from "react";
import { useModalControl } from "../../../context/ModalControlProvider";

//css
import cx from "classnames";
import style from "./CheckStartTask.module.css"
import baseStyle from "../../../style/Util.module.css"
import { useTaskTimer } from "../../../context/TaskTimerProvider";

const CheckStartTask = ({tasks,handleUpdateTask}) =>{

    const {closeModal,currentTask} = useModalControl();  
    const {elapsed,startTimer,switchTaskTimer} = useTaskTimer();    

    return(
        <>
            <div className={style.formBox}>
                <h3>現在作業中のタスクが中断しますが、よろしいでしょうか？</h3>
                <div className={style.btnWrap}>
                    <button 
                    onClick={()=>closeModal()}
                    className={cx(baseStyle.baseBtn,style.cancelBtn)}    
                    >いいえ</button>
                    <button 
                    onClick={ async () =>{
                        const runTaskArray =  tasks.filter( (task) => task.status === "RUNNING")
                        console.log(`${currentTask}//${runTaskArray[0]}`)

                        switchTaskTimer(runTaskArray[0])
                        await handleUpdateTask(runTaskArray[0].id,{status:"PAUSE",time:elapsed})

                        startTimer(currentTask)
                        await handleUpdateTask(currentTask.id,{status:"RUNNING"})
                    } }
                    className={cx(baseStyle.baseBtn,style.createBtn)}                       
                    >はい</button>
                </div>
            </div>
        </>

    )

}

export default CheckStartTask;