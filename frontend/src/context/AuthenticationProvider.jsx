import {useState, createContext, useContext, useEffect} from "react";
import { checkAuth } from "../api/taskApi";


const AuthContext = createContext();

export const AuthenticationProvider = ({children}) => {

    const [isAuth,setIsAuth] = useState(null)

    //アプリケーション起動時、認証済みかどうかのチェック
    useEffect( ()=>{

        const funcCheckAuth= async() =>{
            try {
                await checkAuth();
                setIsAuth(true);
                console.log("認証済み")
            } catch (error) {
                setIsAuth(false);
                console.log("未認証")
            }
        }

        funcCheckAuth();

    },[])

    return(
    <AuthContext value={
        {isAuth,setIsAuth}
    }>
        {children}
    </AuthContext>

    )

}

export const useAuth = () => useContext(AuthContext);