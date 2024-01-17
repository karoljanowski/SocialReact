import React, { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider'
import { motion } from 'framer-motion'
import {toast} from 'react-toastify'
import Alert from '../Alert'
import StandardMotion from '../StandardMotion'

const Signin = () => {
    const { login } = useAuth()
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState({
        email: "test@test.com",
        password: "password"
    })
    const navigate = useNavigate()

    const handleLogin = async (e) => {
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
        <StandardMotion divClass={'start__form'}>
            <Alert/>
            <form className='d-flex flex-column' onSubmit={handleLogin}>
                <input type="text" name="email" placeholder="email" value={user.email} onChange={handleChange}/>
                <input type="password" name="password" placeholder="password" value={user.password} onChange={handleChange}/>
                <input className='btn btn-primary' type="submit" value="Sign in" disabled={loading}/>
            </form>
        </StandardMotion>
    )
}
export default Signin