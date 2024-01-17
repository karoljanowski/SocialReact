import React from 'react'
import Skeleton from 'react-loading-skeleton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'

const ProfilePosts = ({posts, loading}) => {
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
const PostSkeleton = () => {
    return (
        <div className='profile__posts'>
            <Skeleton className='profile__post-skeleton' />
            <Skeleton className='profile__post-skeleton' />
            <Skeleton className='profile__post-skeleton' />
        </div>
    )
}
const ProfilePost = ({data}) => {
    const {id, image} = data
    return (
        <Link to={`/posts/${id}`} className="profile__post">
            <img src={image}/>
        </Link>
    )
}

export default ProfilePosts