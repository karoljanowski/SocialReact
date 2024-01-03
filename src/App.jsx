import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthRoute from './components/AuthRoute';
import Start from './components/Start/Start';
import Signin from './components/Start/Signin';
import Signup from './components/Start/Signup';
import Posts from './components/Posts';
import Add from './components/Add';
import SearchUser from './components/SearchUser';
import Profile from './components/Profile/Profile';
import './scss/main.scss'

import { library } from '@fortawesome/fontawesome-svg-core';
import { faMagnifyingGlass, faUser,  faHouse, faRocket, faHeart, faMessage, faSquarePlus, faRightFromBracket, faPenToSquare, faCheck} from '@fortawesome/free-solid-svg-icons'
library.add(faMagnifyingGlass, faUser, faHouse, faRocket, faHeart, faMessage, faSquarePlus, faRightFromBracket, faPenToSquare, faCheck)

function App() {
    return (
        <div className="container">
            <Router>
                <Routes>
                    <Route
                        element={<AuthRoute />}
                    >
                    <Route index element={<Navigate to="posts" replace />} />
                    <Route path="posts" element={<Posts />} />
                    <Route path="search" element={<SearchUser/>} />
                    <Route path="profile/" element={<Profile />} />
                    <Route path="profile/:username" element={<Profile />} />
                    <Route path="add" element={<Add/>} />
                    </Route> 
                    <Route
                    path='/start'
                    element={<Start/>}>
                        <Route path="signin" element={<Signin />} />
                        <Route path="signup" element={<Signup />} />
                    </Route>
                </Routes>
            </Router>
            
        </div>
    )
}

export default App
