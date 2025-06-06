
import { useNavigate} from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import { useTaskTimer } from "../../../context/TaskTimerProvider";
import { useModalControl } from "../../../context/ModalControlProvider";
import { useAuth} from "../../../context/AuthenticationProvider"

import cx from "classnames";
import style from "./Home.module.css";
import baseStyle from "../../../style/Util.module.css";

import ROUTE_PATHS from "../../../router/routePath";

import { postSignIn ,postSignUp,postSignout} from "../../../api/taskApi";

import CreateUserAccount from "../../organism/create-user-account/CreateUserAccount";
import ModalForm from "../../layouts/modal-wrapper/ModalForm";

const Home = ({tasks}) =>{

    const [userId,setUserId] = useState("");
    const [password,setPassword] = useState("");

    const {stopTimer} = useTaskTimer(); 
    const {isOpen, openModal ,closeModal} = useModalControl();
    const {isAuth,setIsAuth} = useAuth();

    const navigate = useNavigate();


    //サインアップ時のエラーメッセージステート
    const [signupError,setSignupError] = useState({
        userIdMsg:"",
        passwordMsg:""
    });

    //サインイン時のエラーメッセージステート
    const [signinError,setSigninError] = useState({
        userIdMsg:"",
        passwordMsg:"",
        authMsg:""
    });


    //マウント時、認証状態ならばタスク一覧へ遷移
    useEffect( ()=>{
        console.log("認証？"+isAuth)
        if(isAuth){
            navigate(ROUTE_PATHS.LIST);
        }
        return;
    },[isAuth])


    //tasksの値が更新されたとき、グルーピング処理
    const groupedTasks = useMemo( ()=>{
        return{
        "RUNNING":tasks.filter( task=>task.taskStatus==="RUNNING" ),
        "PAUSE":tasks.filter( task=>task.taskStatus==="PAUSE" ),
        "TODO":tasks.filter( task=>task.taskStatus==="TODO" ),
        "STOP":tasks.filter( task=>task.taskStatus==="STOP" )
        }   
    },[tasks] )


    //ホーム画面遷移検知
    useEffect( ()=>{

        if(groupedTasks["RUNNING"]?.length === 0) return;
        const runTask = groupedTasks["RUNNING"][0];   
        
        stopTimer(runTask);

        //タブ削除、ブラウザ削除時
        const handleBeforeUnload = () => {
            localStorage.setItem("needRecoveryByHome", "true");

        };

        return () => {
            handleBeforeUnload();
        };

    },[tasks])


    //バリデーション
    const handleValidateUser = (userId,password) => {
        const errors = {};

        if ((userId ?? "").trim() ==="") {
            errors.userIdMsg = "※ユーザーIDは必須入力です";
        } else if (userId.length<4 || userId.length > 20) {
            errors.userIdMsg = "※ユーザーIDは4文字以上~20文字以内で入力してください";
        }

 
        if ((password ?? "").trim() ==="") {
            errors.passwordMsg = "※パスワードは必須入力です";       
        }else if (password.length<8 || password.length > 64) {
            errors.passwordMsg = "※パスワードは8文字以上~64文字以内で入力してください";
        }

        return errors;
    };


    //アカウント新規作成
    const handleCreateAccount = async (userId,password) =>{
        try {
            await postSignUp(userId,password);
            closeModal();
        } catch (error) {
            setSignupError({passwordMsg:error.response.data.errorMsg})
        }
    }


    //サインイン処理
    const handleAuthUser = async (userId,password) =>{
        try {
            await postSignIn(userId,password);
            setIsAuth(true);
            navigate("/tasks");
        } catch (error) {
            setSigninError({authMsg:error.response.data.errorMsg})
        }
    }


    return(
        <>
            <div className={style.container}>
                <h1>TrackDo</h1>
                <p className={style.subTitle}>タスクと一緒に作業時間も管理しましょう</p>

                <div className={style.formBox}>
                    <label>ユーザーID</label>
                    <input
                        type="text"
                        onChange={ (event)=>setUserId(event.target.value)}
                    ></input>
                    {signinError.userIdMsg &&(
                        <p className={style.errorMsg}>{signinError.userIdMsg}</p>
                    )}
                    <label>パスワード</label>
                    <input
                        type="password"
                        onChange={ (event)=>setPassword(event.target.value)}
                    ></input>
                    {signinError.passwordMsg &&(
                        <p className={style.errorMsg}>{signinError.passwordMsg}</p>
                    )}
                </div>
                <div className={style.btnWrap}>      
                    <button 
                        className={cx(style.signinBtn,baseStyle.baseBtn)}
                        onClick={ async ()=>{
                        
                            //バリデーション
                            const errors = handleValidateUser(userId,password);
                            if(Object.keys(errors).length > 0){
                                setSigninError(errors);
                                console.log(signinError)
                                return;
                            }

                            setSigninError({}); 

                            //送信かつ成功したらストレージ保存
                            await handleAuthUser(userId,password)

                    }}
                        >サインイン</button>
                </div>

                {signinError.authMsg && (
                <p className={style.errorMsg}>{signinError.authMsg}</p>
                )}
                <p className={style.accountText}>まだアカウントをお持ちでない方は、以下から作成いただけます</p>
                <button className={style.accountBtn} onClick={()=>openModal("ACCONTU")}>
                    新規登録
                </button>

            </div>
            {isOpen ? (
                <ModalForm>
                    <CreateUserAccount 
                        handleCreateAccount={handleCreateAccount}
                        handleValidateUser ={handleValidateUser}
                        signupError={signupError}
                        setSignupError={setSignupError}
                        ></CreateUserAccount>
                </ModalForm>
            ):null}
        </>
    )
}

export default Home;
