import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AuthRoute from './components/AuthRoute';
import Start from './components/Start/Start';
import Signin from './components/Start/Signin';
import Signup from './components/Start/Signup';
import Posts from './components/Post/Posts';
import Post from './components/Post/Post';
import Add from './components/Add';
import SearchUser from './components/SearchUser';
import Profile from './components/Profile/Profile';
import './scss/main.scss'
import { AnimatePresence } from 'framer-motion';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faMagnifyingGlass, faUser,  faHouse, faRocket, faHeart, faMessage, faSquarePlus, faRightFromBracket, faPenToSquare, faCheck, faImage, faTrash, faPaperPlane} from '@fortawesome/free-solid-svg-icons'
library.add(faMagnifyingGlass, faUser, faHouse, faRocket, faHeart, faMessage, faSquarePlus, faRightFromBracket, faPenToSquare, faCheck, faImage, faTrash, faPaperPlane)

function App() {
    const location = useLocation()
    return (
        <div className="container">
            <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route
                            element={<AuthRoute />}
                        >
                        <Route index element={<Navigate to="posts" replace />} />
                        <Route path="posts" element={<Posts />} />
                        <Route path="posts/:id" element={<Post list={false} />} />
                        <Route path="search" element={<SearchUser/>} />
                        <Route path="profile" element={<Profile />} />
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
            </AnimatePresence>
            
        </div>
    )
}

export default App
