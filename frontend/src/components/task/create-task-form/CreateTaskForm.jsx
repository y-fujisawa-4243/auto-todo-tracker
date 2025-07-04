//Reactライブラリ
import { useState,useRef} from "react";

//Context
import { useModalControl } from "../../../context/ModalControlProvider";

//util関数
import { validateInput } from "../../../util/taskUtil";

//グローバル定数
import { MODAL_TYPE } from "../../../constants/appConstants";

//スタイル
import cx from "classnames";
import style from "./CreateTaskForm.module.css"
import baseStyle from "../../../style/Util.module.css"



const CreataeTaskForm = ({tasks,handleCreateTask}) =>{

    const {openModal,closeModal} = useModalControl();   

    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");

    const [inputError,setInputError] = useState({
        taskTitle:"",
        taskDescription:""
    });

    const isSubmit = useRef(null)  //ボタン連打に対応するためのRefオブジェクト

    //作成処理関数
    const criateFunction = () => {

        const MAX_TASK = 50;        //最大タスク数
        
        //多重送信防止
        if(isSubmit.current) return;
        isSubmit.current = true;
        
        //バリデーション
        const errors = validateInput(title,description);
        if(Object.keys(errors).length > 0){
            setInputError(errors);
            isSubmit.current = false;           
            return;
        }
        setInputError({}); 

        //タスク数確認
        if(Object.keys(tasks).length >= MAX_TASK){
            closeModal();
            isSubmit.current = false;
            openModal(MODAL_TYPE.TASK_OVER);
            return;
        }

        //送信
        handleCreateTask(title,description)
        isSubmit.current = false;
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