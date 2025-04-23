import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import { TaskCard } from './TaskCard';
import '../css/KanbanBoard.css';
//comment
const initialStatuses = ["Pending", "In Progress", "Resolved", "Closed"];
const statusColors = {
  Pending: "#fef3c7",
  "In Progress": "#bfdbfe",
  Resolved: "#bbf7d0",
  Closed: "#fecaca"
};

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [statuses, setStatuses] = useState(initialStatuses);
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const newColumnInputRef = useRef(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (addingColumn) {
      newColumnInputRef.current?.focus();
    }
  }, [addingColumn]);

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

  const updateTaskOrder = (taskId, newStatus, dropIndex) => {
    console.log(`Attempting to move task ${taskId} to status ${newStatus} at index ${dropIndex}`);

    setTasks(prevTasks => {
      const tasksCopy = [...prevTasks];
      const taskIndex = tasksCopy.findIndex(t => t.id === taskId);

      if (taskIndex === -1) {
        console.error("Task not found for update:", taskId);
        return prevTasks;
      }

      const task = { ...tasksCopy[taskIndex] };

      tasksCopy.splice(taskIndex, 1);

      const targetStatusTasks = tasksCopy.filter(t => t.status === newStatus);

      let finalInsertionIndex;

      if (dropIndex < 0 || dropIndex > targetStatusTasks.length) {
        console.warn("Invalid dropIndex, placing at end of status group.");
        const lastTaskOfTargetStatus = targetStatusTasks.length > 0 ? targetStatusTasks[targetStatusTasks.length - 1] : null;
        if (lastTaskOfTargetStatus) {
          finalInsertionIndex = tasksCopy.findIndex(t => t.id === lastTaskOfTargetStatus.id) + 1;
        } else {
          const statusOrderIndex = statuses.indexOf(newStatus);
          let insertionPoint = tasksCopy.length;
          for(let i = 0; i < tasksCopy.length; i++) {
            if (statuses.indexOf(tasksCopy[i].status) > statusOrderIndex) {
              insertionPoint = i;
              break;
            }
          }
          finalInsertionIndex = insertionPoint;
        }
      } else if (dropIndex === 0) {
        const firstTaskOfTargetStatus = targetStatusTasks.length > 0 ? targetStatusTasks[0] : null;
        if (firstTaskOfTargetStatus) {
          finalInsertionIndex = tasksCopy.findIndex(t => t.id === firstTaskOfTargetStatus.id);
        } else {
          const statusOrderIndex = statuses.indexOf(newStatus);
          let insertionPoint = tasksCopy.length;
          for(let i = 0; i < tasksCopy.length; i++) {
            if (statuses.indexOf(tasksCopy[i].status) > statusOrderIndex) {
              insertionPoint = i;
              break;
            }
          }
          finalInsertionIndex = insertionPoint;
        }
      } else {
        const precedingTask = targetStatusTasks[dropIndex - 1];
        finalInsertionIndex = tasksCopy.findIndex(t => t.id === precedingTask.id) + 1;
      }

      finalInsertionIndex = Math.max(0, Math.min(tasksCopy.length, finalInsertionIndex));

      const updatedTask = { ...task, status: newStatus };
      tasksCopy.splice(finalInsertionIndex, 0, updatedTask);

      return tasksCopy;
    });

    fetch(`${process.env.REACT_APP_API_URL}/ticket/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ complaint_id: taskId, status: newStatus })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Backend status update failed: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Task status update response:", data);
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
              if (userData) {
                sessionStorage.setItem("userData",
                  JSON.stringify({
                    ...userData,
                    complaint_id: null,
                    occupied:0
                  })
                );
              }
            })
            .catch(err => console.error("Error unassigning officers:", err));
        }
      })
      .catch(err => {
        console.error("Error updating task status:", err);
      });
  };

  const handleAddColumn = () => {
    const trimmedName = newColumnName.trim();
    if (trimmedName && !statuses.includes(trimmedName)) {
      setStatuses([...statuses, trimmedName]);
      setNewColumnName("");
      setAddingColumn(false);
    } else if (statuses.includes(trimmedName)) {
      alert("Column name already exists.");
      newColumnInputRef.current?.focus();
    } else {
      setAddingColumn(false);
    }
  };

  const handleCancelAddColumn = () => {
    setNewColumnName("");
    setAddingColumn(false);
  };

  const handleInputChange = (e) => {
    setNewColumnName(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddColumn();
    } else if (e.key === 'Escape') {
      handleCancelAddColumn();
    }
  };

  useEffect(() => {
    const handleSidebarStateChange = (e) => {
      if (e.detail && typeof e.detail.expanded === 'boolean') {
        setSidebarExpanded(e.detail.expanded);
      }
    };

    window.addEventListener('sidebarStateChange', handleSidebarStateChange);
    return () => {
      window.removeEventListener('sidebarStateChange', handleSidebarStateChange);
    };
  }, []);

  return (
    <div className={`kanban-container ${sidebarExpanded ? 'expanded' : ''}`}>
      <Sidebar />

      <div className="kanban-board">
        {statuses.map((status) => (
          <Column
            key={status}
            status={status}
            tasks={tasks.filter(task => task.status === status)}
            onTaskDrop={updateTaskOrder}
          />
        ))}
        <div className="add-column-container">
          {addingColumn ? (
            <div className="add-column-input-container">
              <input
                ref={newColumnInputRef}
                type="text"
                value={newColumnName}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                placeholder="Enter column name..."
                className="add-column-input"
              />
              <div className="add-column-actions">
                <button onClick={handleAddColumn} className="add-column-save">Add column</button>
                <button onClick={handleCancelAddColumn} className="add-column-cancel" aria-label="Cancel">✕</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingColumn(true)}
              className="add-column-button"
            >
              + Add another column
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Column = ({ status, tasks, onTaskDrop }) => {
  const columnRef = useRef(null);
  const tasksContainerRef = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(-1);

  const handleDragLeave = (e) => {
    if (!columnRef.current?.contains(e.relatedTarget)) {
      setDragOverIndex(-1);
    }
  };

  const handleDragOver = (e) => {
    if (!e.dataTransfer.types.includes('application/json')) return;
    e.preventDefault();
    e.stopPropagation();

    const tasksContainer = tasksContainerRef.current;
    if (!tasksContainer) return;

    const rect = tasksContainer.getBoundingClientRect();
    const scrollTop = tasksContainer.scrollTop;
    const y = e.clientY - rect.top + scrollTop;

    let newIndex = tasks.length;
    const taskElements = Array.from(tasksContainer.querySelectorAll('.task-card'));

    for (let i = 0; i < taskElements.length; i++) {
      const card = taskElements[i];
      const cardRect = card.getBoundingClientRect();
      const cardTop = card.offsetTop;
      const cardHeight = card.offsetHeight;
      const cardMidY = cardTop + cardHeight / 2;

      if (y < cardMidY) {
        newIndex = i;
        break;
      }
    }

    if (newIndex !== dragOverIndex) {
      setDragOverIndex(newIndex);
    }
  };

  const handleDrop = (e) => {
    if (!e.dataTransfer.types.includes('application/json')) return;
    e.preventDefault();
    e.stopPropagation();

    try {
      const taskDataString = e.dataTransfer.getData("application/json");
      if (!taskDataString) {
        console.error("No task data found in drag event.");
        setDragOverIndex(-1);
        return;
      }
      const taskData = JSON.parse(taskDataString);
      const dropIndex = dragOverIndex === -1 ? tasks.length : dragOverIndex;

      const taskExists = tasks.some((task, index) => task.id === taskData.id && index === dropIndex);
      const taskOriginStatus = tasks.find(t => t.id === taskData.id)?.status;

      if (!taskExists || taskOriginStatus !== status) {
        console.log(`Dropping task ${taskData.id} into status ${status} at relative index ${dropIndex}`);
        onTaskDrop(taskData.id, status, dropIndex);
      } else {
        console.log("Task drop resulted in no change.");
      }
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
      className="column"
    >
      <div className="column-header">
        <h2 className="column-title">
          {`${status.toUpperCase()} ${tasks.length}`}
        </h2>
      </div>
      <div ref={tasksContainerRef} className="tasks-container">
        {dragOverIndex === 0 && tasks.length > 0 && <div className="drop-indicator" />}
        {tasks.map((task, index) => (
          <React.Fragment key={task.id}>
            {index === 0 && dragOverIndex === 0 && <div className="drop-indicator" />}
            <TaskCard task={task} />
            {dragOverIndex === index + 1 && <div className="drop-indicator" />}
          </React.Fragment>
        ))}
        {dragOverIndex === tasks.length && tasks.length > 0 && <div className="drop-indicator" />}
        {tasks.length === 0 && dragOverIndex === 0 && <div className="drop-indicator" style={{ margin: '4px 0 0 0' }} />}
      </div>
    </div>
  );
};

export default KanbanBoard;
