import { useContext } from "react";
import { useModalControl } from "../../../context/ModalControlProvider";

//css
import cx from "classnames";
import style from "./CheckDeleteTask.module.css"
import baseStyle from "../../../style/Util.module.css"
import { useTaskTimer } from "../../../context/TaskTimerProvider";

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
                    >いいえ</button>
                    <button 
                    onClick={() => {
                        stopTimer(currentTask)
                        handleDeleteTask(currentTask.id)
                    }
                    }
                    className={cx(baseStyle.baseBtn,style.createBtn)}                       
                    >はい</button>
                 </div>
            </div>
        </>

    )

}

export default CheckDeleteTask;