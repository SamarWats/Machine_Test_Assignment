// src/api/agentApi.js
import API from './axios';

export const createAgent = async (agentData) => {
  const response = await API.post('/agents', agentData);
  return response.data;
};

// Get all agents
export const getAllAgents = async () => {
  const res = await API.get('/agents');
  return res.data;
};

// Get tasks (optionally filtered by agentId)
export const getAllTasks = async (agentId = '') => {
  const res = await API.get(`/agents/tasks${agentId ? `?agentId=${agentId}` : ''}`);
  return res.data;
};
