const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  projectType: {
    type: String,
    enum: ['House Construction', 'Apartment Construction', 'Commercial Building', 'Renovation', 'Interior Design'],
    required: true,
  },
  budget: { type: String },
  location: { type: String },
  source: {
    type: String,
    enum: ['Website', 'Referral', 'Social Media', 'Walk-in', 'Phone Call', 'Other'],
    default: 'Website',
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Site Visit Scheduled', 'Quotation Sent', 'Converted', 'Closed'],
    default: 'New',
  },
  notes: [noteSchema],
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
