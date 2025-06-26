//Reactライブラリ
import { useState , useRef } from "react";
import { useNavigate } from "react-router-dom";

//Context
import { useModalControl } from "../../context/ModalControlProvider"
import { useAuth } from "../../context/AuthenticationProvider";

//コンポーネント
import BaseTaskList from "../../components/layouts/base-task-list/BaseTaskList"
import TaskModalSwitch from "../../components/modals/TaskModalSwitch";

//API関数
import { getTasks,deleteTask,patchTask,postSignout,checkTask} from "../..//api/taskApi";

//util関数
import { buildUpdateData ,apiError} from "../../util/taskUtil";

//グローバル定数
import { MODAL_TYPE ,ROUTE_PATHS} from "../../constants/appConstants";



const CompletedTaskList = ({tasks,setTasks}) => {

    const [message,setMessage] = useState("");      //エラーメッセージ
    const isSubmit = useRef(null);                  //多重送信防止用

    const {openModal,closeModal} = useModalControl();
    const {setIsAuth} = useAuth();
    

    //KebabMenu表示用関数
    const getOptions = (task) =>{
        return[
            {name:"詳細",func: () =>  openModal(MODAL_TYPE.DETAIL,task)},
            {name:"削除",func: () => openModal(MODAL_TYPE.DELETE,task)},
        ]
    }

    //---Fetch関数-----
    const fetchTasks = async () => {
        try {
            const response = await getTasks();
            setTasks(response.data);
            return true;

        } catch (error) {
            apiError(error,setMessage)
            openModal(MODAL_TYPE.ERROR);
            return false;
        }
    };

    //---タスク所有権の確認-----
    const checkTaskOwner = async(taskId) => {
        try {
            const response = await checkTask(taskId);
            return response.data
        } catch (error) {
            return false;
        }       
    }


    //---Delete関数-----
    const handleDeleteTask = async (taskId) =>{

        //多重送信防止処理
        if(isSubmit.current) return;
        isSubmit.current = true;

        //削除処理
        try {
            await deleteTask(taskId)
            setTasks( (prevTasks)=>prevTasks.filter( (task) =>{
                return task.taskId !== taskId
            } ))
            isSubmit.current = false;
            return true;

        } catch (error) {
            closeModal();
            apiError(error,setMessage)
            openModal(MODAL_TYPE.ERROR);
            isSubmit.current = false;
            return false;
        }            
    }


    //---Update関数-----
    const handleUpdateTask = async (taskId, argsObj={}) => {

        //多重送信防止処理
        if(isSubmit.current === true) return;
        isSubmit.current = true;

        //更新用データ構築
        const sendData = buildUpdateData(argsObj);
        if (Object.keys(sendData).length === 0) {       //更新データがない場合    
            return false;
        }
        
        //送信処理
        try {
            const response = await patchTask(taskId, sendData);
            setTasks((prevTasks) => prevTasks.map( (task)=>{
                if(task.taskId !== taskId) return task;
                return {...task,...response.data};
            } ) )
            closeModal();
            isSubmit.current = false;
            return true;
            
        } catch (error) {
            closeModal();
            apiError(error,setMessage)
            openModal(MODAL_TYPE.ERROR);
            isSubmit.current = false;
            return false;
        }
    };

    //---Signiout数-----
    const navigate = useNavigate();
    const handleSignout = async()=>{
        try {
            await postSignout();
            setIsAuth(false);
            closeModal();
            navigate(ROUTE_PATHS.HOME);

        } catch (error) {
            apiError(error,setMessage)
            openModal(MODAL_TYPE.ERROR);
        }
    }


    return(
        <>
            <BaseTaskList
                tasks={tasks} 
                isInCompletedTaskList={false} 
                getOptions = {getOptions}
                handleUpdateTask={handleUpdateTask}
                fetchTasks={fetchTasks}
                checkTaskOwner={checkTaskOwner}
                >
            </BaseTaskList> 
            <TaskModalSwitch
                tasks={tasks}
                handleDeleteTask={handleDeleteTask}
                handleSignout={handleSignout}
                message={message}            
            >
            </TaskModalSwitch>
        </>
    )
}

export default CompletedTaskList;
