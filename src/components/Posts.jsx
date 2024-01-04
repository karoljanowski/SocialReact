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
                        description: post.description,
                        likes: post.likers ? post.likers.length : 0,
                        likedByCurrentUser: post.likers ? post.likers.some(user => user === currentUser.userInfo[0].username) : false
                    }
                }))
            } 
            
        }
        if(currentUser.userInfo){
            fetchPosts()
        }
    }, [currentUser])
    async function handleLike(post_id){
        const postIsLiked = postsData.find(post => post.id === post_id).likedByCurrentUser === true

        if(postIsLiked){
            const {error} = await supabase
            .from('likes')
            .delete()
            .eq('post_id', post_id)
            .eq('user_id', currentUser.userInfo[0].id)
            if(error) return
            
            const newPostData = postsData.map(post => {
                if(post.id === post_id){
                    return {
                        ...post,
                        likes: post.likes - 1,
                        likedByCurrentUser: false
                    }
                }else{
                    return post
                }
            })
            setPostsData(newPostData)
            
        }else{
            //like
            const {error} = await supabase
            .from('likes')
            .insert({post_id: post_id, user_id: currentUser.userInfo[0].id})
            if(error) return

            const newPostData = postsData.map(post => {
                    if(post.id === post_id){
                        return {
                            ...post,
                            likes: post.likes + 1,
                            likedByCurrentUser: true
                        }
                    }else{
                        return post
                    }
            })
            setPostsData(newPostData)
            
        }
    }
    const postsList = postsData ? postsData.map((item, index) => {
        return <Post key={index} data={item} handleLike={handleLike}/>
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
