//Reactライブラリ
import { useState} from "react";

//Context
import { useModalControl } from "../../../context/ModalControlProvider";

//util関数
import { validateInput } from "../../../util/taskUtil";

//スタイル
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

    const [isSubmit,setIsSubmit] = useState(false);

    //作成処理関数
    const criateFunction = () => {
        
        //多重送信防止
        if(isSubmit) return;
        setIsSubmit(true)
        
        //バリデーション
        const errors = validateInput(title,description);
        if(Object.keys(errors).length > 0){
            setInputError(errors);
            setIsSubmit(false);
            return;
        }
        setInputError({}); 

        //送信
        handleCreateTask(title,description)
    }

    return(
        <div className={style.container}>
        <h3>新規タスク作成フォーム</h3>
        <div>
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
        </div>
        <div className={style.btnWrap}>
            <button 
                onClick={() => closeModal()}
                className={cx(baseStyle.baseBtn,style.cancelBtn)}
                >キャンセル
            </button>
            <button 
                type="submit" 
                onClick={()=>criateFunction()}
                className={cx(baseStyle.baseBtn,style.createBtn)}
                >作成
            </button>
        </div>
    </div>
    )
}

export default CreataeTaskForm