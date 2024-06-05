import React, { useState } from 'react';
import './EventModal.css';

const EventModal = ({ day, events, addEvent, editEvent, deleteEvent, onClose }) => {
  const [eventData, setEventData] = useState({ name: '', time: '', email: '' });
  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSave = () => {
    if (eventData.name && eventData.time && eventData.email) {
      if (editingIndex !== null) {
        editEvent(day, editingIndex, eventData);
      } else {
        addEvent(day, eventData);
      }
      setEventData({ name: '', time: '', email: '' });
      setEditingIndex(null);
      onClose();
    } else {
      alert("Please fill out all fields.");
    }
  };

  const handleEdit = (index) => {
    setEventData(events[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    deleteEvent(day, index);
    setEventData({ name: '', time: '', email: '' });
    setEditingIndex(null);
  };

  return (
    <div className="event-modal">
      <div className="modal-content">
        <h2>Events on {day}</h2>
        <div className="event-list">
          {events.map((event, index) => (
            <div key={index} className="event-item" style={{ backgroundColor: event.color }}>
              <span>{event.name} - {event.time} - {event.email}</span>
              <div className="event-actions">
                <button onClick={() => handleEdit(index)}>Edit</button>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
        <div className="event-form">
          <input
            type="text"
            name="name"
            placeholder="Event Name"
            value={eventData.name}
            onChange={handleChange}
          />
          <input
            type="time"
            name="time"
            placeholder="Event Time"
            value={eventData.time}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Invitees (email)"
            value={eventData.email}
            onChange={handleChange}
          />
          <button onClick={handleSave}>{editingIndex !== null ? 'Update' : 'Add'}</button>
        </div>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default EventModal;