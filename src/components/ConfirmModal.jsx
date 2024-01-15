import React from 'react'

export default function ConfirmModal ({ show, onConfirm, onCancel, message })  {
    if (!show) return null;

    return (
        <div className="confirm-modal">
            <div className="confirm-modal__content">

                <p>{message}</p>
                <div className="confirm-modal__buttons">
                    <button className='btn btn-tertiary' onClick={onCancel}>Cancel</button>
                    <button className='btn btn-primary' onClick={onConfirm}>Confirm</button>
                </div>
            </div>
        </div>
    );
};