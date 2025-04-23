import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import { TaskCard } from './TaskCard';
import '../css/KanbanBoard.css';
//comment
const statuses = ["Pending", "In Progress", "Resolved", "Closed"];
const statusColors = {
  Pending: "#fef3c7",
  "In Progress": "#bfdbfe",
  Resolved: "#bbf7d0",
  Closed: "#fecaca"
};

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch(`${process.env.REACT_APP_API_URL}/ticket/get`)
      .then(res => res.json())
      .then(data => {
        const formattedData = data.map(task => ({
          ...task,
          id: task.complaint_id
        }));
        setTasks(formattedData);
      })
      .catch(error => console.error("Error fetching tasks:", error));
  };

  const updateTaskOrder = (taskId, newStatus, newIndex) => {
    setTasks(prevTasks => {
      const tasksCopy = [...prevTasks];
      const taskIndex = tasksCopy.findIndex(t => t.id === taskId);
      const task = tasksCopy[taskIndex];
      const statusTasks = tasksCopy.filter(t => t.status === newStatus);
      tasksCopy.splice(taskIndex, 1);
      const insertIndex = tasksCopy.findIndex(t =>
        t.status === newStatus &&
        statusTasks[newIndex]?.id === t.id
      );
      const updatedTask = { ...task, status: newStatus };
      const finalIndex = insertIndex >= 0 ? insertIndex : tasksCopy.length;
      tasksCopy.splice(finalIndex, 0, updatedTask);
      return tasksCopy;
    });

    fetch(`${process.env.REACT_APP_API_URL}/ticket/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ complaint_id: taskId, status: newStatus })
    })
      .then(res => res.json())
      .then(data => {
        if (newStatus === "Closed") {
          fetch(`${process.env.REACT_APP_API_URL}/police/unassign`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ complaint_id: taskId }),
          })
            .then(res => res.json())
            .then(data => {
              console.log("Police officers unassigned:", data)
              const userData = JSON.parse(sessionStorage.getItem("userData"));
              sessionStorage.setItem("userData",
                JSON.stringify({
                  ...userData,
                  complaint_id: null,
                  occupied:0
                })
              );
            })
            .catch(err => console.error("Error unassigning officers:", err));
        }
      })
      .catch(err => console.error("Error updating task status:", err));
  };

  const columnTaskCounts = statuses.map(status =>
    tasks.filter(task => task.status === status).length
  );
  const maxTaskCount = Math.max(...columnTaskCounts);
  const estimatedTaskHeight = 80;
  const sharedMinHeight = maxTaskCount * estimatedTaskHeight;

  return (
    <div className="kanban-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Kanban container that scrolls if needed */}
      <div className="kanban-board">
        {statuses.map((status) => (
          <Column
            key={status}
            status={status}
            tasks={tasks.filter(task => task.status === status)}
            onTaskDrop={updateTaskOrder}
            minHeight={sharedMinHeight}
          />
        ))}
      </div>
    </div>
  );
};

const Column = ({ status, tasks, onTaskDrop, minHeight }) => {
  const columnRef = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(-1);

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(-1);
  };

  const handleDragOver = (e) => {
    if (!e.dataTransfer.types.includes('application/json')) return;
    e.preventDefault();
    const rect = columnRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const hoverIndex = Math.min(tasks.length - 1, Math.floor(y / 60));
    setDragOverIndex(hoverIndex);
  };

  const handleDrop = (e) => {
    if (!e.dataTransfer.types.includes('application/json')) return;
    e.preventDefault();
    try {
      const taskData = JSON.parse(e.dataTransfer.getData("application/json"));
      const rect = columnRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const dropIndex = Math.min(tasks.length, Math.floor(y / 60));
      onTaskDrop(taskData.id, status, dropIndex);
    } catch (error) {
      console.error("Drop error:", error);
    }
    setDragOverIndex(-1);
  };

  const getColumnClass = () => {
    const statusClass = status.toLowerCase().replace(' ', '-');
    return `column column-${statusClass}`;
  };

  return (
    <div
      ref={columnRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={getColumnClass()}
      style={{ minHeight: `${minHeight}px` }}
    >
      <h2 className="column-title">{status}</h2>
      {tasks.map((task, index) => (
        <React.Fragment key={task.id}>
          {dragOverIndex === index && (
            <div className="drop-indicator" />
          )}
          <TaskCard task={task} isDraggingOver={dragOverIndex === index} />
        </React.Fragment>
      ))}
    </div>
  );
};

export default KanbanBoard;
