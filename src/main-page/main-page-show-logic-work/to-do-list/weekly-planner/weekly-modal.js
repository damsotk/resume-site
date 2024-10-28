import React, { useState } from 'react';

const WeekModal = ({ isOpen, week, tasks, onClose, onSave }) => {
  const [selectedTasks, setSelectedTasks] = useState(week ? { ...week.days } : {});

  if (!isOpen || !week) return null;

  const handleTaskChange = (day, taskId) => {
    const newTasksForDay = selectedTasks[day].filter(task => task.id !== taskId);
    setSelectedTasks({
      ...selectedTasks,
      [day]: newTasksForDay
    });
  };

  const handleAddTask = (day, taskId) => {
    const taskToAdd = tasks.find(task => task.id === taskId);
    if (taskToAdd) {
      setSelectedTasks({
        ...selectedTasks,
        [day]: [...(selectedTasks[day] || []), taskToAdd]
      });
    }
  };

  const ensureAllDaysExist = () => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const updatedTasks = { ...selectedTasks };

    daysOfWeek.forEach(day => {
      if (!updatedTasks[day]) {
        updatedTasks[day] = [];
      }
    });

    return updatedTasks;
  };

  const handleSave = () => {
    const updatedWeek = { ...week, days: ensureAllDaysExist() };
    onSave(updatedWeek);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Week: {week.name}</h2>

        
        {Object.keys(week.days).map(day => (
          <div key={day} className="day-tasks">
            <h4>{day}</h4>
            {(selectedTasks[day]?.length > 0) ? (
              <ul>
                {selectedTasks[day].map(task => (
                  <li key={task.id}>
                    {task.name}
                    <button onClick={() => handleTaskChange(day, task.id)}>Remove</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tasks for this day</p>
            )}

            <select onChange={(e) => handleAddTask(day, e.target.value)}>
              <option value="">Select a task to add</option>
              {tasks
                .filter(task => !selectedTasks[day]?.some(t => t.id === task.id))
                .map(task => (
                  <option key={task.id} value={task.id}>
                    {task.name}
                  </option>
                ))}
            </select>
          </div>
        ))}

        <button onClick={handleSave}>Save Changes</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default WeekModal;