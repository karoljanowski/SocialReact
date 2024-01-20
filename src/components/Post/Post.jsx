import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Skeleton from 'react-loading-skeleton'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../helpers/supabaseCilent'
import Alert from '../Alert'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthProvider'
import { motion } from 'framer-motion'
import ConfirmModal from '../ConfirmModal'
import CommentsList from './Comment'

const Post = ({data, loading, list}) => {
    const {id} = useParams()
    const [postData, setPostData] = useState({})
    const [loadingPost, setLoadingPost] = useState(true)
    const currentUser = useAuth()
    const navigate = useNavigate()
    const [authorIsCurrentUser, setAuthorIsCurrentUser] = useState(false)
    const [commentText, setCommentText] = useState('')
    
    const [likeLoading, setLikeLoading] = useState(false)
    const [commentLoading, setCommentLoading] = useState(false)

    const [showModal, setShowModal] = useState(false)

    const fetchPost = async () => {
        setLoadingPost(true)
        const {data: fetchedData, error} = await supabase
        .rpc('get_post_by_id', {p_id: id})
        
        if(error){
            toast.error('Unknown error')
            return
        }

        if(fetchedData) {
            setPostData({
                id: fetchedData[0].post_id,
                author: fetchedData[0].username,
                authorProfilePicture: fetchedData[0].profile_photo,
                image: fetchedData[0].post_image,
                description: fetchedData[0].post_description,
                likes: fetchedData[0].likers ? fetchedData[0].likers.length : 0,
                likedByCurrentUser: fetchedData[0].likers ? fetchedData[0].likers.some(user => user === currentUser.userInfo[0].username) : false,
                comments: fetchedData[0].comments[0].id ? fetchedData[0].comments : []
            })
        }
        setLoadingPost(false)
    }
    useEffect(() => {

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

    const handleLike = async () => {
        setLikeLoading(true)
        const postIsLiked = postData.likedByCurrentUser === true

        if(postIsLiked){
            const {error} = await supabase
            .from('likes')
            .delete()
            .eq('post_id', postData.id)
            .eq('user_id', currentUser.userInfo[0].id)

            if(error) {
                toast.error('Unknown error') 
                setLikeLoading(false)
                return
            }
            
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

            if(error) {
                toast.error('Unknown error') 
                setLikeLoading(false)
                return
            }

            setPostData(prev => {
                return {
                    ...prev,
                    likes: prev.likes + 1,
                    likedByCurrentUser: true
                }
            })
            
        }
        setLikeLoading(false)
    }
    const handleDelete = async () => {
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
    const handleComment = async () => {
        if(list){
            navigate(`/posts/${postData.id}`)
            return
        }
        setCommentLoading(true)
        if(commentText.length === 0){
            toast.error('Your comment is empty')
            setCommentLoading(false)
            return
        }
        const commentData = {post_id: postData.id, user_id: currentUser.user.id, text: commentText}

        const {error} = await supabase
        .from('comments')
        .insert(commentData)

        if(error){
            toast.error('Unkown error')
            setCommentLoading(false)
            return
        }
        fetchPost()
        setCommentText('')
        toast.success('Your comment has been added')
        setCommentLoading(false)
    }
    const commentsList = postData.comments ? <CommentsList comments={postData.comments} fetchData={fetchPost} user={currentUser.userInfo[0]} author={postData.author} /> : null;

    return (
        <motion.div 
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
                    {authorIsCurrentUser && <FontAwesomeIcon onClick={() => setShowModal(true)} className='post__delete' icon="fa-trash"/>}
                </div>
            }
            <Alert/>
            <ConfirmModal
                show={showModal} 
                onConfirm={handleDelete} 
                onCancel={() => setShowModal(false)} 
                message="Are you sure?" 
            />
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
                            <button onClick={handleLike} disabled={likeLoading} className={`post__button post__like ${postData.likedByCurrentUser && 'post__liked'}`}><FontAwesomeIcon icon="fa-heart"/> <span>{postData.likes}</span></button>
                            {list === true && <button onClick={handleComment} className='post__button post__comment'><FontAwesomeIcon icon="fa-message"/></button>}
                        </div>
                    </div>
                </div>
                {list === false && 
                    <div className="comments">
                        <div className="comments__add">
                            <input value={commentText} onChange={(e) => setCommentText(e.target.value)} className='comments__input' placeholder='Add comment' type="text" />
                            <FontAwesomeIcon disabled={commentLoading} className='comments__submit-btn' icon="fa-paper-plane" onClick={handleComment}/>
                        </div>
                        <div className="comments__list">
                            {commentsList}
                        </div>
                    </div>
                }
            </div>
        </motion.div>
    )
}

export default Post