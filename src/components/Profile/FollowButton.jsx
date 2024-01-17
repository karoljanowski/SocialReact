import React from 'react'
import Skeleton from 'react-loading-skeleton'

const FollowButton = ({loading, isCurrentUser, isCurrentUserFollowingUser, currentUser}) => {
    const handleFollow = async (user, currentUser) => {
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
    return (
        <>
            {loading ? <Skeleton width="100%" className='btn-follow-skeleton'/> :
            !isCurrentUser && 
            <button className={`btn btn-primary ${isCurrentUserFollowingUser ? 'btn-unfollow' : 'btn-follow'}`} onClick={() => handleFollow(userData.id, currentUser.userInfo[0].id)}>
                {isCurrentUserFollowingUser ? 'Unfollow' : 'Follow'}
            </button>}
        </>
    )
}
export default FollowButton