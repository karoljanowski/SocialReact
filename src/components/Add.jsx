import React, {useEffect, useState} from 'react'
import { useAuth } from '../context/AuthProvider'
import { supabase } from '../helpers/supabaseCilent'
import { v4 as uuidv4 } from 'uuid';
import {toast} from 'react-toastify'
import Alert from './Alert';
import ReactLoading from 'react-loading';

export default function Add() {
    const [loading, setLoading] = useState(false)
    const [post, setPost] = useState({    
        file: null,
        description: ""
    })
    const {userInfo} = useAuth()

    const handleChange = (event) => {
        const { name, type, value, files } = event.target;
        
        if (type === "file") {
            setPost(prev => ({
                ...prev,
                [name]: files[0]
            }));
        } else {
            setPost(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    async function handleSubmit(e){
        setLoading(true)
        e.preventDefault()
        const {data: imageData, error: imageError} = await supabase
        .storage
        .from('PostPhotos')
        .upload(`${userInfo[0].id}/${uuidv4()}`, post.file)

        if(!imageData || imageError){
            toast.error('Image field is empty')
            return
        }
        const {error: postError} = await supabase
        .from('posts')
        .insert(
            {
                image: `https://zjmwpddflnufpytvgmij.supabase.co/storage/v1/object/public/${imageData.fullPath}`,
                description: post.description,
                user: userInfo[0].id
            }
        )
        if(!postError){
            toast.success('Your post has been added')
        }else{
            toast.error('Unknown error');
        }
        setLoading(false)
    }
    return (
        <div className='add'>
            <Alert/>
            <p className='add__header'>Add post</p>

            <form className='add__form' onSubmit={handleSubmit}>
                <label htmlFor="file" className='add__file-label'>{post.file ? <img src={URL.createObjectURL(post.file)}/> : <span>Choose image</span>}</label>
                <input type="file" id='file' accept="image/*" name='file' className='add__file' onChange={handleChange}/>
                <input type="text" id='description' name='description' onChange={handleChange} value={post.description} placeholder='Add your description'/>
                <button className='btn btn-primary' type="submit" disabled={loading}>
                    {loading ? <ReactLoading type={'bars'} color={'var(--bs-body-color)'} height={'25px'} width={'30px'}/>
                    :
                    "Add Post"}
                </button>
            </form>
        </div>
    )
}
