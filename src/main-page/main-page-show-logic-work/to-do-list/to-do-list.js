import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import './to-do-list.css';
import DatePicker from 'react-datepicker';
import ToDoListHeader from './to-do-list-header/to-do-list-header';
import { format } from 'date-fns';

function ToDoList() {
  const [affairs, setAffairs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState(''); 
  const [description, setDescription] = useState(''); 
  const [tags, setTags] = useState(''); 
  const [endDate, setEndDate] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAffair, setCurrentAffair] = useState(null);

  useEffect(() => {
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
        setAffairs(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAffairs();
  }, []);

  const handleFinishAffair = async (affair) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:3000/api/user-finish-affairs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          affair_id: affair.id,
          affair_name: affair.affair_name,
          affair_end_date: affair.affair_end_date,
          affair_description: affair.affair_description,
          affair_tags: affair.affair_tags,
        }),
      });

      if (!response.ok) {
        throw new Error('Не вдалося завершити завдання');
      }

      setAffairs((prevAffairs) => prevAffairs.filter((a) => a.id !== affair.id));
    } catch (error) {
      console.error("Помилка - ", error);
    }
  };

  const handleAddAffair = async () => {
    const token = localStorage.getItem('token');
    const tagsArray = tags.split(',').map(tag => tag.trim());


    if (endDate) {
      endDate.setDate(endDate.getDate() + 1); 
    }

    try {
      const response = await fetch('http://localhost:3000/api/user-affairs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          affair_name: name,
          affair_description: description,
          affair_tags: tagsArray,
          affair_end_date: endDate ? endDate.toISOString() : null, 
        }),
      });

      if (!response.ok) {
        throw new Error('Не вдалося додати завдання');
      }

      const newAffair = await response.json();
      setAffairs(prevAffairs => [...prevAffairs, newAffair.data]);
      setName('');
      setDescription('');
      setTags('');
      setEndDate(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditAffair = (affair) => {
    setCurrentAffair(affair);
    setIsModalOpen(true);
  };

  const handleSaveAffair = async () => {
    const token = localStorage.getItem('token');


    if (currentAffair.affair_end_date) {
      let updatedDate = new Date(currentAffair.affair_end_date);
      updatedDate.setDate(updatedDate.getDate() + 1); 
      currentAffair.affair_end_date = updatedDate.toISOString();
    }

    try {
      const response = await fetch(`http://localhost:3000/api/user-affairs/${currentAffair.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          affair_name: currentAffair.affair_name,
          affair_description: currentAffair.affair_description,
          affair_tags: currentAffair.affair_tags,
          affair_end_date: currentAffair.affair_end_date,
        }),
      });

      if (!response.ok) {
        throw new Error('Не вдалося оновити завдання');
      }

      const updatedAffair = await response.json();
      setIsModalOpen(false);
      setCurrentAffair(null);

      setAffairs((prevAffairs) => {
        const updated = prevAffairs.map((affair) =>
          String(affair.id) === updatedAffair.data.id ? updatedAffair.data : affair
        );
        return updated;
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAffair = async (id) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:3000/api/user-affairs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Не вдалося видалити завдання');
      }

      setAffairs((prevAffairs) => prevAffairs.filter((affair) => affair.id !== id)); 
    } catch (error) {
      console.error(error);
    }
  };




  return (
    <div className="background">
      <div className="containerForBalls"></div>
      <ToDoListHeader />
      <div className="flexForInputsDailyAffairs">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          placeholderText="Select End Date"
          dateFormat="dd.MM.yyyy"
        />
        <div className="buttonForToDo" onClick={handleAddAffair}>Add Affair</div>
      </div>
      <div className="cardsContainerDaily">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          affairs.map((affair) => (
            <div className="cardDailyAffair" key={affair.id}>
              <div className="headCardForDailyAffair">
                <div className="affairName">{affair.affair_name}</div>
                <div>{affair.affair_end_date ? format(new Date(affair.affair_end_date), 'dd.MM.yyyy') : ''}</div>
              </div>
              <div className="descDailyAffairCard">{affair.affair_description}</div>
              <div className="tagsDailyAffairCard">
                {Array.isArray(affair.affair_tags) ? affair.affair_tags.join(', ') : ''}
              </div>
              <div className="settingsDailyAffairCard">
                <div className="buttonForAffairs" onClick={() => handleDeleteAffair(affair.id)}>
                  Delete
                </div>
                <div className="buttonForAffairs" onClick={() => handleEditAffair(affair)}>
                  Edit
                </div>
                <div className="buttonForAffairs" onClick={() => handleFinishAffair(affair)}>Finish</div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && currentAffair && (
        <div className="modalToDo">
          <div className="modalContentToDo">
            <h3>Edit Affair</h3>
            <input
              type="text"
              value={currentAffair.affair_name}
              onChange={(e) =>
                setCurrentAffair({ ...currentAffair, affair_name: e.target.value })
              }
              placeholder="Name"
            />
            <textarea
              value={currentAffair.affair_description}
              onChange={(e) =>
                setCurrentAffair({ ...currentAffair, affair_description: e.target.value })
              }
              placeholder="Description"
            />
            <input
              type="text"
              value={currentAffair.affair_tags.join(', ')}
              onChange={(e) =>
                setCurrentAffair({
                  ...currentAffair,
                  affair_tags: e.target.value.split(',').map((tag) => tag.trim()),
                })
              }
              placeholder="Tags (comma separated)"
            />
            <DatePicker
              selected={new Date(currentAffair.affair_end_date)}
              onChange={(date) =>
                setCurrentAffair({
                  ...currentAffair,
                  affair_end_date: date.toISOString(),
                })
              }
              placeholderText="Select End Date"
              dateFormat="yyyy-MM-dd"
            />
            <div className="modalActionsTodo">
              <div onClick={handleSaveAffair}>Save</div>
              <div onClick={() => setIsModalOpen(false)}>Cancel</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ToDoList;