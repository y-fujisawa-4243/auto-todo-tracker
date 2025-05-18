import {useState,useContext, createContext} from "react"

const UserApiContext = createContext();

export const UserApiErrorProvider = ({children}) =>{

    const [error,setError] =useState(null);

    const clearError = () => setError(null);

    return(
        <>
            <UserApiContext.Provider>
            {children}
            </UserApiContext.Provider>
        </>
    )

}

export const useApiError = () =>  useContext(UserApiContext);