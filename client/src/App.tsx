import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '@/pages/home/index';
import LazyLoading from './pages/lazyLoading';
import InfiniteScroll from './pages/infiniteScroll';
import ScollAnimation from './pages/scrollAnimation';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/lazy" element={<LazyLoading />}></Route>
          <Route path="/infinite" element={<InfiniteScroll />}></Route>
          <Route path="/scroll" element={<ScollAnimation />}></Route>
          <Route element={<Navigate replace to={'/'} />} path="*" />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
