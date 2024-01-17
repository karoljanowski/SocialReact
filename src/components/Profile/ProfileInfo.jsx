import React from 'react'
import Skeleton from 'react-loading-skeleton'
import CountUp from 'react-countup';

const ProfileInfo = ({loading, userData, postsDataLength}) => {
    return (
        <div className="profile__info">
        <p className='profile__username'>{loading ? <Skeleton width="100%"/> : userData.username}</p>
        <div className="profile__stats">
            <div className="profile__stat">
            <span>Posts</span>
            {loading ? <Skeleton/> :
            <CountUp start={0} end={postsDataLength} delay={0}>
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
    )
}
export default ProfileInfo