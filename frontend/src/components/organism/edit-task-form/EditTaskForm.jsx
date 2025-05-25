import { useState,useContext } from "react";
import { useModalControl } from "../../../context/ModalControlProvider";

//css
import cx from "classnames";
import style from "./EditTaskForm.module.css"
import baseStyle from "../../../style/Util.module.css"

const EditTaskForm = ({handleUpdateTask}) =>{

    const {closeModal, currentTask} = useModalControl();   

    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");

    const [inputError,setInputError] = useState({
        taskTitle:"",
        taskDescription:""
    });

    const [isSubmit,setIsSubmit] = useState(false);

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
            <h3>タスク編集フォーム</h3>
            <div>
                <div className={style.formBox}>
                    <label>タスク名</label>
                    <input
                        type="text"
                        placeholder={currentTask.taskTitle}
                        required
                        onChange={(event) => setTitle(event.target.value)}
                    ></input>
                    {inputError.taskTitle&&(
                    <p className={style.errorMsg}>{inputError.taskTitle}</p>
                    )}
                </div>
                <div className={style.formBox}>
                    <label>タスク説明</label>
                    <textarea
                        placeholder={currentTask.taskDescription}
                        onChange={(event) => setDescription(event.target.value)}
                    ></textarea>
                    {inputError.taskDescription&&(
                    <p className={style.errorMsg}>{inputError.taskDescription}</p>
                    )}
                </div>
            </div>
            
            <div className={style.btnWrap}>
                <button 
                    onClick={() => closeModal()}
                    className={cx(baseStyle.baseBtn,style.cancelBtn)}
                    >キャンセル
                </button>
                <button 
                    type="submit" 
                    onClick={()=>{

                        //多重送信防止
                        if(isSubmit) return;
                        setIsSubmit(true)

                        //バリデーション    
                        const errors = handleValidateInput(title,description);
                        if(Object.keys(errors).length > 0){
                            setInputError(errors);
                            setIsSubmit(false);
                            return;
                        }
                        setInputError({});

                        //送信
                        handleUpdateTask(currentTask.taskId,{taskTitle:title,taskDescription:description})
                    }}
                    className={cx(baseStyle.baseBtn,style.createBtn)}
                    >保存
                </button>
            </div>
        </div>
    )
}

export default EditTaskForm;