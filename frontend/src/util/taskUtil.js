
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
export const validateInput = (title,description) => {
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