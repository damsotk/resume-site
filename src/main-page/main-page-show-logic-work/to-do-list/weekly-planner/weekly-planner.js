import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeekModal from './weekly-modal';
import TaskModal from './task-modal';
import './weekly-planner.css';
import ToDoListHeader from '../to-do-list-header/to-do-list-header';
import useBallsAnimation from '../../../hooks/useBallsAnimation';

const WeeklyPlanner = () => {
  const [weeks, setWeeks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newWeek, setNewWeek] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const balls = useBallsAnimation();

  useEffect(() => {
    axios.get('http://localhost:5000/weeks')
      .then(response => setWeeks(response.data))
      .catch(error => console.error('Error fetching weeks:', error));

    axios.get('http://localhost:5000/daily_affairs')
      .then(response => setTasks(response.data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const handleAddWeek = () => {
    if (!newWeek.trim()) return;

    const weekToAdd = {
      id: String(weeks.length + 1),
      name: newWeek,
      days: { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [] }
    };

    axios.post('http://localhost:5000/weeks', weekToAdd)
      .then(response => {
        setWeeks([...weeks, response.data]);
        setNewWeek('');
      })
      .catch(error => console.error('Error adding week:', error));
  };

  const handleDeleteWeek = (weekId) => {
    axios.delete(`http://localhost:5000/weeks/${weekId}`)
      .then(() => {
        setWeeks(weeks.filter(week => week.id !== weekId));
      })
      .catch(error => console.error('Error deleting week:', error));
  };

  const openModal = (week) => {
    setCurrentWeek(week);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentWeek(null);
  };

  const saveChanges = (updatedWeek) => {
    axios.put(`http://localhost:5000/weeks/${updatedWeek.id}`, updatedWeek)
      .then(response => {
        setWeeks(weeks.map(week => week.id === updatedWeek.id ? response.data : week));
        closeModal();
      })
      .catch(error => console.error('Error updating week:', error));
  };

  const openTaskModal = (taskId) => {
    const task = tasks.find(task => task.id === taskId);
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="background">
      <ToDoListHeader />
      <div className='containerForBalls'></div>
      <div className="flexForInputsWeeklyAffairs">
        <input
          type="text"
          placeholder="New Week"
          value={newWeek}
          onChange={(e) => setNewWeek(e.target.value)}
        />
        <div className='buttonForToDo' onClick={handleAddWeek}>Add Week</div>
      </div>
      <div className="cardsContainerWeekly">
        {weeks.map(week => (
          <div key={week.id} className="weekCard">
            <div>{week.name}</div>
            <div className="weekTasks">
              {Object.keys(week.days).map(day => (
                <div key={day} className="dayTasks">
                  <div className='weekDay'>{day}</div>
                  {week.days[day].length > 0 ? (
                    <div>
                      {week.days[day].map(task => (
                        <div key={task.id} onClick={() => openTaskModal(task.id)} className='weekTask'>
                          {task.name}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='weekTask'>No tasks for this day</div>
                  )}
                </div>
              ))}
            </div>

            <div className='buttonsForWeek'>
              <div className='buttonForWeek' onClick={() => openModal(week)}>Edit Week</div>
              <div className='buttonForWeek' onClick={() => handleDeleteWeek(week.id)}>Delete Week</div>
            </div>
          </div>
        ))}
      </div>

      <WeekModal
        isOpen={isModalOpen}
        week={currentWeek}
        tasks={tasks}
        onClose={closeModal}
        onSave={saveChanges}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        task={selectedTask}
        onClose={closeTaskModal}
      />
    </div>
  );
};

export default WeeklyPlanner;