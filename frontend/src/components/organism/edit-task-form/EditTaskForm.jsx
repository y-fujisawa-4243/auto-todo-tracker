import { useState,useContext } from "react";
import { useModalControl } from "../../../context/ModalControlProvider";

//css
import cx from "classnames";
import style from "./EditTaskForm.module.css"
import baseStyle from "../../../style/Util.module.css"

const EditTaskForm = ({handleUpdateTask}) =>{

    const {closeModal, currentTask} = useModalControl();   

    const [title,setTitle] = useState();
    const [description,setDescription] = useState();

    return(
        <div className={style.container}>
        <h3>タスク編集フォーム</h3>
        <form>
            <div className={style.formBox}>
                <label>タスク名</label>
                <input
                    type="text"
                    placeholder={currentTask.taskTitle}
                    required
                    onChange={(event) => setTitle(event.target.value)}
                ></input>
            </div>
            <div className={style.formBox}>
                <label>タスク説明</label>
                <textarea
                    placeholder={currentTask.taskDescription}
                    onChange={(event) => setDescription(event.target.value)}
                ></textarea>
            </div>
        </form>

        <div className={style.btnWrap}>

            <button 
                onClick={() => closeModal()}
                className={cx(baseStyle.baseBtn,style.cancelBtn)}
                >キャンセル
            </button>
            <button 
                type="submit" 
                onClick={()=>handleUpdateTask(currentTask.taskId,{taskTitle:title,taskDescriptionescription:description})}
                className={cx(baseStyle.baseBtn,style.createBtn)}
                >保存
            </button>


        </div>
      </div>
    )
}

export default EditTaskForm;