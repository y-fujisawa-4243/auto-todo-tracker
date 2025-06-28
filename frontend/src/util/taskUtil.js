//グローバル定数
import { STORAGE_NAMES , ERR_MSG} from "../constants/appConstants";

//タスク更新データを構築する関数
export const buildUpdateData = (argsObj) =>{

    const data = {};                    //返送用オブジェクト
    const MAX_ELAPSED_SEC = 359999;     //最大計測値

    //引数解析
    if (argsObj.taskTitle ) data.taskTitle = argsObj.taskTitle;
    if (argsObj.taskDescription!==undefined) data.taskDescription = argsObj.taskDescription; //タスク説明は空白でもよいため、undefined以外は編集対象
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


//開始日時取得関数
export const getCreatedAt = () =>{

    const d = new Date();

    const year = d.getFullYear();
    const month = String(d.getMonth()+1).padStart(2, "0");   //0~11の範囲で返送されるため、+1処理。10月より前ならば0をつける。
    const date = String(d.getDate()).padStart(2, "0");   //0~11の範囲で返送されるため、+1処理。10月より前ならば0をつける。

    return `${year}-${month}-${date}`;
}


/*
ユーザー作成/サインイン時バリデーション
※本来userUtilなど分けるべきだが、現状1関数であるため、taskUtilに含める。今後増える場合は対応検討。
*/
export const validateUser = (userId,password) => {
    const errors = {};

    if ((userId ?? "").trim() ==="") {
        errors.userIdMsg = "※ユーザーIDは必須入力です";
    } else if (userId.length<4 || userId.length > 20) {
        errors.userIdMsg = "※ユーザーIDは4文字以上~20文字以内で入力してください";
    }


    if ((password ?? "").trim() ==="") {
        errors.passwordMsg = "※パスワードは必須入力です";       
    }else if (password.length<8 || password.length > 64) {
        errors.passwordMsg = "※パスワードは8文字以上~64文字以内で入力してください";
    }

    return errors;
};


//API関数での通信において、エラーが返送された場合の共通処理
export const apiError = (error, setMessage) => {

    if (error.response) {
    setMessage(error.response.data.errorMsg);
    } else {
    setMessage(ERR_MSG);
    }

};
