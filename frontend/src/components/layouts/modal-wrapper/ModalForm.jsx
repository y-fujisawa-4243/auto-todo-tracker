import Modal from 'react-modal';
import { useContext } from 'react';
import { useModalControl } from '../../../context/ModalControlProvider';

//css
import style from "./ModalForm.module.css"


function ModalForm({children} ) {

  const {isOpen,closeModal} = useModalControl();

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => closeModal()}
        className={style.modalStyle}
        overlayClassName={style.overlayStyle}
      >
        {children}
      </Modal>
    </>
  );
}

export default ModalForm;



