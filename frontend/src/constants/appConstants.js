/*
■ルートのパス定数宣言
・path設定、navigateでのURL指定、Linkタグでの使用
*/
export const ROUTE_PATHS = {
    HOME: "/",
    LIST: "/tasks",
    COMPLETE:"/tasks/complete",
    NOT_FOUND:"*"
};

/*ローカルストレージ用キー名*/ 
export const STORAGE_NAMES ={
    RUNNING_TASK_BACKUP:"runningTaskBackUp",
    NEED_RECOVERY_BY_SYSTEM:"",
    NEED_RECOVERY_BY_HOME:""
};

/*■タスクステータス定義*/
export const TAKS_STATUS = {
    RUNNING:"RUNNING",
    STOP:"STOP",
    PAUSE:"PAUSE",
    TODO:"TODO"
};

/*
■モーダル表示用定数
・定義値を利用してどのモーダルを開くか制御する。
*/
export const MODAL_TYPE = {
    CREATE:"CREATE",
    EDIT:"EDIT",
    DETAIL:"DETAIL",
    DELETE:"DELETE",
    WARN_RUN:"WARN_RUN",
    TASK_OVER:"TASK_OVER",
    SIGN_OUT:"SIGN_OUT",
    ACCOUNT:"ACCOUNT",
    ERROR:"ERROR"
};

//サーバー応答なしの場合のエラーメッセージ
export const ERR_MSG = "サーバーの応答がありません。しばらくしてからもう一度お試しください。"