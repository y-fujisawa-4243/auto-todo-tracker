
import { useContext } from "react";
import { useModalControl } from "../../../context/ModalControlProvider";

//css
import cx from "classnames";
import style from "./TaskOver.module.css"
import baseStyle from "../../../style/Util.module.css"

const TaskOver= () =>{

    const {closeModal,currentTask} = useModalControl();   

    return(
        <>
            <div className={style.formBox}>
                <h3>※タスク数が上限に達しています！</h3>
                <p>お手数ですが、タスク数を50個未満にしたうえで再度作成をお願いいたします。</p>
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

export default TaskOver;