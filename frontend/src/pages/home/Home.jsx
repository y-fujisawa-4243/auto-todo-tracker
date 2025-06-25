//Reactライブラリ
import { useEffect, useState , useRef } from "react";
import { useNavigate} from "react-router-dom";

//Context
import { useModalControl } from "../../context/ModalControlProvider";   
import { useAuth} from "../../context/AuthenticationProvider"           

//コンポーネント
import UserModalSwitch from "../../components/modals/UserModalSwitch";

//グローバル定数
import {  MODAL_TYPE, ROUTE_PATHS } from "../../constants/appConstants";

//API関数
import { postSignIn ,postSignUp} from "../../api/taskApi";

//util関数
import { apiError, validateUser } from "../../util/taskUtil";

//スタイル関連
import cx from "classnames";
import style from "./Home.module.css";
import baseStyle from "../../style/Util.module.css";


const Home = () =>{

    const {openModal ,closeModal} = useModalControl();
    const {isAuth,setIsAuth} = useAuth();
    const [message,setMessage] = useState("");      //エラーメッセージ

    //入力ステート
    const [userId,setUserId] = useState("");        
    const [password,setPassword] = useState("");

    const isSubmit = useRef(null); //ボタン連打に対応するため、ボタン状態を管理

    //サインイン時のエラーメッセージステート
    const [signinError,setSigninError] = useState({
        userIdMsg:"",
        passwordMsg:"",
    });

    //マウント時、認証状態ならばタスク一覧へ遷移
    const navigate = useNavigate();

    useEffect( ()=>{

        if(isAuth){
            navigate(ROUTE_PATHS.LIST);
        }
        return;

    },[isAuth,navigate]) //認証フラグによってページ遷移判定するため、依存配列に追加。


    //アカウント新規作成
    const handleCreateAccount = async (userId,password) =>{

        try {
            await postSignUp(userId,password);
            closeModal();
            return true;

        } catch (error) {
            closeModal();
            apiError(error,setMessage)
            openModal(MODAL_TYPE.ERROR);
            return false;

        }
    }


    //サインイン要求
    const handleAuthUser = async (userId,password) =>{

        try {
            await postSignIn(userId,password);
            setIsAuth(true);
            navigate(ROUTE_PATHS.LIST);
            return true;

        } catch (error) {
            apiError(error,setMessage)
            openModal(MODAL_TYPE.ERROR);
            return false;
        }
    }

    //サインイン処理
    const  signinFunction = async () =>{

        //多重送信防止
        if(isSubmit.current) return;
        isSubmit.current=true;

        //バリデーション
        const errors = validateUser(userId,password);
        if(Object.keys(errors).length > 0){
            setSigninError(errors);
            isSubmit.current=false;
            return;
        }
        setSigninError({}); 

        //送信
        await handleAuthUser(userId,password)
        isSubmit.current=false;

        return;
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
                        onClick={signinFunction}
                        >サインイン</button>
                </div>
                <p className={style.accountText}>まだアカウントをお持ちでない方は、以下から作成いただけます</p>
                <button className={style.accountBtn} onClick={()=>openModal(MODAL_TYPE.ACCOUNT)}>
                    新規登録
                </button>
            </div>
            <UserModalSwitch 
                handleCreateAccount={handleCreateAccount}
                message={message}
                >
            </UserModalSwitch>
        </>
    )
}

export default Home;
