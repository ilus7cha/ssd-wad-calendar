import React, { useState, useEffect } from 'react';
import './Calendar.css';
import EventModal from './EventModal';

const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Calendar = () => {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('events');
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedDay, setSelectedDay] = useState(null);
  const currentDate = new Date();

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const addEvent = (day, event) => {
    if (!events[day]) {
      events[day] = [];
    }
    if (events[day].length < 3) {
      event.color = generateRandomColor();
      setEvents({
        ...events,
        [day]: [...events[day], event],
      });
    }
  };

  const editEvent = (day, index, newEvent) => {
    const newEvents = { ...events };
    newEvents[day][index] = { ...newEvents[day][index], ...newEvent };
    setEvents(newEvents);
  };

  const deleteEvent = (day, index) => {
    const newEvents = { ...events };
    newEvents[day].splice(index, 1);
    if (newEvents[day].length === 0) delete newEvents[day];
    setEvents(newEvents);
  };

  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = daysInMonth(month, year);
    const firstDay = new Date(year, month, 1).getDay();
    const rows = [];
    let cells = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(<div className="calendar-day empty" key={`empty-${i}`}></div>);
    }

    for (let day = 1; day <= days; day++) {
      const dayKey = `${year}-${month + 1}-${day}`;
      const dayEvents = events[dayKey] || [];
      const bgStyles = dayEvents
        .map((event, index) => `${event.color} ${index * 33.33}% ${(index + 1) * 33.33}%`)
        .join(',');

      cells.push(
        <div
          className="calendar-day"
          key={dayKey}
          onClick={() => handleDayClick(dayKey)}
          style={{
            background: dayEvents.length
              ? `linear-gradient(180deg, ${bgStyles})`
              : 'white',
          }}
        >
          <div className="date">{day}</div>
          {dayEvents.map((event, index) => (
            <div
              key={index}
              className="event"
              style={{ backgroundColor: event.color }}
            >
              <div>{event.name}</div>
              <div>{event.email}</div>
              <div>{event.time}</div>
            </div>
          ))}
        </div>
      );

      if ((day + firstDay) % 7 === 0 || day === days) {
        rows.push(
          <div className="calendar-row" key={day}>
            {cells}
          </div>
        );
        cells = [];
      }
    }
    return rows;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h2>
      </div>
      <div className="calendar-grid">{renderDays()}</div>
      {selectedDay && (
        <EventModal
          day={selectedDay}
          events={events[selectedDay] || []}
          addEvent={addEvent}
          editEvent={editEvent}
          deleteEvent={deleteEvent}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
};

export default Calendar;