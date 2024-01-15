import React from 'react'
import { motion } from 'framer-motion';

export default function ConfirmModal ({ show, onConfirm, onCancel, message })  {
    if (!show) return null;

    return (
        <motion.div 
        className="confirm-modal"
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{
            duration: 0.2
        }}>
            <div className="confirm-modal__content">

                <p>{message}</p>
                <div className="confirm-modal__buttons">
                    <button className='btn btn-tertiary' onClick={onCancel}>Cancel</button>
                    <button className='btn btn-primary' onClick={onConfirm}>Confirm</button>
                </div>
            </div>
        </motion.div>
    );
};