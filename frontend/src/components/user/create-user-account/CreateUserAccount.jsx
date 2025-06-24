//Reactライブラリ
import { useState, useEffect } from "react";

//Context
import { useModalControl } from "../../../context/ModalControlProvider";

//スタイル
import cx from "classnames";
import style from "./CreateUserAccount.module.css"
import baseStyle from "../../../style/Util.module.css"


const CreateUserAccount = ({handleCreateAccount,handleValidateUser,signupError,setSignupError}) =>{

    const {closeModal} = useModalControl();   

    const [userId,setUserId] = useState("");
    const [password,setPassword] = useState("");
    const [isSubmit,setIsSubmit] = useState(false);

    //マウント時、サインインエラーメッセージ作雄
    useEffect( ()=>{
        setSignupError("");
    },[setSignupError] )


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
                onClick={()=>{

                    //多重送信防止
                    if(isSubmit) return;
                    setIsSubmit(true)

                    //バリデーション
                    const errors = handleValidateUser(userId,password);
                    if(Object.keys(errors).length > 0){
                        setSignupError(errors);
                        setIsSubmit(false);
                        return;
                    }
                    setSignupError({}); 

                    //送信
                    handleCreateAccount(userId,password)
                    setIsSubmit(false);
                }}

                
                className={cx(baseStyle.baseBtn,style.createBtn)}
                >登録
            </button>
        </div>
    </div>
    )
}

export default CreateUserAccount