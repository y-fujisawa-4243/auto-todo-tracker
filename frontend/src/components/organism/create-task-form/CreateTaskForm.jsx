import { useState,useContext } from "react";
import { useModalControl } from "../../../context/ModalControlProvider";

//css
import cx from "classnames";
import style from "./CreateTaskForm.module.css"
import baseStyle from "../../../style/Util.module.css"

const CreataeTaskForm = ({handleCreateTask}) =>{

    const {closeModal} = useModalControl();   

    const [title,setTitle] = useState();
    const [description,setDescription] = useState();



    return(
        <div className={style.container}>
        <h3>新規タスク作成フォーム</h3>
        <form>
            <div className={style.formBox}>
                <label>タスク名</label>
                <input
                    type="text"
                    placeholder="タスク名を入力してください"
                    required
                    onChange={(event) => setTitle(event.target.value)}
                ></input>
            </div>
            <div className={style.formBox}>
                <label>タスク説明</label>
                <textarea
                    placeholder="タスク説明を入力してください"
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
                onClick={()=>handleCreateTask(title,description)}
                className={cx(baseStyle.baseBtn,style.createBtn)}
                >作成
            </button>
        </div>
      </div>
    )
}

export default CreataeTaskForm