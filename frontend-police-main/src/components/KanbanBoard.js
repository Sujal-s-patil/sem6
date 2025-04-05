// KanbanBoard.js
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import { TaskCard } from './TaskCard'; // Importing TaskCard

const statuses = ["Pending", "In Progress", "Resolved", "Closed"];
const statusColors = {
  Pending: "#fef3c7",
  InProgress: "#bfdbfe",
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
      .then((res) => res.json())
      .then((data) => {
        const formattedData = data.map(task => ({
          ...task,
          id: task.complaint_id
        }));
        setTasks(formattedData);
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  };

  const updateTaskOrder = (taskId, newStatus, newIndex) => {
    setTasks(prevTasks => {
      const tasksCopy = [...prevTasks];
      const taskIndex = tasksCopy.findIndex(t => t.id === taskId);
      const task = tasksCopy[taskIndex];

      // Filter tasks in the target status
      const statusTasks = tasksCopy.filter(t => t.status === newStatus);

      // Remove task from original position
      tasksCopy.splice(taskIndex, 1);

      // Calculate insert position in full array
      const insertIndex = tasksCopy.findIndex(t =>
        t.status === newStatus &&
        statusTasks[newIndex]?.id === t.id
      );

      // Update task status
      const updatedTask = { ...task, status: newStatus };

      // Insert at calculated position or at the end
      const finalIndex = insertIndex >= 0 ? insertIndex : tasksCopy.length;
      tasksCopy.splice(finalIndex, 0, updatedTask);

      return tasksCopy;
    });

    // Update task status in backend
    fetch(`${process.env.REACT_APP_API_URL}/ticket/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        complaint_id: taskId,
        status: newStatus
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log("API Response:", data);

        // If the task is moved to "Closed", free assigned officers
        if (newStatus === "Closed") {
          fetch(`${process.env.REACT_APP_API_URL}/police/unassign`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              complaint_id: taskId
            }),
          })
            .then(response => response.json())
            .then(data => console.log("Police officers unassigned:", data))
            .catch(error => console.error("Error unassigning officers:", error));
        }
      })
      .catch(error => console.error("Error updating task status:", error));
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', padding: '16px', flexGrow: 1 }}>
        {statuses.map((status) => (
          <Column
            key={status}
            status={status}
            tasks={tasks.filter(task => task.status === status)}
            onTaskDrop={updateTaskOrder}
          />
        ))}
      </div>
    </div>
  );
};

const Column = ({ status, tasks, onTaskDrop }) => {
  const columnRef = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(-1);

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(-1); // Reset drag over index when leaving
  };
  
  const handleDragOver = (e) => {
    // Only handle drags containing our task data type
    if (!e.dataTransfer.types.includes('application/json')) {
      return;
    }
    
    e.preventDefault();
    const rect = columnRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const hoverIndex = Math.min(tasks.length - 1, Math.floor(y / 60));
    setDragOverIndex(hoverIndex);
  };

  const handleDrop = (e) => {
    // Only handle drops with our task data type
    if (!e.dataTransfer.types.includes('application/json')) {
      return;
    }

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

  return (
    <div
      ref={columnRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        padding: "16px",
        backgroundColor: statusColors[status],
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        minHeight: "300px",
        border: "2px solid #ccc",
        position: "relative"
      }}
    >
      <h2 style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "8px" }}>{status}</h2>
      {tasks.map((task, index) => (
        <React.Fragment key={task.id}>
          {dragOverIndex === index && (
            <div style={{
              height: "4px",
              backgroundColor: "#3b82f6",
              margin: "4px 0",
              borderRadius: "2px"
            }} />
          )}
          <TaskCard
            task={task}
            isDraggingOver={dragOverIndex === index}
          />
        </React.Fragment>
      ))}
    </div>
  );
};
export default KanbanBoard;
