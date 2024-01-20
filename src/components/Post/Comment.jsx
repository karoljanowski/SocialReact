import React, {useEffect, useRef, useState} from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { supabase } from "../../helpers/supabaseCilent";
import { toast } from "react-toastify";
import ConfirmModal from "../ConfirmModal";
import Skeleton from "react-loading-skeleton";
import StandardMotion from "../StandardMotion";

const CommentsList = ({ comments, author, user, fetchData }) => {
    return (
      <StandardMotion>
        {comments.map(comment => (
          <Comment key={comment.id} comment={comment} author={author} user={user} fetchData={fetchData} />
        ))}
      </StandardMotion>
    );
  };

function Comment({comment, author, user, fetchData}){
    const [options, setOptions] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [isEditingComment, setIsEditComment] = useState(false)
    const [commentValue, setCommentValue] = useState('')
    const owner = author === user.username || user.username === comment.username
    const ref = useRef()

    useEffect(() => {
        const handleClickOutside = () => {

            if (ref.current && !ref.current.contains(event.target)) {
                setOptions(false)
            }
        }
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        }

    }, [])

    const displayDate = (date) => {
        const dateObject = new Date(date)
        const options = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
        const formattedDateTime = dateObject.toLocaleString("en-US", options).replace(",", "")
        return formattedDateTime
    }
    const handleOptionClick = () => {
        setOptions(prev => !prev)
    }
    const handleDeleteComment = async () => {
        const {error} = await supabase
        .from('comments')
        .delete()
        .eq('id', comment.id)

        setShowModal(false)

        if(!error){
            toast.success('Comment has been deleted')
            fetchData()
        }else{
            toast.error('Unknown error')
        }
    }
    const handleEditComment = () => {
        setIsEditComment(true)
        setOptions(false)
        setCommentValue(comment.text)
    }

    const handleAcceptComment = async () => {
        const {error} = await supabase
        .from('comments')
        .update({text: commentValue})
        .eq('id', comment.id)

        if(!error){
            toast.success('Comment has been edited')
            setIsEditComment(false)
            fetchData()
        }else{
            toast.error('Unknown error')
        }
    }

    return (
        <div key={comment.id} className="comments__comment">
            <div className="comments__profile-photo">
                <img src={comment.profile_photo}/>
            </div>
            <div className="comments__details">
                <span className="comments__username">{comment.username}</span>
                
                <p className="comments__text">
                    {isEditingComment ? 
                        <>
                            <input autoFocus className="comments__text-edit" type='text' value={commentValue} onChange={(e) => setCommentValue(e.target.value)}></input>
                            <FontAwesomeIcon onClick={handleAcceptComment} className='comments__text-edit-icon' icon={'fa-check'}></FontAwesomeIcon>
                        </> :
                        <>
                        {comment.text}
                        </>
                    }
                </p>

                <span className="comments__date">{displayDate(comment.created_at)}</span>
            </div>
            {(owner && !isEditingComment) && <div ref={ref} className="comments__options">
                <FontAwesomeIcon onClick={handleOptionClick} icon='fa-ellipsis' />
                {options &&
                <StandardMotion divClass="comments__option-list">
                    <div onClick={() => setShowModal(true)} className="comments__option comments__option-delete"><FontAwesomeIcon icon='fa-trash'/>delete</div>
                    <div onClick={handleEditComment} className="comments__option comments__option-edit"><FontAwesomeIcon icon='fa-pen-to-square'/>edit</div>
                </StandardMotion>
                }
            </div>}
            <ConfirmModal
                show={showModal} 
                onConfirm={handleDeleteComment} 
                onCancel={() => setShowModal(false)} 
                message="Are you sure?" 
            />
        </div>
    )
}

export default CommentsList