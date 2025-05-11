import { useState,useContext,useRef ,createContext, useEffect} from "react";

const TaskTimerContext = createContext();

export const TaskTimerProvider = ({children}) => {

    const [elapsed, setElapsed] = useState(0);
    const intervalRef = useRef(null);
    const startedAtRef = useRef(null);
    const runTaskIdRef = useRef(null);

    //タイマー開始関数
    const startTimer =  (task) =>{

        console.log("開始")
        //計測中または開始タスクがすでに計測中ならば、何もしない。
        if (intervalRef.current || runTaskIdRef.current === task.id) return;                

        runTaskIdRef.current = task.id

        //過去の計測を反映
        const startTime = Date.now();
        const taskTime = task.time * 1000               //sec → ms
        setElapsed(Math.floor(taskTime  / 1000));
        startedAtRef.current = startTime - taskTime;   
        
        //タイマー開始処理
        intervalRef.current = setInterval(() => {
            const currentTime = Date.now()
            const elapsedMs = currentTime - startedAtRef.current;
            setElapsed(Math.floor(elapsedMs / 1000));
        }, 1000);                                
    };
    

    //タイマー停止関数
    const stopTimer = (task) => {

        console.log("停止")

        //未計測または他タスクの停止指示の場合、何もしない。
        if(!intervalRef.current ||runTaskIdRef.current !== task.id ) return;

        clearInterval(intervalRef.current);
        intervalRef.current = null;
        runTaskIdRef.current = null;

        console.log("保存")
        setElapsed(elapsed)
    };


    //タイマー切り替え関数
    const switchTaskTimer = (task) => {

        console.log("チェンジ")
        //未計測の場合、何もしない。
        if(!intervalRef.current) return;

        clearInterval(intervalRef.current);
        intervalRef.current = null;
        runTaskIdRef.current = null;

        console.log("保存")
        setElapsed(elapsed)        
    };

    
    //フォーマット変換関数
    const format = (elapsedSec) => {
        if(elapsedSec===0) return"00:00:00"

        const hour = String(Math.floor(elapsedSec / 3600)).padStart(2, '0');
        const min = String(Math.floor((elapsedSec % 3600) / 60)).padStart(2, '0');
        const sec = String(elapsedSec % 60).padStart(2, '0');
        return `${hour}:${min}:${sec}`
    }


    const getTime = (task)=>{     
        console.log(`runtask:::${runTaskIdRef.current}///taskid:::${task.id}`)
        if (runTaskIdRef.current === task.id){
            console.log("一致")
            return format(elapsed);
        } else{
            console.log("不一致")
            return format(task.time);
        }
    }


    return(
        <>
            <TaskTimerContext.Provider value={
                {elapsed,setElapsed,startTimer,stopTimer,getTime,switchTaskTimer}
            }>
            {children}
            </TaskTimerContext.Provider>
        </>
    )
}

export const useTaskTimer = () => useContext(TaskTimerContext);