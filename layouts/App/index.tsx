import React from 'react';
import loadable from '@loadable/component';
import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';

const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Channel = loadable(() => import('@pages/Channel'));

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/workspace/channel" element={<Channel />} />
      </Routes>
    </Router>
  );
};

export default App;
