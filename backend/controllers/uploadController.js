const csv = require('csv-parser');
const XLSX = require('xlsx');
const ListItem = require('../models/ListItem');
const Agent = require('../models/Agent');
const { Readable } = require('stream');

// Parse CSV buffer
const parseCSV = (buffer) => {
  return new Promise((resolve, reject) => {
    const items = [];
    const stream = Readable.from(buffer.toString());

    stream
      .pipe(csv())
      .on('data', (row) => {
        if (row.FirstName && row.Phone && row.Notes) {
          items.push({
            firstName: row.FirstName,
            phone: row.Phone,
            notes: row.Notes
          });
        }
      })
      .on('end', () => resolve(items))
      .on('error', reject);
  });
};

// Parse Excel file buffer
const parseExcel = (buffer) => {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(sheet);
  return jsonData.map(row => ({
    firstName: row.FirstName,
    phone: row.Phone,
    notes: row.Notes,
  }));
};

// Upload and distribute items
const uploadAndDistribute = async (req, res) => {
  try {
    const file = req.file;

    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    let parsedItems = [];
    const ext = file.originalname.toLowerCase().split('.').pop();

    if (ext === 'csv') {
      parsedItems = await parseCSV(file.buffer);
    } else if (ext === 'xlsx' || ext === 'xls') {
      parsedItems = parseExcel(file.buffer);
    } else {
      return res.status(400).json({ message: 'Unsupported file format' });
    }

    if (!parsedItems.length) {
      return res.status(400).json({ message: 'No valid items found in file' });
    }

    const agents = await Agent.find();

    if (agents.length < 1) {
      return res.status(400).json({ message: 'No agents found to assign tasks' });
    }

    // Distribution logic
    const total = parsedItems.length;
    const baseCount = Math.floor(total / agents.length);
    let remainder = total % agents.length;

    const distributed = [];
    let index = 0;

    for (let agent of agents) {
      let count = baseCount + (remainder-- > 0 ? 1 : 0);
      const itemsForAgent = parsedItems.slice(index, index + count).map(item => ({
        ...item,
        assignedTo: agent._id,
      }));
      index += count;
      distributed.push(...itemsForAgent);
    }

    // Save to DB
    await ListItem.insertMany(distributed);

    res.status(200).json({ message: 'Items uploaded and distributed successfully', total: distributed.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

module.exports = { uploadAndDistribute };
