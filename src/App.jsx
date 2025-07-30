// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Auth/login'
import Board from './pages/Boards/_id'
import CreatePostModal from './components/CreatePostModel';
import User from './pages/User/_id';
import Posted from './pages/Posted/'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Board />} />
      <Route path="/login" element={<Login />} />
      <Route path='/Profile' element ={<User/>}/>
      <Route path='/postdetail' element ={<Posted/>}/>
    </Routes>
  );
}

export default App;
