import React, { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../helpers/supabaseCilent'
import { motion } from 'framer-motion'

export default function Signup() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [user, setUser] = useState({
        email: "",
        username: "",
        password: ""
    })


    async function handleSignup(e) {
        e.preventDefault();
    
        if (!user.email || !user.password) {
            return; 
        }
    
        try {
            setLoading(true);
            const { data, error } = await supabase.auth.signUp({
                email: user.email,
                password: user.password,
                options: {
                    data: {
                        username: user.username
                    }
                }
            });
    
            if (error) {
                console.log(error)
                return
            }
    
            if (data) {
                navigate('/start/signin');
            }
        } catch (error) {
            console.log('Signup error:', error);
        } finally {
            setLoading(false);
        }
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

            <form className='d-flex flex-column' onSubmit={e => handleSignup(e)}>
                <input type="text" name="email" placeholder="email" onChange={handleChange} value={user.email}/>
                <input type="text" name="username" placeholder="username" onChange={handleChange} value={user.username}/>
                <input type="password" name="password" placeholder="password" onChange={handleChange} value={user.password}/>
                <input className="btn btn-primary" type="submit" value="Login" disabled={loading}/>
            </form>
        </motion.div>
    )
}
