import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuth } from '../../context/AuthProvider'
import { useParams } from 'react-router-dom'
import { supabase } from '../../helpers/supabaseCilent'
import { Link } from 'react-router-dom'
import CountUp from 'react-countup';
import { v4 as uuidv4 } from 'uuid';
import ProfilePosts from './ProfilePosts';
import { toast } from 'react-toastify';
import Alert from '../Alert';
import Skeleton from 'react-loading-skeleton'
import { motion } from 'framer-motion'

export default function Profile() {
    const [loading, setLoading] = useState(true)
    const [loadingEditProfilePicture, setLoadingEditProfilePicture] = useState(false)
    const [loadingEditDescription, setLoadingEditDescription] = useState(false)
    const currentUser = useAuth()
    const params = useParams()
    const [isCurrentUser, setIsCurrentUser] = useState(false)
    const [userData, setUserData] = useState({})
    const [postsData, setPostsData] = useState([])

    const [isEditingDescription, setIsEditingDescription] = useState(false)
	const [descriptionValue, setDescriptionValue] = useState('')
    const [isCurrentUserFollowingUser, setIsCurrentUserFollowingUser] = useState(false)

    useEffect(() => {
        async function getUserData(){
            if(currentUser.userInfo){
                
                let userData = {}
                if(currentUser.userInfo[0].username === params.username || !params.username){
                    setIsCurrentUser(true)

                }
                const {data, error} = await supabase
                .rpc('getuserbyusername', {username_param: params.username ? params.username : currentUser.userInfo[0].username})

                if(data.length === 0 || error){
                    setUserData({})
                    setLoading(false)
                    return
                }
                userData = {
                    id: data[0].profile_id,
                    username: data[0].username,
                    profilePicture: data[0].profile_photo,
                    description: data[0].description,
                    followers: data[0].followers,
                    following: data[0].following,
                    posts: data[0].posts
                }
                setIsCurrentUserFollowingUser(data[0].followers.some(item => item === currentUser.userInfo[0].id))
                
                //fetch posts
                if(userData.id){
                    const {data, error} = await supabase
                    .from('posts')
                    .select()
                    .eq('user', userData.id)
                    .order('created_at', { ascending: false })
 
                    if(!error && data){
                        setPostsData(data.map(post => {
                            return {
                                id: post.id,
                                image: post.image,
                            }
                        }))
                    }
                }
                setLoading(false) // false
                setUserData(userData)
            }
        }

        getUserData()

    }, [currentUser])
   
    async function handleFollow(user, currentUser){
        const data = {
            follower_id: currentUser, 
            followed_id: user
        }

        if(isCurrentUserFollowingUser){
            const {error} = await supabase
            .from('follows')
            .delete()
            .eq('follower_id', currentUser)
            .eq('followed_id', user)
            

            if(!error){
                setIsCurrentUserFollowingUser(false)
            }else{
                toast.error('Unknown error')
            }
        }else{
            const {error} = await supabase
            .from('follows')
            .insert(data)

            if(!error){
                setIsCurrentUserFollowingUser(true)
            }else{
                toast.error('Unknown error')
            }
        }
    }
    async function handleChangeProfilePicture(e){
        e.preventDefault()
        setLoadingEditProfilePicture(true)
        const {data: imageData, error: imageError} = await supabase
        .storage
        .from('PostPhotos')
        .upload(`${userData.id}/${uuidv4()}`, e.target.files[0])
        if(!imageData || imageError){
            toast.error("You did't select a photo")
            return
        }
        const { error } = await supabase
            .from('profile')
            .update({ profile_photo: `https://zjmwpddflnufpytvgmij.supabase.co/storage/v1/object/public/${imageData.fullPath}` })
            .eq('id', userData.id)
        if(!error){
            toast.success('Success!')
            setUserData(prev => {
                return{
                    ...prev,
                    profilePicture: URL.createObjectURL(e.target.files[0])
                }
              })
        }else{
            toast.error('Unknown error')
        }
        setLoadingEditProfilePicture(false)
    }
    function handleChangeDescription(e){
		setDescriptionValue(e.target.value)
	}
    function handleEditDescription(){
		setDescriptionValue(userData.description ? userData.description : "")

		setIsEditingDescription(true)
	}
    async function handleAcceptDescription(){
        setLoadingEditDescription(true)
        const { error } = await supabase
            .from('profile')
            .update({ description: descriptionValue })
            .eq('id', userData.id)
        if(!error){
            setUserData(prev => {
                return {
                    ...prev,
                    description: descriptionValue
                }
            })
        }else{
            console.log(error)
        }
        setLoadingEditDescription(false)
        setIsEditingDescription(false)
    }
    console.log(loadingEditDescription)
    if(!loading && Object.keys(userData).length === 0) return noUser();
    return (
        <motion.div
        className='profile'
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{
            duration: 0.2
        }}>
            <Alert/>
            <div className="profile__header">
                <p className="profile__header-text">profile</p>
                {isCurrentUser && <button className='profile__logout' onClick={currentUser.signOut}><FontAwesomeIcon icon="fa-right-from-bracket" /> logout</button>}
            </div>

            <div className="profile__top">
                <div className="profile__picture">
                    {loading || loadingEditProfilePicture ? <Skeleton
                        circle
                        height="100%"
                    />
                    :
                    isCurrentUser ? 
                    <>
                    <label htmlFor="file" className='profile__file-label'>
                    <FontAwesomeIcon className='profile__picture-edit' icon={'fa-pen-to-square'}></FontAwesomeIcon>
                        <img src={userData.profilePicture} />
                    </label>
                    <input type="file" id='file' accept="image/*" name='file' className='profile__file' onChange={handleChangeProfilePicture}/>
                    </> : 
                    <img src={userData.profilePicture} alt="" />}
                </div>
                <div className="profile__info">
                    <p className='profile__username'>{loading ? <Skeleton width="100%"/> : userData.username}</p>
                    <div className="profile__stats">
                        <div className="profile__stat">
                        <span>Posts</span>
                        {loading ? <Skeleton/> :
                        <CountUp start={0} end={postsData.length} delay={0}>
                            {({ countUpRef }) => (
                            <span ref={countUpRef} />
                            )}
                        </CountUp>}
                        </div>
                        <div className="profile__stat">
                        <span>Followers</span>
                        {loading ? <Skeleton/> :
                        <CountUp start={0} end={userData.followers && userData.followers.length} delay={0}>
                        {({ countUpRef }) => (
                            <span ref={countUpRef} />
                        )}
                        </CountUp>}
                        </div>
                        <div className="profile__stat">
                        <span>Following</span>
                        {loading ? <Skeleton/> : 
                        <CountUp start={0} end={userData.following && userData.following.length} delay={0}>
                        {({ countUpRef }) => (
                            <span ref={countUpRef} />
                        )}
                        </CountUp>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="profile__description">
                {loading || loadingEditDescription ? <Skeleton width="100%"/> :
                isEditingDescription ? 
                    <>
                        <input autoFocus className="profile__description-edit" type='text' value={descriptionValue} onChange={handleChangeDescription}></input>
                        <FontAwesomeIcon onClick={handleAcceptDescription} className='profile__description-icon-edit' icon={'fa-check'}></FontAwesomeIcon>
                    </> :
                    <>
                    {userData.description}
                    {isCurrentUser && <FontAwesomeIcon onClick={handleEditDescription} className='profile__description-icon-edit' icon="fa-pen-to-square"></FontAwesomeIcon>}
                    </>
                }
            </div>
            {loading ? <Skeleton width="100&" className='btn-follow-skeleton'/>:
            !isCurrentUser && 
            <button className={`btn btn-primary ${isCurrentUserFollowingUser ? 'btn-unfollow' : 'btn-follow'}`} onClick={() => handleFollow(userData.id, currentUser.userInfo[0].id)}>
                {isCurrentUserFollowingUser ? 'Unfollow' : 'Follow'}
            </button>}
            <ProfilePosts posts={postsData} loading={loading}/>
        </motion.div>
    )
}
function noUser(){
    return (
        <div className="profile">
            <div className="profile__header">
                <p className="profile__header-text">profile</p>
            </div>
            <div className='profile__no-user'>
                <p>user doesn't exist</p>
                <Link className='btn btn-primary' to={'/search'}>Search users</Link>
            </div>
        </div>
    )
  }