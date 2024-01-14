import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Skeleton from 'react-loading-skeleton'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { supabase } from '../../helpers/supabaseCilent'
import Alert from '../Alert'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthProvider'
import { motion } from 'framer-motion'

export default function Post({data, loading, handleLike, list}) {
    const {id} = useParams()
    const [postData, setPostData] = useState({})
    const [loadingPost, setLoadingPost] = useState(true)
    const currentUser = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [authorIsCurrentUser, setAuthorIsCurrentUser] = useState(false)

    useEffect(() => {
        async function fetchPost(){
            setLoadingPost(true)
            const {data: fetchedData, error} = await supabase
            .rpc('get_post_by_id', {p_id: id})
            
            if(error){
                toast.error('Your account has been created')
                return
            }

            if(fetchedData) {
                setPostData({
                    id: fetchedData[0].id,
                    author: fetchedData[0].username,
                    authorProfilePicture: fetchedData[0].profile_photo,
                    image: fetchedData[0].image,
                    description: fetchedData[0].description,
                    likes: fetchedData[0].likers ? fetchedData[0].likers.length : 0,
                    likedByCurrentUser: fetchedData[0].likers ? fetchedData[0].likers.some(user => user === currentUser.userInfo[0].username) : false
                })
            }
            setLoadingPost(false)
        }

        if(list === false && currentUser.userInfo){
            fetchPost()
        }else if(data){
            setPostData(data)
        }

    }, [currentUser])
    useEffect(() => {
        if(list){
            setLoadingPost(false)
        }
    }, [])
    useEffect(() => {
        if(postData && currentUser.userInfo){
            setAuthorIsCurrentUser(postData.author === currentUser.userInfo[0].username)
        }
    }, [postData])

    async function handleLike(){
        const postIsLiked = postData.likedByCurrentUser === true

        if(postIsLiked){
            const {error} = await supabase
            .from('likes')
            .delete()
            .eq('post_id', postData.id)
            .eq('user_id', currentUser.userInfo[0].id)
            if(error) toast.error('Unknown error')
            
            setPostData(prev => {
                return {
                    ...prev,
                    likes: prev.likes - 1,
                    likedByCurrentUser: false
                }
            })
            
        }else{
            //like
            const {error} = await supabase
            .from('likes')
            .insert({post_id: postData.id, user_id: currentUser.userInfo[0].id})

            if(error) toast.error('Unknown error')

            setPostData(prev => {
                return {
                    ...prev,
                    likes: prev.likes + 1,
                    likedByCurrentUser: true
                }
            })
            
        }
    }
    async function handleDelete(){
        const {error} = await supabase
        .rpc('delete_post_with_likes', {post_id_to_delete: postData.id})
        
        if(!error){
            toast.success('Post has been deleted')
            setTimeout(() => {
                navigate('/profile')
            }, 1000)
        }else{
            toast.error('Something gone wrong')
        }

    }
    function handleComment(){
        if(list){
            navigate(`/posts/${postData.id}`)
        }
    }

    return (
        <motion.div 
        id={postData.id}
        className='post'
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{
            duration: list === false ? 0.2 : 0
        }}>
            {list === false && 
                <div className='post__header'>
                    <p className="post__header-text">post</p>
                    {authorIsCurrentUser && <FontAwesomeIcon onClick={handleDelete} className='post__delete' icon="fa-trash"/>}
                </div>
            }
            <Alert/>
            <div className="post__content">

                <div className="post__image">
                    {loading || loadingPost ? <Skeleton className='post__main-image'/> : <img src={postData.image} className='post__main-image'/>}
                    <div className="post__user">
                    {loading || loadingPost ? <Skeleton className='post__user-image' height='96%'/> : <img src={postData.authorProfilePicture} className='post__user-image'/>}
                </div>
                </div>
                <div className="post__bottom">
                    <div className="post__description">
                       {loading || loadingPost ? <Skeleton width={"100%"}/> : <p><span className='post__author'>{postData.author}</span>: {postData.description}</p>}
                    </div>
                    <div className="post__buttons">
                        <div className="post__buttons-content">
                            <button onClick={handleLike} className={`post__button post__like ${postData.likedByCurrentUser && 'post__liked'}`}><FontAwesomeIcon icon="fa-heart"/> <span>{postData.likes}</span></button>
                            <button onClick={handleComment} className='post__button post__comment'><FontAwesomeIcon icon="fa-message"/></button>
                        </div>
                    </div>
                </div>
                {list === false && 
                    <div className="post__comments">
                        comments
                    </div>
                }
            </div>
        </motion.div>
    )
}

function Comment({data}){
    return (
        <p></p>
    )
}