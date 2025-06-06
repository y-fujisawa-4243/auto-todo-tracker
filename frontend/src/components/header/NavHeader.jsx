import { useNavigate } from "react-router-dom";
import ROUTE_PATHS from "../../router/routePath";
import { postSignout } from "../../api/taskApi";

//css関連
import style from"./NavHeader.module.css"
import { useModalControl } from "../../context/ModalControlProvider";
import { useAuth } from "../../context/AuthenticationProvider";
//import baseStyle from "../../style/Util.module.css"

const NavHeader = () =>{

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
                    <li className={style.signout} onClick={()=>openModal("SIGN_OUT")}>
                        <p>サインアウト</p>
                    </li>
                </ul>
            </aside>
        </div>
        </>
    )

}

export default NavHeader;