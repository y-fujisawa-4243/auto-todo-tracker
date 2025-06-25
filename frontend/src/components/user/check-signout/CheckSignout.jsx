//Reactライブラリ
import { useRef} from "react";

//Context
import { useModalControl } from "../../../context/ModalControlProvider";
import { useTaskTimer } from "../../../context/TaskTimerProvider";

//グローバル定数
import { STORAGE_NAMES, TAKS_STATUS } from "../../../constants/appConstants";

//スタイル
import cx from "classnames";
import style from "./CheckSignout.module.css"
import baseStyle from "../../../style/Util.module.css"


const CheckSignout = ({tasks,handleSignout}) =>{

    const isSubmit = useRef(null); //ボタン状態管理用

    const {closeModal} = useModalControl();  
    const {stopTimer} = useTaskTimer(); 

    
    //サインアウト処理
    const signoutFunction = async() =>{

        //多重送信防止処理
        if(isSubmit.current) return;
        isSubmit.current = true;

        const runTask = (tasks??[]).filter( task=>task.taskStatus===TAKS_STATUS.RUNNING);

        //仮に進捗中タスクがあるならば、サインアウト時点で復旧フラグを立てる
        if(runTask.length!==0) {
            await stopTimer(runTask[0]);    //※進捗中タスクは1つまでという仕様前提の記述
            localStorage.setItem(STORAGE_NAMES.NEED_RECOVERY_BY_HOME, "true");
        }

        await handleSignout()
        isSubmit.current = false;
    }

    return(
        <>
            <div className={style.formBox}>
                <h3>サインアウトしますがよろしいでしょうか？</h3>
                <p>※サインアウト時はタスクの計測が行われません</p>
                <div className={style.btnWrap}>
                    <button 
                        onClick={()=>closeModal()}
                        className={cx(baseStyle.baseBtn,style.cancelBtn)}    
                    >キャンセル</button>
                    <button 
                        onClick={signoutFunction} 
                    className={cx(baseStyle.baseBtn,style.createBtn)}                       
                    >問題ない</button>
                </div>
            </div>
        </>

    )

}

export default CheckSignout;