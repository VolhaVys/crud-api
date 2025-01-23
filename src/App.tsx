import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import SignIn from "./components/SignIn";
import Todo from "./components/Todo";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SignIn/>}/>
                <Route path="/todo" element={<Todo/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;