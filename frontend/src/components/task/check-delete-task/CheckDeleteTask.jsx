//Reactコンポーネント
import { useState } from "react";

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
    const [isSubmit,setIsSubmit] = useState(false); //ボタン連打に対応するため、ボタン状態を管理 
    
    //削除処理
    const deleteFunction = async() =>{

        //多重送信防止
        if(isSubmit) return;
        setIsSubmit(true)

        //削除処理でエラーが発生した場合は、タイマー処理は実施せずにreturn
        const succes = await handleDeleteTask(currentTask.taskId)
        setIsSubmit(false)
        if(!succes) return;

        await stopTimer(currentTask)
        return;
    }

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
                    onClick={()=>{
                        deleteFunction()
                        closeModal()
                    }}
                    className={cx(baseStyle.baseBtn,style.createBtn)}                       
                    >削除する</button>
                </div>
            </div>
        </>

    )

}

export default CheckDeleteTask;