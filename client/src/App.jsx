// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/login';
import Board from './pages/Boards/_id';
import User from './pages/User/_id';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Board />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile/:userId" element={<User />} /> 
    </Routes>
  );
}

export default App;
