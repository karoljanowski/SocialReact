import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuth } from '../../context/AuthProvider'
import Skeleton from 'react-loading-skeleton'

export default function Post({data, loading, handleLike}) {
    function handleLikeClick(){
        if(handleLike){
            handleLike(data.id)
        }
    }

    return (
        <div className='post'>
            <div className="post__content">

                <div className="post__image">
                    {loading ? <Skeleton className='post__main-image'/> : <img src={data.image} className='post__main-image'/>}
                    <div className="post__user">
                    {loading ? <Skeleton className='post__user-image' height='96%'/> : <img src={data.authorProfilePicture} className='post__user-image'/>}
                </div>
                </div>
                <div className="post__bottom">
                    <div className="post__description">
                       {loading ? <Skeleton width={"100%"}/> : <p><span className='post__author'>{data.author}</span>: {data.description}</p>}
                    </div>
                    <div className="post__buttons">
                        <div className="post__buttons-content">
                            <button onClick={handleLikeClick} className={`post__button post__like ${data.likedByCurrentUser && 'post__liked'}`}><FontAwesomeIcon icon="fa-heart"/> <span>{data.likes}</span></button>
                            <button className='post__button post__comment'><FontAwesomeIcon icon="fa-message"/></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
