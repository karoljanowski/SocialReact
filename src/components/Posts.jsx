import React, {useState, useEffect} from 'react'
import Post from './Post'
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../helpers/supabaseCilent';

export default function Posts() {
    const [postsData, setPostsData] = useState(null)
    const currentUser = useAuth()

    useEffect(() => {
        async function fetchPosts(){
            
            const {data, error} = await supabase
            .rpc('get_followed_posts', {current_profile_id: currentUser.userInfo[0].id})

            if(error) console.log(error)

            if(data){
                setPostsData(data.map(post => {
                    return {
                        id: post.post_id,
                        author: post.username,
                        authorProfilePicture: post.profile_photo,
                        image: post.image,
                        description: post.description
                    }
                }))
            } 
            
        }
        if(currentUser.userInfo){
            fetchPosts()
        }
    }, [currentUser])
     
    const postsList = postsData ? postsData.map((item, index) => {
        return <Post key={index} data={item} />
    }) : null


    return (
        <div className='posts'>
            <p className="posts__header">feed</p>
            <div className="posts__content">
                <div className="posts__list">
                    {postsList}
                </div>
            </div>
        </div>
    )
}
