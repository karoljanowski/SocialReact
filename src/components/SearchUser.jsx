import React, { useEffect, useState } from 'react'
import useDebounce from '../hooks/useDebounce'
import { Link } from 'react-router-dom'
import { supabase } from '../helpers/supabaseCilent'
import { toast } from 'react-toastify'
import Alert from './Alert'

export default function SearchUser() {
    const [text, setText] = useState('')
    const deb = useDebounce(text, 500)
    const [users, setUsers] = useState([])
    useEffect(() => {
        async function fetchUsers(){
            if(deb.length > 0){
                const {data, error} = await supabase
                .from('profile')
                .select()
                .ilike('username', `%${deb}%`)

                if(error){
                    toast.error('Unknown error')
                }
                
                if(data && !error){
                    setUsers(data.map(user => {
                        return {
                            id: user.id ? user.id : "",
                            userProfilePicture: user.profile_photo ? user.profile_photo : "",
                            username: user.username ? user.username : ""
                        }
                    }))
                }
            }
        }
        fetchUsers()
        
    }, [deb])

    const userList = users ? users.map(user => {
        return <UserItem user={user} key={user.id}/>
    }) : null

    return (
        <div className='search'>
            <Alert/>
            <p className="search__header">
                Search users
            </p>
            <input className='search__input' type="text" value={text} onChange={e => setText(e.target.value)} autoFocus />

            <div className='search__users'>
                {users.length > 0 ? (
                    userList
                ) : (
                    deb.length > 1 && <p className='search__error'>No users found that contain "{deb}"</p>
                )}
            </div>
            
        </div>
    )
    
}
function UserItem({user}){
    return(
        <Link to={`/profile/${user.username}`}>
            <div className="search__user">
                <div className="search__img">
                    <img src={user.userProfilePicture}/>
                </div>
                <div className="search__username">
                    {user.username}
                </div>
            </div>
        </Link>
    )
}