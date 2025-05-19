const express = require('express');
const router = express.Router();
const multer = require('multer');  // <-- Import multer here

const {
    createAgent,
    getAgentTasks,             // <-- THIS must exactly match
    getTasksByAgent,
    uploadCSVAndDistributeTasks,
    getAllAgents,
  } = require('../controllers/agentControllers');
  


const { protect } = require('../middleware/authMiddleware');

const upload = multer({ dest: 'uploads/' }); // temporary storage for uploaded files

// Only admin (logged-in user) can add agents
router.post('/', protect, createAgent);

// Only admin (logged-in user) can view tasks assigned to all agents
router.get('/tasks', protect, getAgentTasks);
router.get('/:agentId/tasks', protect, getTasksByAgent);
router.get('/', protect, getAllAgents);  // GET /api/agents to get all agents



// CSV upload route with multer middleware to handle file upload
router.post('/upload-csv', protect, upload.single('file'), uploadCSVAndDistributeTasks);

module.exports = router;
