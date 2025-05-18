
import { useNavigate } from "react-router-dom";

import cx from "classnames";
import style from "./Home.module.css";
import baseStyle from "../../../style/Util.module.css";

import ROUTE_PATHS from "../../../router/routePath";

const Home = () =>{
    
    const navigate = useNavigate();

    return(
        <div className={style.container}>
            <h1>TrackDo</h1>
            <p>タスクと一緒に作業時間も管理しましょう</p>
            <button 
                onClick={()=>navigate(ROUTE_PATHS.LIST)}
                className={cx(baseStyle.baseBtn,style.button)}
            >タスク一覧へ</button>
        </div>
    )
}

export default Home;
