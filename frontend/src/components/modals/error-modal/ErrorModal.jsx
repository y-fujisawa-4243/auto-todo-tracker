//Context
import { useModalControl } from "../../../context/ModalControlProvider";

//スタイル
import cx from "classnames";
import style from "./ErrorModal.module.css"
import baseStyle from "../../../style/Util.module.css"

const ErrorModal= ({message}) =>{

    const {closeModal} = useModalControl();   

    return(
        <>
            <div className={style.formBox}>
                <h3>エラーメッセージ</h3>
                <p>{message}</p>
            </div>
            <div className={style.btnWrap}>
                <button
                    onClick={() => closeModal()}
                    className={cx(style.cancelBtn,baseStyle.baseBtn)}
                    >閉じる
                </button>
            </div>
        </>
    )

}

export default ErrorModal;