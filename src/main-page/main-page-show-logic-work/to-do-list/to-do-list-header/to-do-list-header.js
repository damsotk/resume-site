import { useNavigate } from 'react-router-dom';
import './to-do-list-header.css';

function ToDoListHeader() {
    const navigate = useNavigate();

    const navigateTo = (path) => {
      navigate(path);
    };
    return (
        <div>
            <div className='headerToDoList'>
                <div className='logo' onClick={() => navigateTo('/')}>
                    damsot
                </div>
                <div className='selectMode'>to do list</div>
            </div>
            <div className='menuForNavToDoList'>
                <div className='buttonForNavToDoList' onClick={() => navigateTo('/to-do-list')}>daily affairs</div>
                <div className='buttonForNavToDoList' onClick={() => navigateTo('/to-do-list/weekly-planner')}>week affairs</div>
                <div className='buttonForNavToDoList' onClick={() => navigateTo('/to-do-list/completed-affairs')}>finish affairs</div>
            </div>
        </div>
    );
}

export default ToDoListHeader;

