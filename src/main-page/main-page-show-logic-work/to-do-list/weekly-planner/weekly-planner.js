import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './weekly-planner.css';
import ToDoListHeader from '../to-do-list-header/to-do-list-header';
import useBallsAnimation from '../../../hooks/useBallsAnimation';

const WeeklyPlanner = () => {

  return (
    <div className="background">
      <ToDoListHeader />
      <div className='containerForBalls'></div>
      <div className="flexForInputsWeeklyAffairs">
        <input
          type="text"
          placeholder="New Week"
        />
        <div className='buttonForToDo'>Add Week</div>
      </div>
      <div className="cardsContainerWeekly">
       
          <div  className="weekCard">
            <div>week.name</div>
            <div className="weekTasks">

                <div className="dayTasks">
                  <div className='weekDay'>day</div>

                    <div>
                      
                        <div className='weekTask'>
                          task.name
                        </div>

                    </div>

                    <div className='weekTask'>No tasks for this day</div>

                </div>

            </div>

            <div className='buttonsForWeek'>
              <div className='buttonForWeek' >Edit Week</div>
              <div className='buttonForWeek' >Delete Week</div>
            </div>
          </div>

      </div>
    </div>
  );
};

export default WeeklyPlanner;