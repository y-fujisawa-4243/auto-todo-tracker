//ルーティングコンポーネント
import Routing from './router/Routing';

//グローバル状態provider（Context）
import { ModalControlProvider } from './context/ModalControlProvider';       //モーダル制御
import { TaskTimerProvider } from './context/TaskTimerProvider';             //タイマー      
import { AuthenticationProvider } from './context/AuthenticationProvider';   //認証


function App() {
  return (
    <div className="container">
      <AuthenticationProvider>
        <TaskTimerProvider>
          <ModalControlProvider>
            <Routing />
          </ModalControlProvider>
        </TaskTimerProvider>
      </AuthenticationProvider>
    </div>
  );
}

export default App;

