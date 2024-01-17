import React from 'react'
import { motion } from 'framer-motion';
import StandardMotion from './StandardMotion';

const ConfirmModal = ({ show, onConfirm, onCancel, message }) => {
    if (!show) return null;

    function opacityClick(e){
        if(e.target.classList.value === 'confirm-modal'){
            onCancel()
        }
    }

    return (
        <StandardMotion onClick={opacityClick} divClass="confirm-modal">
            <div className="confirm-modal__content container">
                <p>{message}</p>
                <div className="confirm-modal__buttons">
                    <button className='btn btn-tertiary' onClick={onCancel}>Cancel</button>
                    <button className='btn btn-primary' onClick={onConfirm}>Confirm</button>
                </div>
            </div>
        </StandardMotion>
    )
}

export default ConfirmModal