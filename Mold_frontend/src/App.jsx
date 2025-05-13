import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from './pages/Login';
import MoldMangement from './pages/Mold/MoldManagement';
import MoldSetting from './pages/Mold/MoldSetting';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  return (
    <Router>
      <DndProvider backend={HTML5Backend}> 
        <>
          <ToastContainer position="top-center" autoClose={3000} />
          <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/' element={<MoldMangement />} />
            <Route path='/settings' element={<MoldSetting />} />
          </Routes>
        </>
      </DndProvider>
    </Router>
  );
}

export default App;