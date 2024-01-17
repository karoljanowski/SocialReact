import React, { useEffect } from 'react'
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import SvgBackground from '../Start/SvgBg';

const Start = () => {
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (location.pathname === '/start' || location.pathname === '/start/') {
            navigate('/start/signin')
        }
    }, [])

    const setActive = (path) => {
        return path === location.pathname ? 'start__active' : ''
    }

    const buttonsData = [{
        text: 'Sign In',
        path: '/start/signin',
        outlet: 'signin'
    },{
        text: 'Sign Up',
        path: '/start/signup',
        outlet: 'signup'
    }]

    const buttonsElements = buttonsData.map((item, index) => {
        return <Link className={`start__switch-button ${setActive(item.path)}`}
         key={index} to={item.path} 
        >
            {item.text}
        </Link>
    })
    return (
        <div className='start'>
            <div className='start__bg'><SvgBackground/></div>
            <p className='start__logo'>social react</p>
            <div className="start__switch-buttons">
                {buttonsElements}
            </div>
                <div className="start__outlet">
                    <Outlet />
                </div>
        </div>
    )
}

export default Start

