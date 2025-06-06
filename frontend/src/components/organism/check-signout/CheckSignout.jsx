//Context
import { useModalControl } from "../../../context/ModalControlProvider";
import { useTaskTimer } from "../../../context/TaskTimerProvider";
import { postSignout } from "../../../api/taskApi";
import { useAuth } from "../../../context/AuthenticationProvider";


//css
import cx from "classnames";
import style from "./CheckSignout.module.css"
import baseStyle from "../../../style/Util.module.css"
import { useNavigate } from "react-router-dom";


const CheckSignout = ({tasks,handleUpdateTask}) =>{

    const {closeModal,currentTask} = useModalControl();  
    const {elapsed,startTimer,switchTaskTimer} = useTaskTimer(); 
    const {isAuth,setIsAuth} = useAuth();

    const navigate = useNavigate();
    
    //サインアウト処理
    const handleSignout = async() =>{
        try {
            await postSignout();
            console.log("できてる？")
            setIsAuth(false);
            closeModal();
            navigate("/");
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
                        onClick={  () => handleSignout()} 
                    className={cx(baseStyle.baseBtn,style.createBtn)}                       
                    >問題ない</button>
                </div>
            </div>
        </>

    )

}

export default CheckSignout;