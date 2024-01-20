import React, {useState, useEffect} from 'react'
import { useAuth } from '../../context/AuthProvider';
import { supabase } from '../../helpers/supabaseCilent';
import { Link } from 'react-router-dom';
import Alert from '../Alert';
import Post from './Post'
import StandardMotion from '../StandardMotion';
import { toast } from 'react-toastify';

const Posts = () => {
    const [postsData, setPostsData] = useState([])
    const currentUser = useAuth()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true)
            const {data, error} = await supabase
            .rpc('get_followed_posts', {current_profile_id: currentUser.userInfo[0].id})

            if(error) toast.error('Uknown error')

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
            
            setLoading(false)
        }
        if(currentUser.userInfo){
            fetchPosts()
        }
    }, [currentUser])

    const postsList = postsData ? postsData.map((item, index) => {
        return <Post key={index} data={item} list={true}/>
    }) : null

    if(!loading && postsData.length === 0) return NoPosts();
    return (
        <StandardMotion divClass='posts'>
            <Alert/>
            <p className="posts__header">feed</p>
            <div className="posts__content">
                <div className="posts__list">
                    {!loading ? postsList : <Post loading={loading} data={{}} />}
                </div>
            </div>
        </StandardMotion>
    )
}

const NoPosts = () => {
    return(
        <div className="posts">
            <p className="posts__header">feed</p>
            <div className='posts__no-posts'>
                <p>no posts</p>
                <Link className='btn btn-primary' to='/search'>Follow someone</Link>
            </div>
        </div>
    )
}

export default Posts