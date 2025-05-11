// src/context/ModalControlProvider.jsx
import { createContext, useContext, useState } from "react";

const ModalControlContext = createContext();

export const ModalControlProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [currentTask, setCurrentTask] = useState(null);



    //モーダルウィンドウを開く関数
    const openModal = (type,task = null) => {   //taskのデフォルト値をnullで設定。

        console.log(type)
        
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
