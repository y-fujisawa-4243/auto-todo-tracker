//Reactライブラリ
import { useState ,useEffect, useMemo } from 'react';

//Context
import { useModalControl } from "../../../context/ModalControlProvider"

//コンポーネント
import SideMenu from "../../side-menu/SideMenu"
import TaskCard from "../../task/task-card/TaskCard"

//スタイル
import cx from "classnames";
import style from "./BaseTaskList.module.css"
import baseStyle from "../../../style/Util.module.css"

//Context
import { useTaskTimer } from '../../../context/TaskTimerProvider';

//util関数
import { removeRunTaskBu } from '../../../util/taskUtil';

//グローバル定数
import {  MODAL_TYPE, STORAGE_NAMES, TAKS_STATUS } from "../../../constants/appConstants";


const BaseTaskList = (
    {
        tasks,
        isInCompletedTaskList,
        getOptions,
        handleUpdateTask,
        fetchTasks
    }) => {

    const {openModal} = useModalControl(); 
    const {intervalRef} = useTaskTimer();


    //tasksの値が更新されたとき、グルーピング処理
    const groupedTasks = useMemo( ()=>{
        return{
        "RUNNING":tasks.filter( task=>task.taskStatus===TAKS_STATUS.RUNNING ),
        "PAUSE":tasks.filter( task=>task.taskStatus===TAKS_STATUS.PAUSE  ),
        "TODO":tasks.filter( task=>task.taskStatus===TAKS_STATUS.TODO  ),
        "STOP":tasks.filter( task=>task.taskStatus===TAKS_STATUS.STOP  )
        }   
    },[tasks] )


    //描画用のオブジェクト
    const taskOptions = [
        {status:TAKS_STATUS.RUNNING,label:"進捗中"},
        {status:TAKS_STATUS.PAUSE,label:"中断"},
        {status:TAKS_STATUS.TODO,label:"未実施"}
    ]


    //復旧処理
    const recoveryRunTask = async (buRunTask) => {

        const parsed = JSON.parse(buRunTask);
        await handleUpdateTask(parsed.taskId,{elapsedTime:parsed.elapsedTime,taskStatus:"PAUSE"})
        
        removeRunTaskBu();       
        localStorage.removeItem(STORAGE_NAMES.NEED_RECOVERY_BY_SYSTEM);
        localStorage.removeItem(STORAGE_NAMES.NEED_RECOVERY_BY_HOME);

    }

    
    //マウント時初期処理
    useEffect( ()=>{

        //localStrageデータ取得
        const buRunTask = localStorage.getItem(STORAGE_NAMES.RUNNING_TASK_BACKUP);
        const needRecoveryBySystem = localStorage.getItem(STORAGE_NAMES.NEED_RECOVERY_BY_SYSTEM);
        const needRecoveryByHome = localStorage.getItem(STORAGE_NAMES.NEED_RECOVERY_BY_HOME);

        //それぞれ非同期で処理
        const initTaskList = async () => {

            //進捗中タスクがあるならば、復旧処理
            if(buRunTask && buRunTask.length !==0){
                //タブまたはブラウザ削除要因 || ホーム画面遷移要因 || 進捗中タスクが存在するのに計測が停止している場合(intervalIDがfalse)
                if(needRecoveryBySystem || needRecoveryByHome || !intervalRef.current ) {
                    await recoveryRunTask(buRunTask);
                    await fetchTasks();
                    return;
                }
            }
            await fetchTasks();
        }

        //発火位置
        initTaskList();

    },[])
    

    return(
        <>
        <div className={style.layout}>
            <div className={style.navBar}>
                <SideMenu />
            </div>
            <main className={style.mainContainer}>
                {isInCompletedTaskList ? (<h2>タスク一覧</h2>):(<h2>完了タスク一覧</h2>)}
                <section className={style.btnBox}>
                {isInCompletedTaskList ? (
                    <button 
                        onClick={() => openModal(MODAL_TYPE.CREATE)}
                        className={cx(baseStyle.baseBtn,style.uniqueBtn)}
                    >
                        新規タスク作成
                    </button>
                ):null}
                </section>
                <div className={style.horizontalLine}></div>
                <div className={style.taskList}>
                {isInCompletedTaskList ? (
                    <>
                    {taskOptions.map( (option)=>{
                        return(
                            <section key={option.key} className={style.taskField}>
                                <h3>{option.label}</h3> 
                                {groupedTasks[option.status].length===0 ? (
                                    <p className={style.notTaskMessage}>該当タスクは存在しません</p>
                                ) :
                                groupedTasks[option.status].map( (task)=>{
                                    return(
                                        <div key={task.key} className={style.cardContainer}>
                                            <TaskCard 
                                                task={task} 
                                                tasks={tasks} 
                                                getOptions={getOptions} 
                                                handleUpdateTask={handleUpdateTask} 
                                                isInCompletedTaskList={isInCompletedTaskList}
                                                >
                                            </TaskCard>
                                        </div>
                                    )
                                } )
                                }                   
                            </section>
                        )
                    } )}
                    </>
                    ):(
                    <section className={cx(style.taskField,style.compTakField)}>
                        <h3>完了</h3> 
                        {groupedTasks[TAKS_STATUS.STOP].length===0 ? (
                            <p className={style.notTaskMessage}>該当タスクは存在しません</p>
                        ) :
                        groupedTasks[TAKS_STATUS.STOP].map( (task)=>{
                            return(
                            <div key={task.key} className={style.cardContainer}>
                                <TaskCard 
                                    task={task}
                                    tasks={tasks} 
                                    getOptions={getOptions}
                                    handleUpdateTask={handleUpdateTask} 
                                    isInCompletedTaskList={isInCompletedTaskList}
                                    >
                                </TaskCard>
                            </div>
                            )
                        } )
                        }                   
                    </section>
                    )
                }    
                </div> 
            </main>

        </div>
        </>
    )
}

export default BaseTaskList;