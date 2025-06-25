//Reactライブラリ
import { useNavigate} from "react-router-dom";

//グローバル定数
import { ROUTE_PATHS } from "../../constants/appConstants"

//スタイル
import cx from "classnames";
import style from "./NotFoundPage.module.css"
import baseStyle from "../../style/Util.module.css"


const NotFoundPage = () =>{

    const navigate = useNavigate();

    return(
        <>
        <div className={style.container}>
            <h2>ページは存在しません</h2>
            <p>404 Not Found</p>
            <button                 
                onClick={()=>navigate(ROUTE_PATHS.HOME)}
                className={cx(baseStyle.baseBtn,style.button)}
                >ホームへ戻る
            </button>
        </div>
        
        </>
    )

}

export default NotFoundPage;