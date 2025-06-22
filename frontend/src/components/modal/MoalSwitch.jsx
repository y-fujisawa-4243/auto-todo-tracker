//
import { useModalControl } from "../../context/ModalControlProvider"

//各モーダルコンポーネント
import ModalForm from "../layouts/modal-wrapper/ModalForm"
import CreataeTaskForm from "../organism/create-task-form/CreateTaskForm"
import EditTaskForm from "../organism/edit-task-form/EditTaskForm"
import TaskDetail from "../organism/task-detail/TaskDetail"
import CheckDeleteTask from "../organism/check-delete-task/CheckDeleteTask"
import CheckStartTask from "../organism/check-start-task/CheckStartTask"
import TaskOver from "../organism/task-over/TaskOver"
import CheckSignout from "../organism/check-signout/CheckSignout"


//
import { MODAL_TYPE } from "../../constants/appConstants"


const ModalSwitch = ({tasks,handleCreateTask,handleDeleteTask,handleUpdateTask}) => {

    const {isOpen,modalType} = useModalControl();

    return(
        <div>
            {isOpen ? (
                modalType === MODAL_TYPE.CREATE ? (
                <ModalForm>
                    <CreataeTaskForm handleCreateTask={handleCreateTask} />
                </ModalForm>
                ) :

                modalType === MODAL_TYPE.EDIT ? (
                <ModalForm>
                    <EditTaskForm handleUpdateTask={handleUpdateTask}/>
                </ModalForm>
                ) :

                modalType === MODAL_TYPE.DETAIL ? (
                <ModalForm>
                    <TaskDetail />
                </ModalForm>
                ) :

                modalType === MODAL_TYPE.DELETE ? (
                <ModalForm>
                    <CheckDeleteTask handleDeleteTask={handleDeleteTask} />
                </ModalForm>
                ) :

                modalType === MODAL_TYPE.WARN_RUN ? (
                <ModalForm>
                    <CheckStartTask tasks={tasks} handleUpdateTask={handleUpdateTask}/>
                </ModalForm>
                ) :

                modalType === MODAL_TYPE.TASK_OVER ? (
                <ModalForm>
                    <TaskOver />
                </ModalForm>
                ) :

                modalType === MODAL_TYPE.SIGN_OUT ? (
                <ModalForm>
                    <CheckSignout tasks={tasks}/>
                </ModalForm>
                ) :

                null
                )
            :null
            }
        </div>
    )

}

export default ModalSwitch;