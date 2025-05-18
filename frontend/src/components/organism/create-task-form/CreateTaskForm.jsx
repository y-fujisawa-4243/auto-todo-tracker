import { useState,useContext } from "react";
import { useModalControl } from "../../../context/ModalControlProvider";

//css
import cx from "classnames";
import style from "./CreateTaskForm.module.css"
import baseStyle from "../../../style/Util.module.css"

const CreataeTaskForm = ({handleCreateTask}) =>{

    const {closeModal} = useModalControl();   

    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");

    const [inputError,setInputError] = useState({
        taskTitle:"",
        taskDescription:""
    });

    const handleValidateInput = (title,description) => {
        const errors = {};

        if ((title ?? "").trim() ==="") {
            errors.taskTitle = "※タイトルは必須です";
        } else if (title.length > 20) {
            errors.taskTitle = "※タイトルは20文字以内で入力してください";
        }

        if (description.length > 256) {
            errors.taskDescription = "※説明は256文字以内で入力してください";
        }

        return errors;
  };


    return(
        <div className={style.container}>
        <h3>新規タスク作成フォーム</h3>
        <form>
            <div className={style.formBox}>
                <label>タスク名</label>
                <input
                    type="text"
                    placeholder="タスク名を入力してください (20字以内)"
                    onChange={(event) => setTitle(event.target.value)}
                ></input>
                {inputError.taskTitle&&(
                    <p className={style.errorMsg}>{inputError.taskTitle}</p>
                )}
            </div>
            <div className={style.formBox}>
                <label>タスク説明</label>
                <textarea
                    placeholder="タスク説明を入力してください (256字以内)"
                    onChange={(event) => setDescription(event.target.value)}
                ></textarea>
                {inputError.taskDescription&&(
                    <p className={style.errorMsg}>{inputError.taskDescription}</p>
                )}
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
                onClick={()=>{

                    const errors = handleValidateInput(title,description);

                    if(Object.keys(errors).length > 0){
                        setInputError(errors);
                        return;
                    }
                    setInputError({}); 
                    handleCreateTask(title,description)
                }}

                
                className={cx(baseStyle.baseBtn,style.createBtn)}
                >作成
            </button>
        </div>
      </div>
    )
}

export default CreataeTaskForm