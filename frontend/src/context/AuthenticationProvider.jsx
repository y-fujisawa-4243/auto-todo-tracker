//reactライブラリ
import {useState, createContext, useContext, useEffect} from "react";

//API関数
import { checkAuth } from "../api/taskApi";

//Context生成
const AuthContext = createContext();

export const AuthenticationProvider = ({children}) => {

    const [isAuth,setIsAuth] = useState(null)   //認証情報

    //アプリケーション起動時、認証済みかどうかのチェック。
    useEffect( ()=>{

        const funcCheckAuth= async() =>{
            try {
                await checkAuth();
                setIsAuth(true);
            } catch (error) {
                setIsAuth(false);
            }
        }

        funcCheckAuth();

    },[])   //アプリ起動時に認証済みか否かを取得したいので、マウント時のみ

    return(
    <AuthContext value={{isAuth,setIsAuth}}>
        {children}
    </AuthContext>

    )

}

export const useAuth = () => useContext(AuthContext);