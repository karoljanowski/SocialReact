import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuth } from '../../context/AuthProvider'
import { useParams } from 'react-router-dom'
import { supabase } from '../../helpers/supabaseCilent'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import ProfilePosts from './ProfilePosts';
import ProfileInfo from './ProfileInfo'
import StandardMotion from '../StandardMotion'
import Alert from '../Alert';
import ProfilePicture from './ProfilePicture'
import TextEdit from '../TextEdit'
import FollowButton from './FollowButton'

const Profile = () => {
    const [loading, setLoading] = useState(true)
    const currentUser = useAuth()
    const params = useParams()
    const [isCurrentUser, setIsCurrentUser] = useState(false)
    const [userData, setUserData] = useState({})
    const [postsData, setPostsData] = useState([])
	const [descriptionValue, setDescriptionValue] = useState('')
    const [isCurrentUserFollowingUser, setIsCurrentUserFollowingUser] = useState(false)

    useEffect(() => {
        const getUserData = async () => {
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
                    followers: data[0].followers,
                    following: data[0].following,
                    posts: data[0].posts
                }
                setIsCurrentUserFollowingUser(data[0].followers.some(item => item === currentUser.userInfo[0].id))
                setDescriptionValue(data[0].description)
                
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
                setLoading(false)
                setUserData(userData)
            }
        }

        getUserData()

    }, [currentUser])

    const handleAcceptDescription = async () => {
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
            toast.error('Unknown error')
        }
    }

    if(!loading && Object.keys(userData).length === 0) return NoUser();

    return (
        <StandardMotion divClass={'profile'}>
            <Alert/>
            <div className="profile__header">
                <p className="profile__header-text">profile</p>
                {isCurrentUser && <button className='profile__logout' onClick={currentUser.signOut}><FontAwesomeIcon icon="fa-right-from-bracket" /> logout</button>}
            </div>

            <div className="profile__top">
                <ProfilePicture loading={loading} userData={userData} setUserData={setUserData} isCurrentUser={isCurrentUser} />
                <ProfileInfo loading={loading} userData={userData} postsDataLength={postsData.length}/>
            </div>

            <TextEdit loading={loading} editIcon={true} textValue={descriptionValue} setTextValue={setDescriptionValue} isCurrentUser={isCurrentUser} handleAcceptText={handleAcceptDescription} />

            <FollowButton loading={loading} isCurrentUser={isCurrentUser} isCurrentUserFollowingUser={isCurrentUserFollowingUser} currentUser={currentUser}/>

            <ProfilePosts posts={postsData} loading={loading}/>
            
        </StandardMotion>
    )
}

export default Profile

const NoUser = () => {
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