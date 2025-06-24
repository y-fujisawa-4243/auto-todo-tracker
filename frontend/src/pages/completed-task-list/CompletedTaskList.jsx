//Context
import { useModalControl } from "../../context/ModalControlProvider"

//コンポーネント
import BaseTaskList from "../../components/layouts/base-task-list/BaseTaskList"
import ModalSwitch from "../../components/layouts/ModalSwitch";

//API関数
import { deleteTask,patchTask} from "../..//api/taskApi";

//util関数
import { buildUpdateData } from "../../util/taskUtil";

//グローバル定数
import { MODAL_TYPE } from "../../constants/appConstants";


const CompletedTaskList = ({tasks,setTasks}) => {

    const {openModal,closeModal} = useModalControl();

    //KebabMenu表示用関数
    const getOptions = (task) =>{
        return[
            {name:"詳細",func: () =>  openModal(MODAL_TYPE.DETAIL,task)},
            {name:"削除",func: () => openModal(MODAL_TYPE.DELETE,task)},
        ]
    }


    //---Delete関数-----
    const handleDeleteTask = async (taskId) =>{

        //削除処理
        await deleteTask(taskId)
        setTasks( (prevTasks)=>prevTasks.filter( (task) =>{
            return task.taskId !== taskId
        } ))
        closeModal();
    }

    //---Update関数-----
    const handleUpdateTask = async (taskId, argsObj={}) => {

        //更新用データ構築
        const sendData = buildUpdateData(argsObj);
        if (Object.keys(sendData).length === 0) {       //更新データがない場合    
            return;
        }
        
        //送信処理
        try {
            const response = await patchTask(taskId, sendData);
            setTasks((prevTasks) => prevTasks.map( (task)=>{
                if(task.taskId !== taskId) return task;
                return {...task,...response.data};
            } ) )
            closeModal();

        } catch (error) {
            console.error(error);
        }
    };

    return(
        <>
            <BaseTaskList
                tasks={tasks} 
                setTasks={setTasks} 
                isInCompletedTaskList={false} 
                getOptions = {getOptions}
                handleUpdateTask={handleUpdateTask}
                >
            </BaseTaskList> 
            <ModalSwitch
                tasks={tasks}
                handleDeleteTask={handleDeleteTask}
                >
            </ModalSwitch>
        </>
    )
}

export default CompletedTaskList;
