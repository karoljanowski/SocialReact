import React from 'react'

export default function ProfilePosts({posts}) {
    const postList = posts ? posts.map(item => {
        return <ProfilePost key={item.id} data={item} />
    }) : null
    return (
        <div className='profile__posts'>
            {postList}
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