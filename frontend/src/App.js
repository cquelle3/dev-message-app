import './App.css';
import MainMenu from './menus/MainMenu';
import LoginMenu from './menus/LoginMenu';
import CreateAccountMenu from './menus/CreateAccountMenu';
import { Navigate, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Navigate to='/login' replace={true} />}></Route>
        <Route path='/login' element={<LoginMenu />}></Route>
        <Route path='/create-account' element={<CreateAccountMenu />}></Route>
        <Route path='/main-menu' element={<MainMenu />}></Route>
      </Routes>
    </>
  );
}

export default App;
