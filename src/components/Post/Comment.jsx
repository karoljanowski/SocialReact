import React, {useEffect, useRef, useState} from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

export default function CommentsList({ comments, author, user, setConfirmFunc }){
    return (
      <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{
          duration: 0.2
      }}>
        {comments.map(comment => (
          <Comment key={comment.id} comment={comment} author={author} user={user} setConfirmFunc={setConfirmFunc} />
        ))}
      </motion.div>
    );
  };

function Comment({comment, author, user, setConfirmFunc}){

    const [options, setOptions] = useState(false)
    const owner = author === user.username || user.username === comment.username
    const ref = useRef()

    useEffect(() => {
        function handleClickOutside(){
            if (ref.current && !ref.current.contains(event.target)) {
                setOptions(false)
            }
        }

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        }
    
    }, [])

    function displayDate(date){
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
    function handleOptionClick(){
        setOptions(prev => !prev)
    }
    function handleSetConfirmFunc(func){
        setConfirmFunc(() => () => func)
    }
    async function deleteComment(){
        
    }
    async function editComment(){

    }
    
    return (
    <div ref={ref} key={comment.id} className="comments__comment">
        <div className="comments__profile-photo">
            <img src={comment.profile_photo}/>
        </div>
        <div className="comments__details">
            <span className="comments__username">{comment.username}</span>
            <p className="comments__text">{comment.text}</p>
            <span className="comments__date">{displayDate(comment.created_at)}</span>
        </div>
        {owner && <div className="comments__options">
            <FontAwesomeIcon onClick={handleOptionClick} icon='fa-ellipsis' />
            {options &&
            <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{
                duration: 0.2
            }}
            className="comments__option-list">
                <div onClick={handleSetConfirmFunc} className="comments__option comments__option-delete"><FontAwesomeIcon icon='fa-trash'/>delete</div>
                <div onClick={handleSetConfirmFunc} className="comments__option comments__option-edit"><FontAwesomeIcon icon='fa-pen-to-square'/>edit</div>
            </motion.div>
            }
        </div>}
    </div>
    )
}