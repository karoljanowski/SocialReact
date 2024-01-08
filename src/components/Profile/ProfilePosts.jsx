import React from 'react'
import Skeleton from 'react-loading-skeleton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function ProfilePosts({posts, loading}) {
    const postList = posts && posts.map(item => {
        return <ProfilePost key={item.id} data={item} />
    })
    
    return (
        <>
            {
            loading ? <PostSkeleton /> : 
            postList.length > 0 ? 
            <div className='profile__posts'>
                {postList}
            </div> : 
            <p className='profile__any-posts'>
                <FontAwesomeIcon icon='fa-image'/>User don't have any posts
            </p>
            }
        </>
    )
}
function PostSkeleton(){
    return (
        <div className='profile__posts'>
            <Skeleton className='profile__post-skeleton' />
            <Skeleton className='profile__post-skeleton' />
            <Skeleton className='profile__post-skeleton' />
        </div>
    )
}
function ProfilePost({data}){
    const {image} = data
    return (
        <div className="profile__post">
            <img src={image}/>
        </div>
    )
}