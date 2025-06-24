//Reactライブラリ
import { useNavigate } from "react-router-dom";

//Context
import { useModalControl } from "../../../context/ModalControlProvider";
import { useTaskTimer } from "../../../context/TaskTimerProvider";
import { useAuth } from "../../../context/AuthenticationProvider";

//API関数
import { postSignout } from "../../../api/taskApi";

//グローバル定数
import { ROUTE_PATHS, STORAGE_NAMES, TAKS_STATUS } from "../../../constants/appConstants";

//スタイル
import cx from "classnames";
import style from "./CheckSignout.module.css"
import baseStyle from "../../../style/Util.module.css"


const CheckSignout = ({tasks}) =>{

    const {closeModal} = useModalControl();  
    const {stopTimer} = useTaskTimer(); 
    const {setIsAuth} = useAuth();

    const navigate = useNavigate();
    
    //サインアウト処理
    const handleSignout = async() =>{

        const runTask = (tasks??[]).filter( task=>task.taskStatus===TAKS_STATUS.RUNNING);

        //仮に進捗中タスクがあるならば、サインアウト時点で復旧フラグを立てる
        if(runTask.length!==0) {
            await stopTimer(runTask[0]);    //※進捗中タスクは1つまでという仕様前提の記述
            localStorage.setItem(STORAGE_NAMES.NEED_RECOVERY_BY_HOME, "true");
        }

        try {
            await postSignout();
            setIsAuth(false);
            closeModal();
            navigate(ROUTE_PATHS.HOME);
        } catch (error) {
            console.log(error);
        }
        
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
                        onClick={()=>handleSignout()} 
                    className={cx(baseStyle.baseBtn,style.createBtn)}                       
                    >問題ない</button>
                </div>
            </div>
        </>

    )

}

export default CheckSignout;