import React, { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../helpers/supabaseCilent'
import { motion } from 'framer-motion'
import {toast} from 'react-toastify'
import Alert from '../Alert'
import StandardMotion from '../StandardMotion'

const Signup = () => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [user, setUser] = useState({
        email: "",
        username: "",
        password: ""
    })


    const handleSignup = async (e) => {
        e.preventDefault();
    
        if (!user.email || !user.password || !user.username) {
            toast.error('Some of fields are empty');
            return; 
        }
        if(user.username.includes(' ')){
            toast.error("Username can't includes whitespaces");
            return; 
        }
    
        try {
            setLoading(true);
            const {error} = await supabase.auth.signUp({
                email: user.email,
                password: user.password,
                options: {
                    data: {
                        username: user.username
                    }
                }
            });
            if(error){
                toast.error(error.message);
            } else {
                toast.success('Your account has been created')
                setTimeout(() => {
                    navigate('/start/signin');
                }, 3000)
            }
            
        } catch (error) {
            toast.error('Unknown error');
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
        <StandardMotion divClass='start__form'>
            <Alert/>
            <form className='d-flex flex-column' onSubmit={e => handleSignup(e)}>
                <input type="text" name="email" placeholder="email" onChange={handleChange} value={user.email}/>
                <input type="text" name="username" placeholder="username" onChange={handleChange} value={user.username}/>
                <input type="password" name="password" placeholder="password" onChange={handleChange} value={user.password}/>
                <input className="btn btn-primary" type="submit" value="Sign up" disabled={loading}/>
            </form>
        </StandardMotion>
    )
}
export default Signup