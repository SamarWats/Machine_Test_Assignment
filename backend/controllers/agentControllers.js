const Agent = require('../models/Agent');
const ListItem = require('../models/ListItem');
const fs = require('fs');
const csvParser = require('csv-parser'); // make sure to install this

// Create a new agent
const createAgent = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await Agent.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Agent already exists' });
    }

    const agent = new Agent({ name, email, mobile: phone, password });
    await agent.save();

    res.status(201).json({
      _id: agent._id,
      name: agent.name,
      email: agent.email,
      mobile: agent.mobile,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Get tasks assigned to all agents
// GET /api/agents/tasks?agentId=<optional>
const getAgentTasks = async (req, res) => {
  try {
    const { agentId } = req.query;
    const filter = agentId ? { assignedTo: agentId } : {};

    const tasks = await ListItem.find(filter).populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};


// @desc    Get tasks assigned to a specific agent
// @route   GET /api/agents/:agentId/tasks
// @access  Private
const getTasksByAgent = async (req, res) => {
  try {
    const { agentId } = req.params;
    const tasks = await ListItem.find({ assignedTo: agentId });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks', error: err.message });
  }
};


// Upload CSV and distribute tasks among agents
const uploadCSVAndDistributeTasks = async (req, res) => {
  try {
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }


    const tasks = [];

    
    fs.createReadStream(req.file.path)
      .pipe(csvParser())
      .on('data', (row) => {
        tasks.push(row);
      })
      .on('end', async () => {
        console.log('CSV rows:', tasks.length);
        const agents = await Agent.find();
        if (agents.length === 0) {
          fs.unlinkSync(req.file.path);
          return res.status(400).json({ message: 'No agents found to assign tasks' });
        }

        await ListItem.deleteMany({});

        const existingPhones = new Set(); // to track duplicates
        const newTasks = [];
        
        tasks.forEach((task, index) => {
          const phone = (task.phone || '').trim();
        
          // Skip if phone is empty or already seen
          if (!phone || existingPhones.has(phone)) return;
        
          existingPhones.add(phone);
          const assignedAgent = agents[index % agents.length];
        
          newTasks.push({
            firstName: task.firstName?.trim() || '',
            phone,
            notes: task.notes?.trim() || '',
            assignedTo: assignedAgent._id,
          });
        });
        

        await ListItem.insertMany(newTasks);

        fs.unlinkSync(req.file.path);

        console.log(`Inserted ${newTasks.length} tasks`);

        res.status(200).json({ message: 'CSV processed successfully', tasksCount: newTasks.length });
      })
      .on('error', (error) => {
        console.error('CSV parse error:', error);
        fs.unlinkSync(req.file.path);
        res.status(500).json({ message: 'CSV parsing failed', error: error.message });
      });
  } catch (error) {
    console.error('CSV processing error:', error);
    res.status(500).json({ message: 'CSV processing failed', error: error.message });
  }
};

// Get all agents
const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find({}, '-password');  // exclude password
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching agents', error: err.message });
  }
};

module.exports = {
  createAgent,
  getAgentTasks,
  getTasksByAgent,
  uploadCSVAndDistributeTasks,
  getAllAgents,
};




// module.exports = {
//   createAgent,
//   getAgentTasks,
//   uploadCSVAndDistributeTasks,
//   getTasksByAgent,
// };
