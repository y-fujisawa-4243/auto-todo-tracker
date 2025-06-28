//Context
import { useModalControl } from "../../context/ModalControlProvider"

//各モーダルコンポーネント
import ModalForm from "./modal-wrapper/ModalForm"
import CreataeTaskForm from "../task/create-task-form/CreateTaskForm"
import EditTaskForm from "../task/edit-task-form/EditTaskForm"
import TaskDetail from "../task/task-detail/TaskDetail"
import CheckDeleteTask from "../task/check-delete-task/CheckDeleteTask"
import CheckStartTask from "../task/check-start-task/CheckStartTask"
import TaskOver from "../task/task-over/TaskOver"
import ErrorModal from "./error-modal/ErrorModal"

//グローバル定数
import { MODAL_TYPE } from "../../constants/appConstants"
import CheckSignout from "../user/check-signout/CheckSignout"



const TaskModalSwitch = (
    {
        tasks,
        handleCreateTask,
        handleDeleteTask,
        handleUpdateTask,
        handleSignout,
        message
    }) => {

    const {isOpen,modalType} = useModalControl();


    return(
        <div>
            {isOpen ? (
                modalType === MODAL_TYPE.CREATE ? (
                <ModalForm>
                    <CreataeTaskForm tasks={tasks} handleCreateTask={handleCreateTask} />
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
                    <CheckSignout tasks={tasks} handleSignout={handleSignout}/>
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

export default TaskModalSwitch;