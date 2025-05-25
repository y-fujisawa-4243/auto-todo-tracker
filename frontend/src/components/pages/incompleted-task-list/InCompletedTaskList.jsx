//ライブラリ
import { useEffect, useState ,useContext} from 'react';
import { useModalControl } from '../../../context/ModalControlProvider';

import  BaseTaskList  from '../../layouts/base-task-list/BaseTaskList';


const InCompletedTaskList = ({tasks,setTasks}) => {

    const {openModal} = useModalControl();  

    //KebabMenu表示用関数
    const getOptions = (task,tasks) =>{
        return[
            {name:"詳細",func: () => openModal("DETAIL",task)},
            {name:"編集",func: () => openModal("EDIT",task)},
            {name:"削除",func: () => openModal("DELETE",task)},
        ]
    }

    return(
        <>
            <BaseTaskList 
            tasks={tasks} 
            setTasks={setTasks} 
            isInCompletedTaskList={true} 
            getOptions = {getOptions}
            />
        </>
    )
}

export default InCompletedTaskList;