//ライブラリ
import { useEffect, useState ,useContext} from 'react';
import { useModalControl } from '../../../context/ModalControlProvider';

//コンポーネント
import NavHeader from "../../header/NavHeader";
import ModalForm from "../modal-wrapper/ModalForm";
import CreataeTaskForm from '../../organism/create-task-form/CreateTaskForm';
import EditTaskForm from "../../organism/edit-task-form/EditTaskForm";
import TaskCard from "../../organism/task-card/TaskCard";
import TaskDetail from '../../organism/task-detail/TaskDetail';
import CheckDeleteTask from '../../organism/check-delete-task/CheckDeleteTask';
import CheckStartTask from '../../organism/check-start-task/CheckStartTask';

//スタイル
import cx from "classnames";
import style from "./BaseTaskList.module.css"
import baseStyle from "../../../style/Util.module.css"

//自作関数
import { postTask,deleteTask, getTasks,patchTask} from "../../../api/taskApi";
import { getCreatedAt } from '../../../time/HandleTimerFuncs';



const BaseTaskList = ({tasks,setTasks,isInCompletedTaskList,getOptions}) => {

    const {isOpen,modalType,openModal,closeModal} = useModalControl(); 


    //タスクのグルーピング処理
    const groupedTasks = {
        "RUNNING":[],
        "PAUSE":[],
        "TODO":[],
        "STOP":[]
    }

    tasks.forEach(task =>{
        switch(task.status){
            case "RUNNING":
                groupedTasks["RUNNING"].push(task)
                break;
            case "PAUSE":
                groupedTasks["PAUSE"].push(task)
                break;
            case "TODO":
                groupedTasks["TODO"].push(task)
                break;
            case "STOP":
                groupedTasks["STOP"].push(task)
                break;
        }
        }
    )


    //立ち上げ時データ取得
    useEffect(()=>{
        const fetchTasks = async () => {
            const data = await getTasks();
            setTasks(data);
        };

        fetchTasks();
    },[])


    //Create関数
    const handleCreateTask = async (title,description) =>{
        const startedAt = getCreatedAt();
        const status = "TODO"   //初期値は"TODO"(未実施)
        const time = 0
        const resData = await postTask(title,description,startedAt,status,time)
        setTasks((prevTasks) =>[...prevTasks,resData])
        closeModal();
    }


    //Delete関数
    const handleDeleteTask = async (taskId) =>{
        await deleteTask(taskId)

        setTasks( (prevTasks)=>prevTasks.filter( (task) =>{
            return task.id !== taskId
        } ))
        closeModal();
    }


    //Update関数 (引数は)
    const handleUpdateTask = async (taskId, argsObj={}) => {
        const sendData = {};
        console.log(argsObj.time)

        //バリデーション処理
        if (argsObj.title && argsObj.title.trim()) sendData.title = argsObj.title;
        if (argsObj.description && argsObj.description.trim()) sendData.description = argsObj.description;
        if (argsObj.time) sendData.time = argsObj.time;
        if (argsObj.status && argsObj.status.trim()) sendData.status = argsObj.status;
        
        if (Object.keys(sendData).length === 0) {       //入力がされていないとき
            alert("更新内容が入力されていません");      
            return;
        }
        
        //送信処理
        try {
            const resData = await patchTask(taskId, sendData);
            setTasks((prevTasks) => prevTasks.map( (task)=>{
                if(task.id !== taskId) return task;
                return {...task,...resData};
            } ) )
            closeModal();

        } catch (err) {
            console.error(err);
        }
        };

    return(
        <>
        <NavHeader />
        <div>
            <main className={style.container}>
            {isInCompletedTaskList ? (
                <>
                <section className={style.btnBox}>
                    <button 
                        onClick={() => openModal("CREATE")}
                        className={cx(baseStyle.baseBtn,style.uniqueBtn)}
                    >
                        新規タスク作成
                    </button>
                </section>
                <section className={style.taskField}>
                    <h3>進捗中</h3> 
                    {groupedTasks["RUNNING"].length===0 ? (
                        <p className={style.notTaskMessage}>該当タスクは存在しません</p>
                    ) :
                    groupedTasks["RUNNING"].map( (task)=>{
                        return(
                            <div className={style.cardContainer}>
                            <TaskCard key={task.id} task={task} tasks={tasks} getOptions={getOptions} 
                            handleUpdateTask={handleUpdateTask} 
                            isInCompletedTaskList={isInCompletedTaskList}>
                            </TaskCard>
                        </div>
                        )
                    } )
                    }                   
                </section>
                <section className={style.taskField}>
                    <h3>中断</h3>
                    {groupedTasks["PAUSE"].length===0 ? (
                        <p className={style.notTaskMessage}>該当タスクは存在しません</p>
                    ) :
                    groupedTasks["PAUSE"].map( (task)=>{
                        return(
                            <div className={style.cardContainer}>
                                <TaskCard key={task.id} task={task} tasks={tasks}  getOptions={getOptions}
                            handleUpdateTask={handleUpdateTask} 
                            isInCompletedTaskList={isInCompletedTaskList}></TaskCard>
                            </div>
                        )
                    } )
                    }
                </section>
                <section className={style.taskField}>
                    <h3>未実施</h3>
                    {groupedTasks["TODO"].length===0 ? (
                        <p className={style.notTaskMessage}>該当タスクは存在しません</p>
                    ) :
                    groupedTasks["TODO"].map( (task)=>{
                        return(
                            <div className={style.cardContainer}>
                            <TaskCard key={task.id} task={task} tasks={tasks}  getOptions={getOptions}
                            handleUpdateTask={handleUpdateTask} 
                            isInCompletedTaskList={isInCompletedTaskList}>
                            </TaskCard>
                        </div>
                        )
                    } )
                    }
                </section>
                </>
                ):(
                <section className={style.taskField}>
                    <h3>完了</h3> 
                    {groupedTasks["STOP"].length===0 ? (
                        <p className={style.notTaskMessage}>該当タスクは存在しません</p>
                    ) :
                    groupedTasks["STOP"].map( (task)=>{
                        return(
                            <div className={style.cardContainer}>
                            <TaskCard task={task} tasks={tasks} getOptions={getOptions}
                            handleUpdateTask={handleUpdateTask} 
                            isInCompletedTaskList={isInCompletedTaskList}></TaskCard>
                        </div>
                        )
                    } )
                    }                   
                </section>
                )
            }     

                {isOpen ? (
                    modalType === "CREATE" ? (
                    <ModalForm>
                        <CreataeTaskForm handleCreateTask={handleCreateTask} />
                    </ModalForm>
                    ) :

                    modalType === "EDIT" ? (
                    <ModalForm>
                        <EditTaskForm handleUpdateTask={handleUpdateTask}/>
                    </ModalForm>
                    ) :

                    modalType === "DETAIL" ? (
                    <ModalForm>
                        <TaskDetail />
                    </ModalForm>
                    ) :

                    modalType === "DELETE" ? (
                    <ModalForm>
                        <CheckDeleteTask handleDeleteTask={handleDeleteTask} />
                    </ModalForm>
                    ) :

                    modalType === "START" ? (
                    <ModalForm>
                        <CheckStartTask tasks={tasks} handleUpdateTask={handleUpdateTask}/>
                    </ModalForm>
                        ) :

                    null
                    )
                :null
                }
            </main>
        </div>
        </>
    )
}

export default BaseTaskList;