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
            .from('posts')
            .select('*, profile!inner(*)')
            
            if(error) console.log(error)

            if(data){
                setPostsData(data.map(post => {
                    return {
                        id: post.id,
                        author: post.profile.username,
                        authorProfilePicture: post.profile.profile_photo,
                        image: post.image,
                        description: post.description
                    }
                }))
            } 
            
        }
        fetchPosts()
    }, [])
     
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
