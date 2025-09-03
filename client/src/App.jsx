import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import React from 'react';

import MyPage from "./MyPage.jsx";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <MyPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
