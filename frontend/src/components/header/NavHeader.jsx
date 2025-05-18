import { Link } from "react-router-dom";
import ROUTE_PATHS from "../../router/routePath";

//css関連
import style from"./NavHeader.module.css"
//import baseStyle from "../../style/Util.module.css"

const NavHeader = () =>{

    return(
        <>
        <div className={style.container}>
            <headre className={style.wrapper}>
                <h2>TrackDo</h2>
                <ul className={style.ui}>
                    <li>
                        <nav><Link to={ROUTE_PATHS.HOME} className={style.link}>ホーム</Link></nav>
                    </li>
                    <li>
                        <nav><Link to={ROUTE_PATHS.LIST} className={style.link}>タスク一覧</Link></nav>
                    </li>
                    <li>
                        <nav><Link to={ROUTE_PATHS.COMPLETE} className={style.link}>完了済みタスク</Link></nav>
                    </li>
                </ul>
            </headre>
        </div>
        </>
    )

}

export default NavHeader;