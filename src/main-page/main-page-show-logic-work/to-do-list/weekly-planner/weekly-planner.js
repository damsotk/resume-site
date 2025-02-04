import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './weekly-planner.css';
import ToDoListHeader from '../to-do-list-header/to-do-list-header';

const WeeklyPlanner = () => {
  const [weeks, setWeeks] = useState([]);
  const [isAddOpen, openCloseAdd] = useState(false)
  const [newWeek, setNewWeek] = useState({
    week_affairs_name: "",
    week_monday: [],
    week_tuesday: [],
    week_wednesday: [],
    week_thursday: [],
    week_friday: [],
    week_saturday: [],
    week_sunday: [],
  })
  const [availableAffairs, setAvailableAffairs] = useState([])

  useEffect(() => {
    const fetchWeekAffairs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user-week-affairs', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setWeeks(response.data);
        console.log(response.data)

      } catch (err) {
        console.error('Помилка завантаження даних:', err);
      }
    };

    fetchWeekAffairs();

    const fetchAffairs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/user-affairs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Помилка отримання завдань');
        }

        const data = await response.json();


        setAvailableAffairs(data.data)
      } catch (error) {
        console.error(error);
      }
    };

    fetchAffairs();
  }, []);

  const handleWeekNameChange = (e) => {
    setNewWeek({ ...newWeek, week_affairs_name: e.target.value });
  };

  const handleTaskSelection = (day, taskId) => {
    setNewWeek((prev) => ({
      ...prev,
      [day]: prev[day].includes(taskId)
        ? prev[day].filter((id) => id !== taskId)
        : [...prev[day], taskId],
    }));
  };

  const handleRemoveTask = (day, taskId) => {
    setNewWeek((prev) => ({
      ...prev,
      [day]: prev[day].filter((id) => id !== taskId),
    }));
  };


  useEffect(() => {
    console.log("Оновлений newWeek:", newWeek);
    console.log("Оновлений availableAffairs:", availableAffairs);
  }, [newWeek, availableAffairs]);

  const handleAddWeek = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/user-week-affairs', newWeek, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Week added successfully:', response.data);
  

      const fetchWeekAffairs = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/user-week-affairs', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
  
          setWeeks(response.data); 
        } catch (err) {
          console.error('Помилка завантаження даних:', err);
        }
      };
  
      fetchWeekAffairs(); 
  

      setNewWeek({
        week_affairs_name: "",
        week_monday: [],
        week_tuesday: [],
        week_wednesday: [],
        week_thursday: [],
        week_friday: [],
        week_saturday: [],
        week_sunday: [],
      });
      openCloseAdd(false); 
    } catch (error) {
      console.error('Error adding week:', error);
    }
  };

  const handleDeleteWeek = async (weekId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/user-week-affairs/${weekId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('Week deleted successfully:', response.data);

      setWeeks(weeks.filter(week => week.id !== weekId));
    } catch (error) {
      console.error('Error deleting week:', error);
    }
  };

  return (
    <div className="background">
      <ToDoListHeader />
      <div className="containerForBalls"></div>
      <div className="flexForInputsWeeklyAffairs">
        <div className="buttonForToDo" onClick={() => openCloseAdd(true)}>Add Week</div>
      </div>
      <div className="cardsContainerWeekly">
        {weeks.length > 0 ? (
          weeks.map((week) => (
            <div className="weekCard" key={week.id}>
              <div className="weekAffairsName">{week.week_affairs_name}</div>
              <div className="weekTasks">
                {['week_monday', 'week_tuesday', 'week_wednesday', 'week_thursday', 'week_friday', 'week_saturday', 'week_sunday'].map((day, idx) => (
                  <div className="dayTasks" key={idx}>
                    <div className="weekDay">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}</div>
                    <div>
                      {week[day] && week[day].length > 0 ? (
                        week[day].map((task, taskIdx) => (
                          <div key={taskIdx} className="weekTask">
                            {task.affair_name}
                          </div>
                        ))
                      ) : (
                        <div className="weekTask">No tasks for this day</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="buttonsForWeek">
                <div className="buttonForWeek">Edit Week</div>
                <div
                  className="buttonForWeek"
                  onClick={() => handleDeleteWeek(week.id)}
                >
                  Delete Week
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No weekly affairs found</div>
        )}
      </div>

      {isAddOpen && (
        <div className='weekForm'>
          <input
            type="text"
            placeholder="Week Name"
            value={newWeek.week_affairs_name}
            onChange={handleWeekNameChange}
          />
          {['week_monday', 'week_tuesday', 'week_wednesday', 'week_thursday', 'week_friday', 'week_saturday', 'week_sunday'].map((day, idx) => (
            <div key={day}>
              <label>{['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][idx]}</label>
              <select onChange={(e) => handleTaskSelection(day, parseInt(e.target.value))}>
                <option value="" disabled selected>Select your affair</option>
                {availableAffairs.map(task => (
                  <option key={task.id} value={task.id}>{task.affair_name}</option>
                ))}
              </select>
              <div>
                {newWeek[day].map(taskId => {
                  const task = availableAffairs.find(t => t.id === taskId);
                  return (
                    task && (
                      <div key={task.id} className="taskDisplay">
                        <span>{task.affair_name}</span>
                        <button onClick={() => handleRemoveTask(day, task.id)}>Remove</button>
                      </div>
                    )
                  );
                })}
              </div>
            </div>
          ))}
          <button onClick={handleAddWeek}>Submit Week</button>
        </div>
      )}
    </div>
  );
};

export default WeeklyPlanner;