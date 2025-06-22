import { STORAGE_NAMES } from "../constants/appConstants";

//タスク更新データを構築する関数
export const buildUpdateData = (argsObj) =>{

    const data = {};                    //返送用オブジェクト
    const MAX_ELAPSED_SEC = 359999;     //最大計測値

    //引数解析
    if (argsObj.taskTitle ) data.taskTitle = argsObj.taskTitle;
    if (argsObj.taskDescription ) data.taskDescription = argsObj.taskDescription;
    if (argsObj.elapsedTime){
        if(argsObj.elapsedTime  > MAX_ELAPSED_SEC) {
            data.elapsedTime = MAX_ELAPSED_SEC
        }else{
            data.elapsedTime = argsObj.elapsedTime
        }
    } 
    if (argsObj.taskStatus) data.taskStatus = argsObj.taskStatus;

    return data;

}


//タスク作成/更新時バリデーション
export const validateInput = (title,description) =>{
    const errors = {};

    if ((title ?? "").trim() ==="") {
        errors.taskTitle = "※タイトルは必須です";
    } else if (title.length > 20) {
        errors.taskTitle = "※タイトルは20文字以内で入力してください";
    }

    if (description.length > 256) {
        errors.taskDescription = "※説明は256文字以内で入力してください";
    }

    return errors;
};


/*進捗中タスクのバックアップ削除処理
※削除処理は複数コンポーネントで使用するため、関数化した。
*/
export const removeRunTaskBu = () =>{
    localStorage.removeItem(STORAGE_NAMES.RUNNING_TASK_BACKUP);

}