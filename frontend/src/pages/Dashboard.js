import React, { useState, useEffect } from 'react';
import { createAgent, getAllTasks, getAllAgents } from '../api/agentApi'; // ✅ Ensure getAllAgents is added
import { uploadCSV } from '../api/uploadApi';

const Dashboard = () => {
  const [agentData, setAgentData] = useState({ name: '', email: '', phone: '', password: '' });
  const [csvFile, setCsvFile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [agents, setAgents] = useState([]); // ✅
  const [selectedAgent, setSelectedAgent] = useState(''); // ✅
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTasks();
    fetchAgents(); // ✅
  }, [selectedAgent]); // ✅ Refetch tasks when filter changes

  const fetchTasks = async () => {
    try {
      const data = await getAllTasks(selectedAgent); // ✅ Pass agent filter
      setTasks(data || []);
    } catch (err) {
      console.error(err);
      setTasks([]);
    }
  };

  const fetchAgents = async () => {
    try {
      const data = await getAllAgents(); // ✅
      setAgents(data || []);
    } catch (err) {
      console.error('Failed to fetch agents');
    }
  };

  const handleAgentChange = (e) => {
    setAgentData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    try {
      await createAgent(agentData);
      setMessage('Agent added successfully');
      setAgentData({ name: '', email: '', phone: '', password: '' });
      fetchAgents(); // ✅ Refresh list
    } catch (err) {
      setMessage(err.response?.data?.message || 'Agent creation failed');
    }
  };

  const handleCSVChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleCSVUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) return;
    const formData = new FormData();
    formData.append('file', csvFile);
    try {
      await uploadCSV(formData);
      setMessage('CSV uploaded and tasks distributed');
      setCsvFile(null);
      fetchTasks();
    } catch (err) {
      setMessage(err.response?.data?.message || 'CSV upload failed');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Admin Dashboard</h2>

      {message && <p style={{ color: 'green' }}>{message}</p>}

      {/* Add Agent Form */}
      <form onSubmit={handleCreateAgent} style={{ marginBottom: '2rem' }}>
        <h3>Add Agent</h3>
        <input type="text" name="name" placeholder="Name" value={agentData.name} onChange={handleAgentChange} required />
        <input type="email" name="email" placeholder="Email" value={agentData.email} onChange={handleAgentChange} required />
        <input type="text" name="phone" placeholder="Phone (+91...)" value={agentData.phone} onChange={handleAgentChange} required />
        <input type="password" name="password" placeholder="Password" value={agentData.password} onChange={handleAgentChange} required />
        <button type="submit">Add Agent</button>
      </form>

      {/* CSV Upload Form */}
      <form onSubmit={handleCSVUpload} style={{ marginBottom: '2rem' }}>
        <h3>Upload CSV</h3>
        <input type="file" accept=".csv,.xlsx,.xls" onChange={handleCSVChange} required />
        <button type="submit">Upload & Distribute</button>
      </form>

      {/* Filter by Agent */}
      <div style={{ marginBottom: '1rem' }}>
        <label>Filter by Agent: </label>
        <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}>
          <option value="">All Agents</option>
          {agents.map((agent) => (
            <option key={agent._id} value={agent._id}>
              {agent.name}
            </option>
          ))}
        </select>
      </div>

      {/* Task Display */}
      <div>
        <h3>Tasks Distributed to Agents</h3>
        {tasks.length === 0 ? (
          <p>No tasks available.</p>
        ) : (
          tasks.map((task, index) => (
            <div key={index} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc' }}>
              <strong>Agent:</strong> {task.assignedTo?.name || 'N/A'}<br />
              <strong>Task:</strong> {task.firstName}<br />
              <strong>Phone:</strong> {task.phone}<br />
              <strong>Notes:</strong> {task.notes}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
