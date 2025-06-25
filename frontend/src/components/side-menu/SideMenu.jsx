//Reactライブラリ
import { useNavigate } from "react-router-dom";

//Context
import { useModalControl } from "../../context/ModalControlProvider";

//グローバル定数
import { MODAL_TYPE, ROUTE_PATHS } from "../../constants/appConstants";

//スタイル
import style from"./SideMenu.module.css"

const SideMenu = () =>{

    const{openModal} = useModalControl();
    const navigate = useNavigate();


    return(
        <>
        <div className={style.container}>
            <aside className={style.wrapper}>
                <h2>TrackDo</h2>
                <ul className={style.menu}>
                    <li onClick={()=>{
                        navigate(ROUTE_PATHS.LIST)
                    }}>
                        <p>タスク一覧</p>
                    </li>
                    <li onClick={()=>{
                        navigate(ROUTE_PATHS.COMPLETE)
                    }}>
                        <p>完了タスク一覧</p>
                    </li>
                    <li className={style.signout} onClick={()=>openModal(MODAL_TYPE.SIGN_OUT)}>
                        <p>サインアウト</p>
                    </li>
                </ul>
            </aside>
        </div>
        </>
    )

}

export default SideMenu;