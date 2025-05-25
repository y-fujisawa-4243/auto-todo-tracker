
import { useModalControl } from "../../../context/ModalControlProvider";
import BaseTaskList from "../../layouts/base-task-list/BaseTaskList"
import { useEffect } from "react";




const CompletedTaskList = ({tasks,setTasks}) => {

    const {openModal} = useModalControl();

    //KebabMenu表示用関数
    const getOptions = (task,tasks) =>{
        return[
            {name:"詳細",func: () =>  openModal("DETAIL",task)},
            {name:"削除",func: () => openModal("DELETE",task)},
        ]
    }

    return(
        <>
            <BaseTaskList 
            tasks={tasks} 
            setTasks={setTasks} 
            isInCompletedTaskList={false} 
            getOptions = {getOptions}
            />
        </>
    )
}

export default CompletedTaskList;
