//Context
import { useModalControl } from "../../../context/ModalControlProvider";
import { useTaskTimer } from "../../../context/TaskTimerProvider";

//スタイル
import cx from "classnames";
import style from "./CheckDeleteTask.module.css"
import baseStyle from "../../../style/Util.module.css"


const CheckDeleteTask = ({handleDeleteTask}) =>{

    const {closeModal,currentTask} = useModalControl(); 
    const {stopTimer} = useTaskTimer();  

    return(
        <>
            <div className={style.formBox}>
                <h3>このタスクを削除してもよろしいですか？</h3>
                <p>※削除すると元には戻せません</p>
                <div className={style.btnWrap}>
                    <button 
                    onClick={()=>closeModal()}
                    className={cx(baseStyle.baseBtn,style.cancelBtn)}    
                    >キャンセル</button>
                    <button 
                    onClick={() => {
                        stopTimer(currentTask)
                        handleDeleteTask(currentTask.taskId)
                    }
                    }
                    className={cx(baseStyle.baseBtn,style.createBtn)}                       
                    >削除する</button>
                </div>
            </div>
        </>

    )

}

export default CheckDeleteTask;