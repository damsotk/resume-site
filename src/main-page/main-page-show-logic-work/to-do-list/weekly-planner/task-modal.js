import React from 'react';

const TaskModal = ({ isOpen, task, onClose }) => {
    if (!isOpen || !task) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{task.name}</h2>
                <p><strong>Description:</strong> {task.description}</p>
                <p><strong>End Time:</strong> {task.end_time}</p>
                <p><strong>Tags:</strong> {task.tags.join(', ')}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default TaskModal;