import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuth } from '../../context/AuthProvider'

export default function Post(props) {
    const {id, author, authorProfilePicture, image, description, likes, likedByCurrentUser} = props.data
    const currentUser = useAuth()

    function handleLikeClick(){
        props.handleLike(id)
    }
    return (
        <div className='post'>
            <div className="post__content">

                <div className="post__image">
                    <img src={image} alt="" className='post__main-image'/>
                    <div className="post__user">
                    <img src={authorProfilePicture} alt="" className='post__user-image'/>
                </div>
                </div>
                <div className="post__bottom">
                    <div className="post__description">
                        <p><span className='post__author'>{author}</span>: {description}</p>
                    </div>
                    <div className="post__buttons">
                        <div className="post__buttons-content">
                            <button onClick={handleLikeClick} className={`post__button post__like ${likedByCurrentUser && 'post__liked'}`}><FontAwesomeIcon icon="fa-heart"/> <span>{likes}</span></button>
                            <button className='post__button post__comment'><FontAwesomeIcon icon="fa-message"/></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
