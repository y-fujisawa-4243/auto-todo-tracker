//ルーティングコンポーネント
import Routing from './router/Routing';

//グローバル状態provider（Context）
import { ModalControlProvider } from './context/ModalControlProvider';       //モーダル制御
import { TaskTimerProvider } from './context/TaskTimerProvider';             //タイマー      
import { AuthenticationProvider } from './context/AuthenticationProvider';   //認証


//----------------------------------------------------------
import { useState } from 'react';
import axios from 'axios';
import { checkAuth } from './api/taskApi';

const generateTestData = async () => {
  await axios.post('https://auto-todo-tracker-production.up.railway.app/list/test', { count: 50 }, { withCredentials: true });
  alert('テストデータを生成しました');
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

//----------------------------------------------------------

function App() {

//----------------------------------------------------------------------------------
  const [id,setId] = useState("");

 const generateTime = async () => {

  return await axios.patch(`https://auto-todo-tracker-production.up.railway.app/${id}`, {elapsedTime:359990}, { withCredentials: true });
 };
//----------------------------------------------------------------------------------

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
    <form>
      <input type="text" onChange={(event)=>setId(event.target.value)}></input>
      <button onClick={() => generateTestData()}>test</button>
      <button type="button" onClick={() => generateTime()}>359990</button>
      <button onClick={() => allDelete()}>全てを破壊する</button>
      <button onClick={()=>userAllDelete()}>ユーザー全削除</button>
      <button onClick={() => allDelete()}>全てを破壊する</button>
      <button onClick={() => getUser()}>情報取得</button>
      <button onClick={()=>clearStrage()}>ストレージ削除</button>
    </form>

    </>
  );
}

export default App;

