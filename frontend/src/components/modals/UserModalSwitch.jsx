//Context
import { useModalControl } from "../../context/ModalControlProvider"

//各モーダルコンポーネント
import ModalForm from "./modal-wrapper/ModalForm"
import CreateUserAccount from "../user/create-user-account/CreateUserAccount"
import ErrorModal from "./error-modal/ErrorModal"

//グローバル定数
import { MODAL_TYPE } from "../../constants/appConstants"




const UserModalSwitch = (
    {
        handleCreateAccount,
        signupError,
        setSignupError,
        message
    }) => {

    const {isOpen,modalType} = useModalControl();


    return(
        <div>
            {isOpen ? (
                modalType === MODAL_TYPE.ACCOUNT ? (
                <ModalForm>
                    <CreateUserAccount 
                        handleCreateAccount={handleCreateAccount}
                        signupError={signupError}
                        setSignupError={setSignupError}
                        >
                    </CreateUserAccount>
                </ModalForm>
                ) :

                modalType === MODAL_TYPE.ERROR ? (
                <ModalForm>
                    <ErrorModal message={message}/>
                </ModalForm>
                ) :

                null
                )
            :null
            }
        </div>
    )

}

export default UserModalSwitch;