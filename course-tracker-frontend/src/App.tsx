import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { CoursesPage } from './pages/CoursesPage';
import { AdminPage } from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
