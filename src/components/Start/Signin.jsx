import React, { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider'
import { motion } from 'framer-motion'
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
            return
        }
        
        try{
            setLoading(true)
            const {
                data,
                error
              } = await login(user.email, user.password)
              if (error) {

              }
              if (data.user && data.session){
                  navigate("/posts")
              } 

        }catch(error){
            console.log(error)

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
            {/* <Alert content={alert}/> */}
            <form className='d-flex flex-column' onSubmit={handleLogin}>
                <input type="text" name="email" placeholder="email" value={user.email} onChange={handleChange}/>
                <input type="password" name="password" placeholder="password" value={user.password} onChange={handleChange}/>
                <input className='btn btn-primary' type="submit" value="Login" disabled={loading}/>
            </form>
        </motion.div>
    )
}
