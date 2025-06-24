//Reactライブラリ
import { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";

//Context
import { useModalControl } from "../../context/ModalControlProvider";   
import { useAuth} from "../../context/AuthenticationProvider"           

//コンポーネント
import CreateUserAccount from "../../components/user/create-user-account/CreateUserAccount"
import ModalForm from "../../components/layouts/modal-wrapper/ModalForm"

//グローバル定数
import { MODAL_TYPE, ROUTE_PATHS } from "../../constants/appConstants";

//API関数
import { postSignIn ,postSignUp} from "../../api/taskApi";

//スタイル関連
import cx from "classnames";
import style from "./Home.module.css";
import baseStyle from "../../style/Util.module.css";

const Home = () =>{

    const {isOpen, openModal ,closeModal} = useModalControl();
    const {isAuth,setIsAuth} = useAuth();

    const [userId,setUserId] = useState("");        
    const [password,setPassword] = useState("");

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

        if(isAuth){
            navigate(ROUTE_PATHS.LIST);
        }
        return;

    },[isAuth,navigate]) //認証フラグによってページ遷移判定するため、依存配列に追加。


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
            navigate(ROUTE_PATHS.LIST);
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
                <button className={style.accountBtn} onClick={()=>openModal(MODAL_TYPE.ACCOUNT)}>
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
                        >
                    </CreateUserAccount>
                </ModalForm>
            ):null}
        </>
    )
}

export default Home;
