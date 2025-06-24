//Reactライブラリ
import { createContext, useContext, useState } from "react";

//Context生成
const ModalControlContext = createContext();

export const ModalControlProvider = ({ children }) => {

    const [isOpen, setIsOpen] = useState(false);            //開閉管理のステート変数
    const [modalType, setModalType] = useState(null);       //モーダル種類を管理するステート変数
    const [currentTask, setCurrentTask] = useState(null);   //現在のタスク情報を管理するステート変数

    //モーダルウィンドウを開く関数
    const openModal = (type,task = null) => {   //task情報を使わないモーダルがあるため、デフォルト値をnullで設定。
        
        setModalType(type);
        setCurrentTask(task);
        setIsOpen(true);

    }


  //モーダルウィンドウを閉じる関数
    const closeModal = () => {
        
        setModalType(null);
        setCurrentTask(null);
        setIsOpen(false);

    };

    return (
    <>
        <ModalControlContext.Provider value={
        { isOpen, modalType, currentTask, openModal, closeModal }
    }>
        {children}
    </ModalControlContext.Provider>
    </>
    )

    };

export const useModalControl = () => useContext(ModalControlContext);
