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



