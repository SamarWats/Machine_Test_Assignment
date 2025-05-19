const mongoose = require('mongoose');

const listItemSchema = new mongoose.Schema({
  firstName: String,
  phone: String,
  notes: String,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
  },
}, { timestamps: true });

module.exports = mongoose.model('ListItem', listItemSchema);
