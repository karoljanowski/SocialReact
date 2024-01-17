import React, {useState} from 'react'
import Skeleton from 'react-loading-skeleton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { supabase } from '../../helpers/supabaseCilent'
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

const ProfilePicture = ({loading, userData, setUserData, isCurrentUser}) => {
    const [loadingEditProfilePicture, setLoadingEditProfilePicture] = useState(false)

    const handleChangeProfilePicture = async (e) => {
        e.preventDefault()
        setLoadingEditProfilePicture(true)
        const {data: imageData, error: imageError} = await supabase
        .storage
        .from('UserProfilePicture')
        .upload(`${userData.id}/${uuidv4()}`, e.target.files[0])

        console.log(imageError)

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
    return (
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
        <img src={userData.profilePicture} />}
    </div>
    )
}
export default ProfilePicture
