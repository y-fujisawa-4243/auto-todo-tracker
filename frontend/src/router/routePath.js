/*
■ルートのパス定数宣言
・以下で利用
　Router.jsx内でのpath設定
　navigateでのURL指定
　Linkタグでの使用
*/

const ROUTE_PATHS = {
    HOME: "/",
    LIST: "/list",
    COMPLETE:"/list/complete",
    TASK_DETAIL: (id) => `/task/${id}`, // 動的パラメータにも対応！
  };

  export default ROUTE_PATHS;