//ライブラリ
import { useEffect, useState ,useContext} from 'react';
import { useModalControl } from '../../../context/ModalControlProvider';

import  BaseTaskList  from '../../layouts/base-task-list/BaseTaskList';
import { MODAL_TYPE } from '../../../constants/appConstants';

import ModalSwitch from '../../modal/MoalSwitch';
import { postTask,deleteTask,patchTask } from '../../../api/taskApi';
import { getCreatedAt } from '../../../time/HandleTimerFuncs';
import { buildUpdateData } from '../../../util/taskUtil';

const InCompletedTaskList = ({tasks,setTasks}) => {

    const {openModal,closeModal} = useModalControl();  

    //KebabMenu表示用関数
    const getOptions = (task) =>{
        return[
            {name:"詳細",func: () => openModal(MODAL_TYPE.DETAIL,task)},
            {name:"編集",func: () => openModal(MODAL_TYPE.EDIT,task)},
            {name:"削除",func: () => openModal(MODAL_TYPE.DELETE,task)},
        ]
    }

   //---Create関数-----
    const handleCreateTask = async (taskTitle,taskDescription) =>{

        const MAX_TASK = 50;        //最大タスク数

        //バリデーション
        if(Object.keys(tasks).length >= MAX_TASK){
            closeModal();
            openModal(MODAL_TYPE.TASK_OVER);
            return;
        } 

        //日付取得
        const startedAt = getCreatedAt();

        //作成処理
        try {
            const response = await postTask(taskTitle,taskDescription,startedAt)
            setTasks((prevTasks) =>[...prevTasks,response.data])
            closeModal();
        } catch (error) {
            console.log(error);
        }

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
                isInCompletedTaskList={true} 
                getOptions = {getOptions}
                handleUpdateTask={handleUpdateTask}
                >
            </BaseTaskList> 
            <ModalSwitch
                tasks={tasks}
                handleCreateTask={handleCreateTask}
                handleDeleteTask={handleDeleteTask}
                handleUpdateTask={handleUpdateTask}
                >
            </ModalSwitch>
        </>
    )
}

export default InCompletedTaskList;