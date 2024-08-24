import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignupForm';
import Dashboard from './components/Category';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
      </Routes>
    </BrowserRouter>
  );
};

// Protected route component
const ProtectedRoute: React.FC = () => {
  const location = useLocation();
  const accessToken = sessionStorage.getItem('accessToken');

  if (accessToken) {
    return <Routes>
      <Route path="/" element={<Dashboard />} />
    </Routes>;
  } else {
    return <Navigate to="/login" state={{ from: location }} />;
  }
};

export default App;