import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuth } from '../../context/AuthProvider'
import { useParams } from 'react-router-dom'
import { supabase } from '../../helpers/supabaseCilent'
import { Link } from 'react-router-dom'
import CountUp from 'react-countup';
import { v4 as uuidv4 } from 'uuid';
import ProfilePosts from './ProfilePosts'

export default function Profile() {
    const [loading, setLoading] = useState(true)
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
                .rpc('getuserbyusername', {username_param: params.username})

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
                    console.log(data)
                    if(!error && data){
                        setPostsData(data.map(post => {
                            return {
                                id: post.id,
                                image: post.image,
                            }
                        }))
                    }
                }
                setLoading(false)
                setUserData(userData)
            }
        }

        getUserData()

    }, [currentUser])
   
    async function handleFollow(user, currentUser){
        const data = {
            follower_id: user, 
            followed_id: currentUser
        }

        if(isCurrentUserFollowingUser){
            const {error} = await supabase
            .from('follows')
            .delete()
            .eq('follower_id', user)
            .eq('followed_id', currentUser)
            

            if(!error){
                setIsCurrentUserFollowingUser(false)
            }
            console.log(error)
        }else{
            const {error} = await supabase
            .from('follows')
            .insert(data)

            if(!error){
                setIsCurrentUserFollowingUser(true)
            }
            console.log(error)
        }
    }
    async function handleChangeProfilePicture(e){
        e.preventDefault()
        const {data: imageData, error: imageError} = await supabase
        .storage
        .from('PostPhotos')
        .upload(`${userData.id}/${uuidv4()}`, e.target.files[0])
        if(!imageData || imageError){
            return
        }
        const { error } = await supabase
            .from('profile')
            .update({ profile_photo: `https://zjmwpddflnufpytvgmij.supabase.co/storage/v1/object/public/${imageData.fullPath}` })
            .eq('id', userData.id)
        if(!error){
            setUserData(prev => {
                return{
                    ...prev,
                    profilePicture: URL.createObjectURL(e.target.files[0])
                }
              })
        }else{
            console.log(error)
        }
    }
    function handleChangeDescription(e){
		setDescriptionValue(e.target.value)
	}
    function handleEditDescription(){
		setDescriptionValue(userData.description ? userData.description : "")

		setIsEditingDescription(true)
	}
    async function handleAcceptDescription(){

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
        setIsEditingDescription(false)
    }
    if(loading) return <p>loading...</p>
    return (
        <div className='profile'>
            <div className="profile__header">
                <p className="profile__header-text">profile</p>
                {isCurrentUser && <button className='profile__logout' onClick={currentUser.signOut}><FontAwesomeIcon icon="fa-right-from-bracket" /> logout</button>}
            </div>
            {
                Object.keys(userData).length !== 0 ?
                <>
                    <div className="profile__top">
                        <div className="profile__picture">
                            {isCurrentUser ? <>
                            <label htmlFor="file" className='profile__file-label'>
                            <FontAwesomeIcon className='profile__picture-edit' icon={'fa-pen-to-square'}></FontAwesomeIcon>
                                <img src={userData.profilePicture} />
                            </label>
                            <input type="file" id='file' accept="image/*" name='file' className='profile__file' onChange={handleChangeProfilePicture}/>
                            </> : 
                            <img src={userData.profilePicture} alt="" />}
                        </div>
                        <div className="profile__info">
                            <p className='profile__username'>{userData.username}</p>
                            <div className="profile__stats">
                                <div className="profile__stat">
                                <span>Posts</span>
                                <CountUp start={0} end={0} delay={0}>
                                    {({ countUpRef }) => (
                                    <span ref={countUpRef} />
                                    )}
                                </CountUp>
                                </div>
                                <div className="profile__stat">
                                <span>Followers</span>
                                <CountUp start={0} end={userData.followers && userData.followers.length} delay={0}>
                                {({ countUpRef }) => (
                                    <span ref={countUpRef} />
                                )}
                                </CountUp>
                                </div>
                                <div className="profile__stat">
                                <span>Following</span>
                                <CountUp start={0} end={userData.following && userData.following.length} delay={0}>
                                {({ countUpRef }) => (
                                    <span ref={countUpRef} />
                                )}
                                </CountUp>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="profile__description">
                        {isEditingDescription ? 
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
                    {!isCurrentUser && <button className={`btn btn-primary ${isCurrentUserFollowingUser ? 'btn-unfollow' : 'btn-follow'}`} onClick={() => handleFollow(userData.id, currentUser.userInfo[0].id)}>{isCurrentUserFollowingUser ? 'Unfollow' : 'Follow'}</button>}
                    <ProfilePosts posts={postsData}/>
                </>
                :
                noUser()
            }
        </div>
    )
}
function noUser(){
    return (
      <div className='profile__no-user'>
        <p>user doesn't exist</p>
        <Link className='btn btn-primary' to={'/search'}>Search users</Link>
      </div>
    )
  }