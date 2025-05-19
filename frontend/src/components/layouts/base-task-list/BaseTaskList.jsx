//ライブラリ
import { useEffect, useState ,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useTaskTimer } from '../../../context/TaskTimerProvider';
import TaskOver from '../../organism/task-over/TaskOver';



const BaseTaskList = ({tasks,setTasks,isInCompletedTaskList,getOptions}) => {

    const {isOpen,modalType,openModal,closeModal} = useModalControl(); 
    const {stopTimer,elapsed} = useTaskTimer();


    //タスクのグルーピング処理
    const groupedTasks = {
        "RUNNING":[],
        "PAUSE":[],
        "TODO":[],
        "STOP":[]
    }

    tasks.forEach(task =>{
        switch(task.taskStatus){
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
    useEffect( ()=>{

        const fetchTasks = async () => {
            try {
                const response = await getTasks();
                setTasks(response.data);
            } catch (error) {
                console.log(error)
            }

        };

        fetchTasks();
        
    },[])

    useEffect( ()=>{
        const handleBeforeUnload =async (e) => {
        
            console.log("ブラウザを閉じようとしている！");

            if(groupedTasks["RUNNING"].length === 0) return;
            const runTask = groupedTasks["RUNNING"][0]

            stopTimer(runTask)
            runTask.elapsedTime = elapsed
            
            if (runTask) {
                localStorage.setItem("runningTaskBackup", JSON.stringify(runTask));
            }

        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    },[groupedTasks])


    //Create関数
    const handleCreateTask = async (taskTitle,taskDescription) =>{

        if(Object.keys(tasks).length >= 50){
            closeModal();
            openModal("TASK_OVER");
            return;
        } 

        const startedAt = getCreatedAt();
        console.log(startedAt)

        try {
            const response = await postTask(taskTitle,taskDescription,startedAt)
            setTasks((prevTasks) =>[...prevTasks,response.data])
            closeModal();
        } catch (error) {
            console.log(error);
        }

    }


    //Delete関数
    const handleDeleteTask = async (taskId) =>{
        await deleteTask(taskId)

        setTasks( (prevTasks)=>prevTasks.filter( (task) =>{
            return task.taskId !== taskId
        } ))
        closeModal();
    }


    //Update関数 (引数は)
    const handleUpdateTask = async (taskId, argsObj={}) => {
        const sendData = {};
        const MAX_ELAPSED_SEC = 359999;

        //引数解析
        if (argsObj.taskTitle ) sendData.taskTitle = argsObj.taskTitle;
        if (argsObj.taskDescription ) sendData.taskDescription = argsObj.taskDescription;
        if (argsObj.elapsedTime){
            if(argsObj.elapsedTime  > MAX_ELAPSED_SEC) {
                sendData.elapsedTime = MAX_ELAPSED_SEC
            }else{
                sendData.elapsedTime = argsObj.elapsedTime
            }
        } 
        if (argsObj.taskStatus) sendData.taskStatus = argsObj.taskStatus;
        
        if (Object.keys(sendData).length === 0) {       //入力がされていないとき     
            return;
        }

        console.log(`タスクステータス${sendData.taskStatus}`);
        
        //送信処理
        try {
            const response = await patchTask(taskId, sendData);
            console.log(`タスクdata${response.data}`);
            setTasks((prevTasks) => prevTasks.map( (task)=>{
                if(task.taskId !== taskId) return task;
                return {...task,...response.data};
            } ) )
            closeModal();

        } catch (error) {
            console.error(error);
        }
        };

    useEffect( ()=>{
        const buRunTask = localStorage.getItem("runningTaskBackup");
        console.log("buRunTask/////"+buRunTask)
        if(buRunTask){
            console.log("入った")
            const parsed = JSON.parse(buRunTask);
            handleUpdateTask(parsed.taskId,{elapsedTime:parsed.elapsedTime,taskStatus:"PAUSE"})
            
            localStorage.removeItem("runningTaskBackup");
        }

    },[])

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
                            <TaskCard key={task.taskId} task={task} tasks={tasks} getOptions={getOptions} 
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
                                <TaskCard key={task.taskId} task={task} tasks={tasks}  getOptions={getOptions}
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
                            <TaskCard key={task.taskId} task={task} tasks={tasks}  getOptions={getOptions}
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
                <section className={cx(style.taskField,style.compTakField)}>
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

                    modalType === "TASK_OVER" ? (
                    <ModalForm>
                        <TaskOver />
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