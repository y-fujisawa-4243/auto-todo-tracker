//ライブラリ
import { useEffect, useMemo } from 'react';
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
    const {elapsed,intervalRef} = useTaskTimer();


    //tasksの値が更新されたとき、グルーピング処理
    const groupedTasks = useMemo( ()=>{
        return{
        "RUNNING":tasks.filter( task=>task.taskStatus==="RUNNING" ),
        "PAUSE":tasks.filter( task=>task.taskStatus==="PAUSE" ),
        "TODO":tasks.filter( task=>task.taskStatus==="TODO" ),
        "STOP":tasks.filter( task=>task.taskStatus==="STOP" )
        }   
    },[tasks] )


    //マウント時初期処理
    useEffect( ()=>{

        const needRecoveryBySystem = localStorage.getItem("needRecoveryBySystem");
        const needRecoveryByHome = localStorage.getItem("needRecoveryByHome");
        const buRunTask = localStorage.getItem("runningTaskBackup");

        //復旧処理
        const recoveryRunTask = async () => {

            const parsed = JSON.parse(buRunTask);

            console.log("parsedデータ///"+parsed)
            await handleUpdateTask(parsed.taskId,{elapsedTime:parsed.elapsedTime,taskStatus:"PAUSE"})
            
            localStorage.removeItem("runningTaskBackup");            
            localStorage.removeItem("needRecoveryBySystem");
            localStorage.removeItem("needRecoveryByHome");

        }

        //タスク取得処理
        const fetchTasks = async () => {
            try {
                const response = await getTasks();
                setTasks(response.data);
            } catch (error) {
                console.log(error)
            }

        };

        //それぞれ非同期で処理
        const initTaskList = async () => {

            //進捗中タスクがないなら、復旧処理なし
            if(buRunTask){
                
                //タブまたはブラウザ削除要因 || ホーム画面遷移要因 || 進捗中タスクがあるのにタイマー停止の時(シャットダウン時対応)
                if(needRecoveryBySystem || needRecoveryByHome || !intervalRef.current) {
                    await recoveryRunTask();
                    await fetchTasks();
                    return;
                }

            }
            await fetchTasks();
        }

        initTaskList();

    },[])
    

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


    //タスクの状態が変化するたびに進捗中タスクのバックアップを1秒周期で取得
    useEffect( ()=>{

        if(groupedTasks["RUNNING"].length === 0) return;
        const runTask = groupedTasks["RUNNING"][0];     //RUNNINGは1つのみという仕様に基づいた処理
        console.log(groupedTasks["RUNNING"][0])

        runTask.elapsedTime = elapsed;
        localStorage.setItem("runningTaskBackup",JSON.stringify(runTask));

    } ,[groupedTasks,elapsed])



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