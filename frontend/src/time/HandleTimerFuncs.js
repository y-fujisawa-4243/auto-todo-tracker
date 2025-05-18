/*
計測機能や時間取得用の関数を定義するファイル
*/


//開始日時取得関数
export const getCreatedAt = () =>{

    //const currentTime = Date.now();
    const d = new Date();

    const year = d.getFullYear();
    const month = String(d.getMonth()+1).padStart(2, "0");   //0~11の範囲で返送されるため、+1処理。10月より前ならば0をつける。
    const date = d.getDate();

    return `${year}-${month}-${date}`;

}

/*
//タイマー開始関数
const handleStartTimer= (setTotalTime) =>{

    if(invIdRef.current) return;   //シングル計測のため

    invIdRef.current = setInterval( () => {
        setTotalTime( (prev) =>{
            const tmp = prev +1 
            console.log(tmp)
            return tmp}
        );

    },1000);
};


//タイマー停止関数
const handleStopTimer= () =>{
    clearInterval(invIdRef.current);
    invIdRef.current = null;
}

//形式変更
const formatTime = (totalTime) => {
    const h = String(Math.floor(totalTime / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalTime % 3600) / 60)).padStart(2, '0');
    const s = String(totalTime % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
    };
    */


