import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";



const statuses = ["Pending", "In Progress", "Resolved", "Closed"];
const statusColors = {
  "Pending": "#fef3c7",
  "In Progress": "#bfdbfe",
  "Resolved": "#bbf7d0",
  "Closed": "#fecaca"
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
          id: task.complaint_id/* ,
          order: task.order || Date.now() // Add temporary order if missing */
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
      
      // Update task status and order
      const updatedTask = { ...task, status: newStatus };
      
      // Insert at calculated position or at the end
      const finalIndex = insertIndex >= 0 ? insertIndex : tasksCopy.length;
      tasksCopy.splice(finalIndex, 0, updatedTask);
      
      return tasksCopy;
    });
  
    // Update backend
    /* `${process.env.REACT_APP_API_URL}/police/register` */
    fetch(`${process.env.REACT_APP_API_URL}/ticket/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        complaint_id: taskId,  // Use taskId as complaint_id
        status: newStatus  // Update status
      })
    })
    .then(response => response.json())
    .then(data => console.log("API Response:", data))
    .catch(error => console.error("Error calling API:", error));
  };
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", padding: "16px", flexGrow: 1 }}>
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
const TaskModal = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <div 
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          cursor: "pointer"
        }} 
        onClick={onClose}
      />
      <div style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        zIndex: 1001,
        maxWidth: "500px",
        width: "90%"
      }}>
        <h2 style={{ marginBottom: "16px" }}>Complaint Details</h2>
        {Object.entries(task).map(([key, value]) => (
          <p key={key} style={{ margin: "8px 0" }}>
            <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong> {value}
          </p>
        ))}
        <button 
          style={{
            marginTop: "16px",
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

const TaskCard = ({ task, isDraggingOver, onClick }) => {
  const [showModal, setShowModal] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ id: task.id })
    );
    e.target.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
  };

  const handleCardClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <React.Fragment>
      <div 
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleCardClick}
        style={{ 
          padding: "8px", 
          marginBottom: "8px", 
          cursor: "grab", 
          backgroundColor: "white", 
          boxShadow: isDraggingOver ? "0 4px 8px rgba(0,0,0,0.2)" : "0 2px 4px rgba(0,0,0,0.1)", 
          border: "1px solid #ccc", 
          borderRadius: "4px",
          transition: "transform 0.2s, box-shadow 0.2s",
          transform: isDraggingOver ? "scale(1.02)" : "none",
          position: "relative"
        }}
      >
        <p><strong>{task.crime_type}</strong></p>
        <p style={{ fontSize: "12px", color: "gray" }}>{task.complainant_name}</p>
      </div>
      {showModal && <TaskModal task={task} onClose={handleCloseModal} />}
    </React.Fragment>
  );
};
const Column = ({ status, tasks, onTaskDrop }) => {
  const columnRef = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(-1);

  const handleDragOver = (e) => {
    e.preventDefault();
    const rect = columnRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const hoverIndex = Math.min(tasks.length - 1, Math.floor(y / 60)); // 60px per task
    setDragOverIndex(hoverIndex);
  };

  const handleDragLeave = () => {
    setDragOverIndex(-1);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const taskData = JSON.parse(e.dataTransfer.getData("application/json"));
    const rect = columnRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const dropIndex = Math.min(tasks.length, Math.floor(y / 60));
    
    onTaskDrop(taskData.id, status, dropIndex);
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
