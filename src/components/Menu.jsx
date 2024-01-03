import React from 'react'
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
export default function Menu() {
    return (
        <div className="menu">
            <div className="menu__items">
                <Link className='menu__item' to={'/posts'}><FontAwesomeIcon icon='fa-home' /></Link>
                <Link className='menu__item' to={'/search'}><FontAwesomeIcon icon='fa-magnifying-glass' /></Link>
                <Link className='menu__item' to={'/add'}><FontAwesomeIcon icon='fa-square-plus' /></Link>
                <Link className='menu__item' to={`/profile`}><FontAwesomeIcon icon='fa-user' /></Link>
            </div>
        </div>
    )
}
