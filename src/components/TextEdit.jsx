import React, { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const TextEdit = ({loading, editIcon, textValue, setTextValue, isCurrentUser, handleAcceptText}) => {
    const [loadingEditText, setLoadingEditText] = useState(false)
    const [isEditingText, setIsEditingText] = useState(false)

    const handleEditText = () => {
        setIsEditingText(true)
    }
    const handleAccept = () => {
        setLoadingEditText(true)
        handleAcceptText()
        setLoadingEditText(false)
        setIsEditingText(false)
    }

    return (
            <p className='text-edit'>
            {loading || loadingEditText ? <Skeleton width="100%"/> :
            isEditingText ? 
                <>
                    <input autoFocus className='text-edit__input' type='text' value={textValue} onChange={(e) => setTextValue(e.target.value)}></input>
                    <FontAwesomeIcon onClick={handleAccept} className='text-edit__icon' icon={'fa-check'}></FontAwesomeIcon>
                </> :
                <>
                {textValue}
                {(isCurrentUser && editIcon) && <FontAwesomeIcon onClick={handleEditText} className='text-edit__icon' icon="fa-pen-to-square"></FontAwesomeIcon>}
                </>
            }
            </p>
    )
}
export default TextEdit