//外部ライブラリ
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route , Navigate} from 'react-router-dom';

//ページコンポーネント
import Home from '../pages/home/Home.jsx';
import InCompletedTaskList from '../pages/incompleted-task-list/InCompletedTaskList.jsx';
import CompletedTaskList from '../pages/completed-task-list/CompletedTaskList.jsx';
import NotFoundPage from '../pages/not-found-page/NotFoundPage.jsx';

//Context
import { useAuth } from '../context/AuthenticationProvider.jsx';

//グローバル定数
import { ROUTE_PATHS, STORAGE_NAMES, TAKS_STATUS } from '../constants/appConstants.js';


const Routing = () => {

    const [tasks, setTasks] = useState([]); //フロント側のTaskリスト
    const { isAuth } = useAuth();           //認証状態

    
    //タブ、ブラウザ削除時のバックアップフラグ管理
    useEffect(() => {

        //タブ・ブラウザ削除時
        const handleBeforeUnload = () => {
            if (tasks.some((task) => task.taskStatus === TAKS_STATUS.RUNNING)) return;
            localStorage.setItem(STORAGE_NAMES.NEED_RECOVERY_BY_SYSTEM, 'true');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };

    }, [tasks]);//RUNNINGタスクの有無に応じてフラグ制御のため、tasksに依存

    return (
        <BrowserRouter>
            <Routes>
                <Route path={ROUTE_PATHS.HOME} element={<Home />}></Route>
                <Route
                    path={ROUTE_PATHS.LIST}
                    element={
                        isAuth ? (
                            <InCompletedTaskList tasks={tasks} setTasks={setTasks} />
                        ) : (
                            <Navigate to={ROUTE_PATHS.HOME} />
                        )
                    }
                ></Route>
                <Route
                    path={ROUTE_PATHS.COMPLETE}
                    element={
                        isAuth ? (
                            <CompletedTaskList tasks={tasks} setTasks={setTasks} />
                        ) : (
                            <Navigate to={ROUTE_PATHS.HOME} />
                        )
                    }
                ></Route>
                <Route path={ROUTE_PATHS.NOT_FOUND} element={<NotFoundPage />}></Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Routing;
