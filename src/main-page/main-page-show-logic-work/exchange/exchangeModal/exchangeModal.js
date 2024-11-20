import React from 'react';
import './exchangeModal.css';

const ExchangeModal = ({ children, onClose }) => {
    return (
        <div className="modalBackdrop" onClick={onClose}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                <button className="modalCloseButton" onClick={onClose}>
                    X
                </button>
                {children}
            </div>
        </div>
    );
};

export default ExchangeModal;