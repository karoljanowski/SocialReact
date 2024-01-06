import React, { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider'
import { motion } from 'framer-motion'
import {toast} from 'react-toastify'
import Alert from '../Alert'

const alertDefault = {
    message: "",
    isVisible: false,
    type: ""
}
export default function Signin() {
    const { login } = useAuth()
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState({
        email: "test@test.com",
        password: "password"
    })
    const navigate = useNavigate()

    async function handleLogin(e) {
        e.preventDefault()
        if(user.email === "" || user.password === ""){
            toast.error('Some of fields are empty');
            return
        }
        
        try{
            setLoading(true)
            const {
                data,
                error
              } = await login(user.email, user.password)
              if (error) {
                toast.error(error.message)
              }
              if (data.user && data.session){
                toast.success('Success!')
                setTimeout(() => {
                    navigate("/posts")
                }, 1500)
              } 

        }catch(error){
            toast.error('Unknown error')
        }
        setLoading(false)
    }
    const handleChange = ({target}) => {
        setUser(prev => ({
            ...prev,
            [target.name] : target.value,
        }))
    }
    return (
        <motion.div 
        className='start__form'
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{
            duration: 0.8
        }}
        >
            <Alert/>
            <form className='d-flex flex-column' onSubmit={handleLogin}>
                <input type="text" name="email" placeholder="email" value={user.email} onChange={handleChange}/>
                <input type="password" name="password" placeholder="password" value={user.password} onChange={handleChange}/>
                <input className='btn btn-primary' type="submit" value="Login" disabled={loading}/>
            </form>
        </motion.div>
    )
}
