//Reactライブラリ
import { useState,useContext,useRef ,createContext} from "react";

//グローバル定数
import { STORAGE_NAMES, TAKS_STATUS } from "../constants/appConstants";

//Context作成
const TaskTimerContext = createContext();

export const TaskTimerProvider = ({children}) => {

    const [elapsed, setElapsed] = useState(0);      //計測時間
    const intervalRef = useRef(null);               //setInterval関数のintervalIDを保持する  
    const startedAtRef = useRef(null);              //タスク開始時の初期時刻。初期値は0 or サーバーに保存される計測時間
    const runTaskRef = useRef(null);                //進捗中タスクを保持する 

    //タイマー開始関数
    const startTimer =  (task) =>{

        //計測中または開始タスクがすでに計測中ならば、何もしない。
        if (intervalRef.current || (runTaskRef.current && runTaskRef.current.taskId === task.taskId)) return;  

        runTaskRef.current = task

        //過去の計測を反映
        const startTime = Date.now();
        const taskTime = task.elapsedTime * 1000;    //sec → ms
        startedAtRef.current = startTime - taskTime;   
        setElapsed(task.elapsedTime);
        
        //タイマー開始処理
        intervalRef.current = setInterval(() => {

            //計測処理
            const currentTime = Date.now();
            const elapsedMs = currentTime - startedAtRef.current;
            const elapsedSec = Math.floor(elapsedMs / 1000);
            setElapsed(elapsedSec);

            //復旧処理に使うため、localStrageへバックアップをとる
            const localCopyRunTask = {...runTaskRef.current,taskStatus:TAKS_STATUS.RUNNING ,elapsedTime:elapsedSec}
            localStorage.setItem(STORAGE_NAMES.RUNNING_TASK_BACKUP,JSON.stringify(localCopyRunTask));

        }, 1000);        

    };
    
    
    //タイマー停止関数
    const stopTimer = (task) => {

        //未計測または他タスクの停止指示の場合、何もしない。
        if(!intervalRef.current ||runTaskRef.current && runTaskRef.current.taskId !== task.taskId) return;

        clearInterval(intervalRef.current);
        intervalRef.current = null;
        runTaskRef.current = null;

        setElapsed(elapsed)

    };


    //フォーマット変換関数
    const format = (elapsed) => {

        //計測時間がない場合
        if(elapsed===0) return"00:00:00"

        //359999sec = 99h59m59s を上限とし、それ以降は描画しない(計測はStopまで続ける)
        const MAX_ELAPSED_SEC = 359999;
        const elapsedSec = Math.min(elapsed, MAX_ELAPSED_SEC);

        const hour = String(Math.floor(elapsedSec / 3600)).padStart(2, '0');
        const min = String(Math.floor((elapsedSec % 3600) / 60)).padStart(2, '0');
        const sec = String(elapsedSec % 60).padStart(2, '0');
        return `${hour}:${min}:${sec}`

    }


    //UI描画用に計測時間を返す関数。(進捗中以外は保存された時間を返す)
    const getTime = (task)=>{
        
        if (runTaskRef.current && runTaskRef.current.taskId === task.taskId){
            return format(elapsed);
        } else{
            return format(task.elapsedTime);
        }

    }


    return(
        <>
            <TaskTimerContext.Provider value={
                {
                elapsed,
                intervalRef,
                setElapsed,
                startTimer,
                stopTimer,
                getTime
                }
            }>
            {children}
            </TaskTimerContext.Provider>
        </>
    )
}

export const useTaskTimer = () => useContext(TaskTimerContext);