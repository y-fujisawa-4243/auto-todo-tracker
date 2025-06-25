//Reactライブラリ
import { useState, useEffect ,useRef} from "react";

//Context
import { useModalControl } from "../../../context/ModalControlProvider";

//util関数
import { validateUser } from "../../../util/taskUtil";

//スタイル
import cx from "classnames";
import style from "./CreateUserAccount.module.css"
import baseStyle from "../../../style/Util.module.css"


const CreateUserAccount = ({handleCreateAccount}) =>{

    const {closeModal} = useModalControl();   

    const [userId,setUserId] = useState("");
    const [password,setPassword] = useState("");
    const isSubmit = useRef(null) //ボタン連打に対応するため、ボタン状態を管理

    //サインアップ時のエラーメッセージステート
    const [signupError,setSignupError] = useState({
        userIdMsg:"",
        passwordMsg:""
    });


    //マウント時、サインインエラーメッセージ作雄
    useEffect( ()=>{
        setSignupError("");
    },[setSignupError] )


    //サインアップ処理
    const signupFunction = async () =>{

        //多重送信防止
        if(isSubmit.current) return;
        isSubmit.current=true

        //バリデーション
        const errors = validateUser(userId,password);
        if(Object.keys(errors).length > 0){
            setSignupError(errors);
            isSubmit.current = false;
            return;
        }
        setSignupError({}); 

        //送信
        await handleCreateAccount(userId,password)
        isSubmit.current = false;

        return;
    }

    return(
        <div className={style.container}>
        <h3>アカウント作成フォーム</h3>
        <div>
            <div className={style.formBox}>
                <label>ユーザーID</label>
                <input
                    type="text"
                    placeholder="4~20文字 半角英数字のみ使用可"
                    onChange={(event) => setUserId(event.target.value)}
                ></input>
                {signupError.userIdMsg && (
                    <p className={style.errorMsg}>{signupError.userIdMsg}</p>
                )}
            </div>
            <div className={style.formBox}>
                <label>パスワード</label>
                <input
                    type="password"
                    placeholder="8~64文字 半角英数字のみ使用可"
                    onChange={(event) => setPassword(event.target.value)}
                ></input>
                {signupError.passwordMsg && (
                    <p className={style.errorMsg}>{signupError.passwordMsg}</p>
                )}
            </div>
        </div>
        <div className={style.btnWrap}>
            <button 
                onClick={() =>{
                    closeModal()
                }}
                className={cx(baseStyle.baseBtn,style.cancelBtn)}
                >キャンセル
            </button>
            <button 
                type="submit" 
                onClick={signupFunction}
                className={cx(baseStyle.baseBtn,style.createBtn)}
                >登録
            </button>
        </div>
    </div>
    )
}

export default CreateUserAccount