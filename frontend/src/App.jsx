//ルーティングコンポーネント
import Routing from './router/Routing';

//グローバル状態provider（Context）
import { ModalControlProvider } from './context/ModalControlProvider';       //モーダル制御
import { TaskTimerProvider } from './context/TaskTimerProvider';             //タイマー      
import { AuthenticationProvider } from './context/AuthenticationProvider';   //認証


//----------------------------------------------------------
import axios from 'axios';
import { patchTask, checkAuth } from './api/taskApi';
//----------------------------------------------------------

const generateTestData = async () => {
  await axios.post('https://auto-todo-tracker-production.up.railway.app/list/test', { count: 50 }, { withCredentials: true });
  alert('テストデータを生成しました');
};

const generateTime = async () => {
  await patchTask(340, { elapsedTime: 359990 }, { withCredentials: true });
};

const allDelete = async () => {
  await axios.delete('https://auto-todo-tracker-production.up.railway.app/tasksAll', { withCredentials: true });
};

const userAllDelete = async () => {
  await axios.delete('https://auto-todo-tracker-production.up.railway.app/userAll', { withCredentials: true });
};

const getUser = async () => {
  try {
    await checkAuth();
    console.log('認証中');
  } catch (error) {
    console.log('未認証');
  }
};

const clearStrage = () => {
  localStorage.clear();
};


function App() {
  return (
    <>
    <div className="container">
      <AuthenticationProvider>
        <TaskTimerProvider>
          <ModalControlProvider>
            <Routing />
          </ModalControlProvider>
        </TaskTimerProvider>
      </AuthenticationProvider>
    </div>
    <button onClick={() => generateTestData()}>test</button>
    <button onClick={() => generateTime()}>359990</button>
    <button onClick={() => allDelete()}>全てを破壊する</button>
    <button onClick={()=>userAllDelete()}>ユーザー全削除</button>
    <button onClick={() => allDelete()}>全てを破壊する</button>
    <button onClick={() => getUser()}>情報取得</button>
    <button onClick={()=>clearStrage()}>ストレージ削除</button>
    </>
  );
}

export default App;

