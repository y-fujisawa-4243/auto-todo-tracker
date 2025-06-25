//Context
import { useModalControl } from "../../../context/ModalControlProvider";

//スタイル
import cx from "classnames";
import style from "./TaskDetail.module.css"
import baseStyle from "../../../style/Util.module.css"

const TaskDetail = () =>{

    const {closeModal,currentTask} = useModalControl();   
    
    return(
        <>
            <div className={style.formBox}>
                <h3>タスク詳細</h3>
                <dl>
                    <dt><b>タスク名</b></dt>
                    <dd>{currentTask.taskTitle}</dd>
                    <dt><b>タスク説明</b></dt>
                    <dd>{currentTask.taskDescription}</dd>
                    <dt><b>作成日</b></dt>
                    <dd>{currentTask.createdAt}</dd>
                </dl>
            </div>
            <div className={style.btnWrap}>
                <button
                    onClick={() => closeModal()}
                    className={cx(style.cancelBtn,baseStyle.baseBtn)}
                    >閉じる
                </button>
            </div>
        </>
    )

}

export default TaskDetail;